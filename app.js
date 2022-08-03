const toobusy = require('node-toobusy');
const express = require('express');
const path = require('path');
const cors = require('cors');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const compression = require('compression');
const { v4: uuid } = require('uuid');
const Logger = require('./utils/logger');
const config = require('./config/appconfig');

const logger = new Logger();

// Generating an express app
const app = express();
app.set('config', config); // the system configrationsx
// Express Status Monitor for monitoring server status
app.use(require('express-status-monitor')({
	title: 'Server Status',
	path: '/status',
	// socketPath: '/socket.io', // In case you use a custom path for socket.io
	// websocket: existingSocketIoInstance,
	spans: [{
		interval: 1,
		retention: 60,
	}, {
		interval: 5,
		retention: 60,
	}, {
		interval: 15,
		retention: 60,
	}],
	chartVisibility: {
		cpu: true,
		mem: true,
		load: true,
		eventLoop: true,
		heap: true,
		responseTime: true,
		rps: true,
		statusCodes: true,
	},
	healthChecks: [{
		protocol: 'http',
		host: 'localhost',
		path: '/',
		port: '3000',
	}],
	// ignoreStartsWith: '/admin'
}));

// compress all responses
app.use(compression());

const swagger = require('./utils/swagger');
// middleware which blocks requests when server is too busy
app.use((req, res, next) => {
	if (toobusy()) {
		res.status(503);
		res.send('Server is busy right now, sorry.');
	} else {
		next();
	}
});

app.use(cors());
// Allowing access headers and requests
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'HEAD, OPTIONS, GET, POST, PUT, PATCH, DELETE, CONNECT');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
	next();
});


// Helmet helps for securing Express apps by setting constious HTTP headers
app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(favicon(path.join(__dirname, 'public', 'ficon.ico')));

// logging request
app.use((req, res, next) => {
	req.identifier = uuid();
	const logString = `a request has been made with the following uuid [${req.identifier}] ${req.url} ${req.headers['user-agent']} ${JSON.stringify(req.body)}`;
	logger.log(logString, 'info');
	next();
});

// simple route
app.get('/', (req, res) => {
	res.json({ message: 'Welcome to API Service' });
});

// Swagger route
app.use('/api/docs', swagger.router);

// Linking routes
app.use(require('./router'));

// catch 404 and forward to error handler
app.use((req, res, next) => {
	logger.log('the url you are trying to reach is not hosted on our server', 'error');
	const err = new Error('Not Found');
	err.status = 404;
	res.status(err.status).json({ type: 'error', message: 'the url you are trying to reach is not hosted on our server' });
	next(err);
});

// error handler
app.use((err, req, res, next) => {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	res.status(err.status || 500);
	// uncomment to just send error as JSON
	res.send({ message: err.message });
	// uncomment to render the error page
	// res.render('error');
});

process.on('SIGINT', () => {
	logger.log('stopping the server', 'info');
	process.exit();
});

// globally catching unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
	console.error(`Unhandled Rejection at promise ${promise}  reason`, reason);
	console.log('Server is still running...\n');
});

// globally catching unhandled exceptions
process.on('uncaughtException', (error) => {
	console.error(`Uncaught Exception is thrown with, ${error} \n`);
	process.exit();
});

module.exports = app;
