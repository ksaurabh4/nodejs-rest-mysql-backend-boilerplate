const Joi = require('joi');
const expressAsyncHandler = require('express-async-handler');
const RequestHandler = require('../utils/RequestHandler');
const Logger = require('../utils/logger');
const {
	returnPromise, updateQueryBuilder, addQueryBuilder, makeResponseData,
} = require('../utils/common');

const logger = new Logger();
const requestHandler = new RequestHandler(logger);

exports.createSubscription = expressAsyncHandler(async (req, res) => {
	const {
		subsStartDate,
		subsEndDate,
		subsIsActive,
		companyId,
		planId,
	} = req.body;
	try {
		const schema = Joi.object({
			subsStartDate: Joi.date().iso().required(),
			subsEndDate: Joi.date().iso().required(),
			subsIsActive: Joi.boolean().required(),
			companyId: Joi.number().min(1).required(),
			planId: Joi.number().min(1).required(),
		});
		const { error } = schema.validate({
			subsStartDate,
			subsEndDate,
			subsIsActive,
			companyId,
			planId,
		});

		if (error) {
			return requestHandler.validateJoi(error, 400, 'bad Request', error ? error.details[0].message : '');
		}
		const fetchSubsByCompanyId = `SELECT * FROM subscriptions where subs_comp_id='${companyId}';`;
		const existingSubs = await returnPromise(fetchSubsByCompanyId);
		if (existingSubs[0] && existingSubs[0].subs_id) {
			return requestHandler.throwError(400, 'bad request', 'Subscription with this clientId already existed')();
		}
		const { query, dataObj } = addQueryBuilder('subscriptions', req.body);
		await returnPromise(query, dataObj);
		return res.send({ message: 'Subscription added successfully' });
	} catch (err) {
		return res.status(500).send({ message: err.message });
	}
});

exports.updateSubscriptionById = expressAsyncHandler(async (req, res) => {
	const subsId = req.params.id;
	const {
		subsStartDate,
		subsEndDate,
		subsIsActive,
		planId,
		companyId,
	} = req.body;
	try {
		const schema = Joi.object({
			subsStartDate: Joi.date().iso(),
			subsEndDate: Joi.date().iso(),
			subsIsActive: Joi.boolean(),
			planId: Joi.number().min(1),
			subsId: Joi.number().min(1),
			companyId: Joi.number().min(1).required(),
		});
		const { error } = schema.validate({
			subsStartDate,
			subsEndDate,
			subsIsActive,
			planId,
			companyId,
			subsId,
		});
		if (error) {
			return requestHandler.validateJoi(error, 400, 'bad Request', error ? error.details[0].message : '');
		}
		const getSubsBySubsIdQuery = `SELECT * from subscriptions WHERE subs_id=${subsId} and subs_comp_id=${companyId}`;
		const subs = await returnPromise(getSubsBySubsIdQuery);
		if (!subs[0]) {
			return requestHandler.validateJoi(error, 404, 'bad Request', 'No subscription found');
		}
		if (Object.keys(req.body).length > 0) {
			const { query, values } = updateQueryBuilder('subscriptions', 'subs_id', subsId, req.body);
			await returnPromise(query, values);
		}
		return res.send({ message: 'Subscription data updated successfully' });
	} catch (err) {
		return res.status(500).send({ message: err.message });
	}
});

exports.getSubscriptionById = expressAsyncHandler(async (req, res) => {
	const subsId = req.params.id;
	const { companyId } = req.body;
	try {
		const schema = Joi.object({
			subsId: Joi.number().min(1),
			companyId: Joi.number().min(1).required(),
		});
		const { error } = schema.validate({
			companyId,
			subsId,
		});
		if (error) {
			return requestHandler.validateJoi(error, 400, 'bad Request', error ? error.details[0].message : '');
		}
		const getSubsBySubsIdQuery = `SELECT * from subscriptions WHERE subs_id=${subsId} and subs_comp_id=${companyId}`;
		const subs = await returnPromise(getSubsBySubsIdQuery);
		if (!subs[0]) {
			return requestHandler.validateJoi(error, 404, 'bad Request', 'No subscription found');
		}
		const response = makeResponseData('subscriptions', subs[0]);
		return res.send(response);
	} catch (err) {
		return res.status(500).send({ message: err.message });
	}
});
