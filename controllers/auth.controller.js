// const moment = require("moment");
const bcrypt = require('bcryptjs');
const Joi = require('joi');
const expressAsyncHandler = require('express-async-handler');
const moment = require('moment');
const RequestHandler = require('../utils/RequestHandler');
const Logger = require('../utils/logger');
const { returnPromise, updateQueryBuilder } = require('../utils/common');
const { generateToken } = require('../utils/auth');

const logger = new Logger();
const requestHandler = new RequestHandler(logger);

exports.signUp = expressAsyncHandler(async (req, res) => {
	const {
		companyName, userEmail, userPswd, userRole = 'manager', isAdmin = true,
	} = req.body;
	try {
		const schema = Joi.object({
			companyName: Joi.string().required(),
			userEmail: Joi.string().email().required(),
			userPswd: Joi.string().min(6).required(),
		});
		const { error } = schema.validate({
			companyName,
			userEmail,
			userPswd,
		});

		if (error) {
			return requestHandler.validateJoi(error, 400, 'bad Request', error ? error.details[0].message : '');
		}
		const fetchUserByEmailQuery = `SELECT * FROM users where user_email='${userEmail}';`;
		const existingUser = await returnPromise(fetchUserByEmailQuery);
		if (existingUser[0] && existingUser[0].user_id) {
			return requestHandler.throwError(400, 'bad request', 'invalid email account,email already existed')();
		}
		const result = {
			companyName, userEmail, isAdmin, userRole,
		};
		const addCompanyQuery = `INSERT INTO companies(comp_name) VALUES('${companyName}');`;
		const company = await returnPromise(addCompanyQuery);
		const addSubscriptionQuery = `INSERT INTO subscriptions(subs_start_date,subs_end_date,subs_comp_id) VALUES('${moment().format('YYYY-MM-DD 00:00:00')}','${moment().add(7, 'd').format('YYYY-MM-DD 23:59:59')}',${company.insertId});`;
		await returnPromise(addSubscriptionQuery);
		result.companyId = company.insertId;
		const addEmployeeQuery = `INSERT INTO employees (emp_email,emp_comp_id,emp_is_manager) 
		VALUE ('${userEmail}',${company.insertId},${true})`;
		const employee = await returnPromise(addEmployeeQuery);
		result.empId = employee.insertId;
		const addUserQuery = `INSERT INTO users (user_email,user_pswd,user_comp_id,user_emp_id,user_role,user_is_admin) 
      VALUES ('${userEmail}','${bcrypt.hashSync(userPswd, 8)}',${company.insertId},${employee.insertId},'${userRole}',${isAdmin});`;
		const user = await returnPromise(addUserQuery);
		result.userId = user.insertId;
		const token = generateToken(result);
		return res.send({ ...result, token });
	} catch (err) {
		return res.status(500).send({ message: err.message });
	}
});

exports.login = expressAsyncHandler(async (req, res) => {
	const { email, pswd } = req.body;
	try {
		const schema = Joi.object({
			email: Joi.string().email().required(),
			pswd: Joi.string().required(),
		});
		const { error } = schema.validate({
			email,
			pswd,
		});

		if (error) {
			return requestHandler.validateJoi(error, 400, 'bad Request', error ? error.details[0].message : '');
		}

		const fetchUserByEmailQuery = `SELECT * FROM users where user_email='${email}';`;
		const user = await returnPromise(fetchUserByEmailQuery);
		if (!user[0]) {
			return requestHandler.throwError(400, 'bad request', 'your email is not registered with us')();
		}
		if (user[0].user_is_active !== 1) {
			return requestHandler.throwError(400, 'bad request', 'your account is not active')();
		}


		if (bcrypt.compareSync(pswd, user[0].user_pswd)) {
			const {
				user_id: userId, user_email: userEmail, user_is_admin: isAdmin, user_role: userRole,
				user_comp_id: companyId, user_emp_id: empId,
			} = user[0];
			return res.send({
				userId,
				userEmail,
				isAdmin: isAdmin === 1,
				userRole,
				companyId,
				empId,
				token: generateToken({
					userId, userEmail, isAdmin, userRole, companyId, empId,
				}),
			});
		}
		return res.status(401).send({ message: 'Invalid Email or Password' });
	} catch (error) {
		return res.status(500).send({ message: error.message });
	}
});

exports.updatePassword = expressAsyncHandler(async (req, res) => {
	const { userPswd } = req.body;
	const { userId, empId } = req.query;

	try {
		const schema = Joi.object({
			userId: Joi.number(),
			empId: Joi.number(),
			userPswd: Joi.string().min(6).required(),
		});
		const { error } = schema.validate({
			userId,
			userPswd,
		});

		if (error) {
			return requestHandler.validateJoi(error, 400, 'bad Request', error ? error.details[0].message : '');
		}

		const fetchUserByEmailQuery = `SELECT * FROM users where user_id='${userId}' OR user_emp_id='${empId}';`;
		const user = await returnPromise(fetchUserByEmailQuery);
		if (!user[0]) {
			return requestHandler.throwError(400, 'bad request', 'user not found')();
		}
		const { query, values } = updateQueryBuilder('users', 'user_id', user[0].user_id, { userPswd: bcrypt.hashSync(req.body.userPswd, 8) });
		await returnPromise(query, values);
		return res.send({ message: 'Password Reset successfully' });
	} catch (error) {
		return res.status(500).send({ message: error.message });
	}
});

exports.logOut = expressAsyncHandler((req, res) => res.send({ message: 'user logged out successfully' }));
