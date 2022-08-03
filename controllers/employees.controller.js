const bcrypt = require('bcryptjs');
const Joi = require('joi');
const expressAsyncHandler = require('express-async-handler');
const RequestHandler = require('../utils/RequestHandler');
const Logger = require('../utils/logger');
const {
	returnPromise,
	updateQueryBuilder,
	fetchEmployeeListWithMultipleParamsQueryBuilder,
	addQueryBuilder,
} = require('../utils/common');
const config = require('../config/appconfig');

const logger = new Logger();
const requestHandler = new RequestHandler(logger);

exports.createEmployee = expressAsyncHandler(async (req, res) => {
	const {
		companyId, empName, empEmail, empAddress, empCity, empState,
		empCountry, empManagerId, isManager = false,
		isAdmin = false,
	} = req.body;
	try {
		const schema = Joi.object({
			companyId: Joi.number().required(),
			empEmail: Joi.string().email().required(),
			empName: Joi.string().required(),
			empCity: Joi.string().required(),
			empState: Joi.string().required(),
			empAddress: Joi.string(),
			empCountry: Joi.string().required(),
			empManagerId: Joi.number(),
		});
		const { error } = schema.validate({
			companyId,
			empEmail,
			empName,
			empAddress,
			empCity,
			empState,
			empCountry,
			empManagerId,
		});

		if (error) {
			return requestHandler.validateJoi(error, 400, 'bad Request', error ? error.details[0].message : '');
		}
		const fetchUserByEmailQuery = `SELECT * FROM users where user_email='${empEmail}';`;
		const existingUser = await returnPromise(fetchUserByEmailQuery);
		if (existingUser[0] && existingUser[0].user_id) {
			return requestHandler.throwError(400, 'bad request', 'employee with this email already existed')();
		}
		// 	const addEmployeeQuery = `INSERT INTO employees
		// (emp_email, emp_code, emp_name, emp_phone, emp_adress, emp_city, emp_state, emp_country, emp_zip, emp_dept, emp_sub_dept, emp_designation, emp_is_manager, emp_manager_id, emp_comp_id)
		// VALUES('${empEmail}','${empCode}' ,'${empName}','${empPhone}', '${empAddress}', '${empCity}', '${empState}', '${empCountry}', '${empZip}', '${empDept}', '${empSubDept}', '${empDesignation}', ${isManager}, ${empManagerId}, ${companyId});`;

		const { query, dataObj } = addQueryBuilder('employees', req.body);

		// const employee = await returnPromise(addEmployeeQuery);
		const employee = await returnPromise(query, dataObj);

		if (employee.insertId) {
			const addUserQuery = `INSERT INTO users (user_email,user_pswd,user_comp_id,user_emp_id,user_role) 
      VALUES ('${empEmail}','${bcrypt.hashSync(config.auth.user_default_password, config.auth.saltRounds)}',${companyId},${employee.insertId},'${isManager ? 'manager' : 'user'}');`;
			await returnPromise(addUserQuery);
		}
		return res.send({ message: 'Employee create successfully' });
	} catch (err) {
		return res.status(500).send({ message: err.message });
	}
});

exports.getEmployeeById = expressAsyncHandler(async (req, res) => {
	const empId = req.params.id;
	const { companyId } = req.user;
	try {
		const schema = Joi.object({
			empId: Joi.number().min(1),
		});
		const { error } = schema.validate({
			empId,
		});
		if (error) {
			requestHandler.validateJoi(error, 400, 'bad Request', 'invalid Employee Id');
		}
		const getEmployeeByIdAndCompanyIdQuery = `SELECT e1.emp_id 'empId', e1.emp_email 'empEmail', e1.emp_name 'empName',
			e1.emp_adress 'empAddress', e1.emp_city 'empCity', e1.emp_state empState, e1.emp_country
		'empCountry', e1.emp_zip 'empZip', e1.emp_dept 'empDept', e1.emp_sub_dept 'empSubDept',
			e1.emp_designation 'empDesignation', e1.emp_is_manager 'isManager', e1.emp_manager_id
		'empManagerId', e1.emp_comp_id 'companyId', e1.emp_phone 'empPhone', e1.emp_code 'empCode', e2.emp_name 'empManagerName', e2.emp_phone 'empManagerPhone', e2.emp_email 'empManagerEmail'
                FROM employees e1 
                LEFT JOIN employees e2
		ON(e1.emp_manager_id = e2.emp_id) WHERE e1.emp_id=${empId} and e1.emp_comp_id=${companyId};`;
		const employee = await returnPromise(getEmployeeByIdAndCompanyIdQuery);
		if (!employee[0]) {
			return requestHandler.validateJoi(error, 404, 'bad Request', 'No employee found');
		}
		// const response = makeResponseData('employees', employee[0]);
		return res.send(employee[0]);
	} catch (err) {
		return res.status(500).send({ message: err.message });
	}
});

exports.updateById = expressAsyncHandler(async (req, res) => {
	const empId = req.params.id;
	const { companyId } = req.user;
	try {
		const schema = Joi.object({
			empId: Joi.number().min(1),
		});
		const { error } = schema.validate({
			empId,
		});
		if (error) {
			return requestHandler.validateJoi(error, 400, 'bad Request', 'invalid Employee Id');
		}

		const getEmployeeByIdAndCompanyIdQuery = `SELECT * from employees WHERE emp_id=${empId} and emp_comp_id=${companyId};`;
		const employee = await returnPromise(getEmployeeByIdAndCompanyIdQuery);
		if (!employee[0]) {
			return requestHandler.validateJoi(error, 404, 'bad Request', 'No employee found with this id');
		}
		if ('isAdmin' in req.body || 'isManager' in req.body) {
			const formatIsManager = () => {
				if (req.body.isManager === undefined) {
					return null;
				} if (req.body.isManager === 1 || req.body.isManager === true) {
					return 'manager';
				}
				return 'user';
			};
			const { query, values } = updateQueryBuilder('users', 'user_email', employee[0].emp_email,
				{ isAdmin: req.body.isAdmin, userRole: formatIsManager() });
			await returnPromise(query, values);
			delete req.body.isAdmin;
		}
		if (Object.keys(req.body).length > 0) {
			const { query, values } = updateQueryBuilder('employees', 'emp_id', empId, req.body);
			await returnPromise(query, values);
		}
		return res.send({ message: 'Employee data updated successfully' });
	} catch (err) {
		return res.send({ message: err.message });
	}
});

exports.fetchEmployeesList = expressAsyncHandler(async (req, res) => {
	const { companyId } = req.query;
	try {
		const schema = Joi.object({
			companyId: Joi.number().required(),
		});
		const { error } = schema.validate({
			companyId,
		});

		if (error) {
			return requestHandler.validateJoi(error, 400, 'bad Request', error ? error.details[0].message : '');
		}
		const query = fetchEmployeeListWithMultipleParamsQueryBuilder('employees', req.query, req.user.empId);
		const response = await returnPromise(query);
		return res.send(response);
	} catch (err) {
		return res.status(500).send({ message: err.message });
	}
});
