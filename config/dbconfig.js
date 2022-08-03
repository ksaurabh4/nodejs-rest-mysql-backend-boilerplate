const mysql = require('mysql');
const config = require('./appconfig');

const pool = mysql.createPool({
	connectionLimit: 10,
	queueLimit: 100,
	host: config.db.host,
	port: config.db.port,
	user: config.db.username,
	password: config.db.password,
	database: config.db.database,
	connectTimeout: 10000,
	waitForConnections: true,
	acquireTimeout: 10000,
	debug: false,
});

pool.on('connection', (connection) => {
	console.log('MySQL DB Connection established');
});

pool.on('acquire', (connection) => {
	console.log('Connection %d acquired', connection.threadId);
});

pool.on('enqueue', () => {
	console.log('Waiting for available connection slot...');
});

pool.on('release', (connection) => {
	console.log('Connection %d released', connection.threadId);
});

module.exports = pool;
