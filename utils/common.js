// const express = require('express');
const pool = require('../config/dbconfig');
const { table } = require('./constant');

exports.returnPromise = (query, values) => new Promise((resolve, reject) => {
	if (values) {
		pool.query(query, values, (error, results) => {
			if (error) {
				return reject(error);
			}
			return resolve(results);
		});
	} else {
		pool.query(query, (error, results) => {
			if (error) {
				return reject(error);
			}
			return resolve(results);
		});
	}
});

/**
 *
 * @param {string} tableName
 * @param {string} dbKey
 * @param {string} searchTerm
 * @param {any} searchValue
 * @param {object} reqBody
 * @returns object of update query string and values aray[]
 */
exports.updateQueryBuilder = (tableName, searchTerm, searchValue, reqBody) => {
	let query = `UPDATE ${tableName} SET `;
	const values = [];
	Object.keys(reqBody).forEach((key) => {
		if (reqBody[key] !== undefined && reqBody[key] !== null) {
			query += `${table[tableName][key]}=?, `;
			values.push(reqBody[key]);
		}
	});
	query = query.substr(0, query.length - 2);
	query += ` WHERE ${searchTerm}=?`;
	values.push(searchValue);
	return { query, values };
};

exports.addQueryBuilder = (tableName, reqBody) => {
	const query = `INSERT INTO ${tableName} SET ?`;
	const dataObj = {};
	Object.keys(reqBody).forEach((key) => {
		if (reqBody[key] !== undefined && reqBody[key] !== null) {
			dataObj[table[tableName][key]] = reqBody[key];
		}
	});
	return { query, dataObj };
};

exports.fetchWithMultipleParamsQueryBuilder = (tableName, reqParams) => {
	let query = 'SELECT ';
	const fields = Object.keys(table[tableName]);
	fields.forEach((field) => {
		if (fields[fields.length - 1] === field) {
			query += `${table[tableName][field]} as ${field}`;
		} else {
			query += `${table[tableName][field]} as ${field},`;
		}
	});
	query += ` from ${tableName} WHERE `;

	if (reqParams.startDate && reqParams.endDate) {
		query += `goal_review_start_date >= '${reqParams.startDate}' AND goal_review_start_date <='${reqParams.endDate}' AND `;
	}

	delete reqParams.startDate;
	delete reqParams.endDate;

	const params = Object.keys(reqParams);

	params.forEach((param) => {
		if (params[0] === param && reqParams[param] !== undefined && reqParams[param] !== null) {
			query += `${table[tableName][param]}=${reqParams[param]}`;
		}
		if (params[0] !== param && reqParams[param] !== undefined && reqParams[param] !== null) {
			query += ` AND ${table[tableName][param]}=${reqParams[param]}`;
		}
	});
	query += ';';
	return query;
};

exports.fetchEmployeeListWithMultipleParamsQueryBuilder = (tableName, reqParams, empId) => {
	let query = `SELECT e1.emp_id 'empId',e1.emp_email 'empEmail',e1.emp_name 'empName',
        e1.emp_adress 'empAddress',e1.emp_city 'empCity',e1.emp_state empState,e1.emp_country
        'empCountry', e1.emp_zip 'empZip', e1.emp_dept 'empDept', e1.emp_sub_dept 'empSubDept',
                e1.emp_designation 'empDesignation', e1.emp_is_manager 'isManager', e1.emp_manager_id 
'empManagerId', e1.emp_comp_id 'companyId', e1.emp_phone 'empPhone', e1.emp_code 'empCode', e2.emp_name 'empManagerName'
                FROM employees e1 
                LEFT JOIN employees e2
                ON (e1.emp_manager_id=e2.emp_id) Where `;

	const params = Object.keys(reqParams);
	params.forEach((param) => {
		if (params[0] === param && reqParams[param] !== undefined && reqParams[param] !== null) {
			query += `e1.${table[tableName][param]}=${reqParams[param]}`;
		}
		if (params[0] !== param && reqParams[param] !== undefined && reqParams[param] !== null) {
			query += ` AND e1.${table[tableName][param]}=${reqParams[param]}`;
		}
	});
	query += ` OR e1.emp_id=${empId};`;
	return query;
};

exports.fetchEmployeeOptionList = (tableName, reqParams) => {
	let query = 'SELECT emp_id as empId, emp_name as empName';

	query += ` from ${tableName} WHERE `;

	const params = Object.keys(reqParams);

	params.forEach((param) => {
		if (params[0] === param && reqParams[param] !== undefined && reqParams[param] !== null) {
			query += `${table[tableName][param]}=${reqParams[param]}`;
		}
		if (params[0] !== param && reqParams[param] !== undefined && reqParams[param] !== null) {
			query += ` AND ${table[tableName][param]}=${reqParams[param]}`;
		}
	});
	query += ';';
	return query;
};


function objectFlip(obj) {
	const ret = {};
	Object.keys(obj).forEach((key) => {
		ret[obj[key]] = key;
	});
	return ret;
}

exports.makeResponseData = (tableName, data) => {
	const dataObj = {};
	const reverseObj = objectFlip(table[tableName]);
	Object.keys(data).forEach((key) => {
		if (key.includes('_is_') && data[key] === 1) {
			dataObj[reverseObj[key]] = true;
		} else if (key.includes('_is_') && data[key] === 0) {
			dataObj[reverseObj[key]] = false;
		} else {
			dataObj[reverseObj[key]] = data[key];
		}
	});
	return dataObj;
};
