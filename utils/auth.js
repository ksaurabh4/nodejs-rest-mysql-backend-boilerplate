const jwt = require('jsonwebtoken');
const _ = require('lodash');
const config = require('../config/appconfig');
const RequestHandler = require('../utils/RequestHandler');
const Logger = require('../utils/logger');

const logger = new Logger();
const requestHandler = new RequestHandler(logger);


function generateToken(user) {
	const {
		userId, userEmail, isAdmin, userRole, companyId, empId,
	} = user;
	return jwt.sign(
		{
			userId, userEmail, isAdmin, userRole, companyId, empId,
		},
		config.auth.jwt_secret,
		// {
		// 	expiresIn: config.auth.jwt_expiresin,
		// },
	);
}

function isUserCompanyAdmin(req, res, next) {
	if (req.user && req.user.isAdmin && req.user.companyId === req.body.companyId) {
		next();
	} else {
		res.status(401).send({ message: 'Invalid Admin Token' });
	}
}

function isUserSuperAdmin(req, res, next) {
	if (req.user && req.user.userRole === 'superadmin') {
		next();
	} else {
		res.status(401).send({ message: 'Invalid Super Admin Token' });
	}
}

function isUserCompanyAdminOrSuperAdmin(req, res, next) {
	if (req.user && (req.user.userRole === 'superadmin' || req.user.isAdmin)) {
		next();
	} else {
		res.status(401).send({ message: 'Invalid Token' });
	}
}

function isUserSuperAdminOrCompanyAdminOrManager(req, res, next) {
	if (req.user && (req.user.userRole === 'superadmin' || (req.user.companyId === parseInt(req.query.companyId, 10) && (req.user.isAdmin || req.user.userRole === 'manager')))) {
		next();
	} else {
		res.status(401).send({ message: 'Invalid Token' });
	}
}

function isUserManagerOrHimself(req, res, next) {
	if (req.user && (req.user.companyId === req.body.companyId && (req.user.userRole === 'manager' || req.user.empId === req.body.empId))) {
		next();
	} else {
		res.status(401).send({ message: 'Invalid Token' });
	}
}
function isSuperAdminOrCompanyAdminOrHimself(req, res, next) {
	if (req.user && (req.user.userRole === 'superadmin' || req.user.isAdmin || req.user.userId === parseInt(req.query.userId,10) || req.user.empId === parseInt(req.query.empId, 10))) {
		next();
	} else {
		res.status(401).send({ message: 'Invalid Token' });
	}
}
function getTokenFromHeader(req) {
	if ((req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token')
		|| (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')) {
		return req.headers.authorization.split(' ')[1];
	}

	return null;
}

function verifyToken(req, res, next) {
	try {
		if (_.isUndefined(req.headers.authorization)) {
			requestHandler.throwError(401, 'Unauthorized', 'Not Authorized to access this resource!')();
		}
		const Bearer = req.headers.authorization.split(' ')[0];

		if (!Bearer || Bearer !== 'Bearer') {
			requestHandler.throwError(401, 'Unauthorized', 'Not Authorized to access this resource!')();
		}

		const token = req.headers.authorization.split(' ')[1];

		if (!token) {
			requestHandler.throwError(401, 'Unauthorized', 'Not Authorized to access this resource!')();
		}

		// verifies secret and checks exp
		jwt.verify(token, config.auth.jwt_secret, (err, decoded) => {
			if (err) {
				requestHandler.throwError(401, 'Unauthorized', 'please provide a valid token ,your token might be expired')();
			}
			req.user = decoded;
			next();
		});
	} catch (err) {
		requestHandler.sendError(req, res, err);
	}
}

module.exports = {
	getJwtToken: getTokenFromHeader,
	isAuthunticated: verifyToken,
	generateToken,
	isUserCompanyAdmin,
	isUserSuperAdmin,
	isUserCompanyAdminOrSuperAdmin,
	isUserSuperAdminOrCompanyAdminOrManager,
	isUserManagerOrHimself,
	isSuperAdminOrCompanyAdminOrHimself,
};
