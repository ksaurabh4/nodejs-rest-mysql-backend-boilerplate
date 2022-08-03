const bcrypt = require('bcryptjs');
const Joi = require('joi');
const expressAsyncHandler = require('express-async-handler');
const RequestHandler = require('../utils/RequestHandler');
const Logger = require('../utils/logger');
const {
	returnPromise, updateQueryBuilder, addQueryBuilder, makeResponseData,
} = require('../utils/common');
const config = require('../config/appconfig');

const logger = new Logger();
const requestHandler = new RequestHandler(logger);

exports.createCompany = expressAsyncHandler(async (req, res) => {
	const {
		companyName,
		companyAddress,
		companyCity,
		companyState,
		companyCountry,
		companyZip,
		companyWebsite,
		companyPhone,
		companyEmail,
	} = req.body;
	try {
		const schema = Joi.object({
			companyName: Joi.string().required(),
			companyAddress: Joi.string(),
			companyCity: Joi.string(),
			companyCountry: Joi.string().required(),
			companyState: Joi.string(),
			companyZip: Joi.string(),
			companyWebsite: Joi.string(),
			companyPhone: Joi.number().required(),
			companyEmail: Joi.string().email().required(),
		});
		const { error } = schema.validate({
			companyName,
			companyAddress,
			companyCity,
			companyState,
			companyCountry,
			companyZip,
			companyWebsite,
			companyPhone,
			companyEmail,
		});

		if (error) {
			return requestHandler.validateJoi(error, 400, 'bad Request', error ? error.details[0].message : '');
		}
		const fetchCompanyByCompanyEmail = `SELECT * FROM companies where comp_email='${companyEmail}';`;
		const existingCompany = await returnPromise(fetchCompanyByCompanyEmail);
		if (existingCompany[0] && existingCompany[0].comp_id) {
			return requestHandler.throwError(400, 'bad request', 'Company with this email already existed')();
		}
		const { query, dataObj } = addQueryBuilder('companies', req.body);
		const company = await returnPromise(query, dataObj);
		const addUserQuery = `INSERT INTO users (user_email,user_pswd,user_comp_id,user_role,user_is_admin) 
      VALUES ('${companyEmail}','${bcrypt.hashSync(config.auth.user_default_password, config.auth.saltRounds)}',${company.insertId},'manager',${true});`;
		const user = await returnPromise(addUserQuery);
		const addEmployeeQuery = `INSERT INTO employees (emp_email,emp_comp_id,emp_is_manager,emp_user_id) 
		VALUE ('${companyEmail}',${company.insertId},${true},${user.insertId})`;
		await returnPromise(addEmployeeQuery);
		return res.send({ message: 'Company added successfully' });
	} catch (err) {
		return res.status(500).send({ message: err.message });
	}
});

exports.updateCompanyById = expressAsyncHandler(async (req, res) => {
	const compId = req.params.id;
	const {
		compName,
		compAddress,
		compCity,
		compState,
		compCountry,
		compZip,
		compWebsite,
		compPhone,
		compEmail,
		compPlanId,
		subsIsActive,
	} = req.body;
	try {
		const schema = Joi.object({
			compName: Joi.string(),
			compAddress: Joi.string(),
			compCity: Joi.string(),
			compCountry: Joi.string(),
			compState: Joi.string(),
			compZip: Joi.string(),
			compWebsite: Joi.string(),
			compPhone: Joi.number(),
			compEmail: Joi.string().email(),
			compId: Joi.number().required(),
			compPlanId: Joi.number(),
		});
		const { error } = schema.validate({
			compName,
			compAddress,
			compCity,
			compState,
			compCountry,
			compZip,
			compWebsite,
			compPhone,
			compEmail,
			compId,
			compPlanId,
		});
		if (error) {
			return requestHandler.validateJoi(error, 400, 'bad Request', error ? error.details[0].message : '');
		}
		const getcompanyBycompanyIdQuery = `SELECT * from companies WHERE comp_id=${compId}`;
		const company = await returnPromise(getcompanyBycompanyIdQuery);
		if (!company[0]) {
			return requestHandler.validateJoi(error, 404, 'bad Request', 'No company found');
		}
		let updateSubsQuery = `UPDATE subscriptions SET subs_plan_id=${compPlanId}`;

		if (subsIsActive !== 'Yes' && subsIsActive !== 'No') {
			updateSubsQuery += `, subs_is_active=${subsIsActive}`;
			const userStatusUpdate = `UPDATE users SET user_is_active=${subsIsActive} WHERE user_comp_id = ${compId};`;
			await returnPromise(userStatusUpdate);
		}
		updateSubsQuery += ` WHERE subs_comp_id = ${compId};`;
		await returnPromise(updateSubsQuery);
		delete req.body.subsIsActive;
		delete req.body.compPlanId;

		if (Object.keys(req.body).length > 0) {
			const { query, values } = updateQueryBuilder('companies', 'comp_id', compId, req.body);
			await returnPromise(query, values);
		}
		return res.send({ message: 'Company data updated successfully' });
	} catch (err) {
		return res.status(500).send({ message: err.message });
	}
});

exports.getCompanyById = expressAsyncHandler(async (req, res) => {
	const compId = req.params.id;
	try {
		const schema = Joi.object({
			compId: Joi.number().min(1),
		});
		const { error } = schema.validate({
			compId,
		});
		if (error) {
			return requestHandler.validateJoi(error, 400, 'bad Request', error ? error.details[0].message : '');
		}
		const getCompanyByCompanyIdQuery = `SELECT * from companies WHERE comp_id=${compId}`;
		const company = await returnPromise(getCompanyByCompanyIdQuery);
		if (!company[0]) {
			return requestHandler.validateJoi(error, 404, 'bad Request', 'No company found');
		}
		const response = makeResponseData('companies', company[0]);
		return res.send(response);
	} catch (err) {
		return res.status(500).send({ message: err.message });
	}
});

exports.fetchCompaniesList = expressAsyncHandler(async (req, res) => {
	try {
		const query = `SELECT comp.comp_id 'compId',comp.comp_website 'compWebsite',comp.comp_email 'compEmail',comp.comp_name 'compName',
        comp.comp_address 'compAddress',comp.comp_city 'compCity',comp.comp_state compState,comp.comp_country
        'compCountry', comp.comp_zip 'compZip', comp.comp_phone 'compPhone', subs.subs_is_active 'subsIsActive',
				plan.plan_id as compPlanId, plan.plan_name as compPlanName
                FROM companies comp 
                LEFT JOIN subscriptions subs
                ON (comp.comp_id=subs.subs_comp_id)
                LEFT JOIN plans plan
                ON (subs.subs_plan_id=plan.plan_id);`;
		const response = await returnPromise(query);
		return res.send(response);
	} catch (err) {
		return res.status(500).send({ message: err.message });
	}
});
