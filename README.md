# nodejs-rest-mysql-backend-boilerplate!

The quickest way to get start with Node.Js, Express & MySQL, just clone the project:

```bash
$ git clone 
```

Install dependencies:

```bash
$ npm install
```

Start Express.js app at `http://localhost:3000/`:

```bash
$ npm start
```

# Nodemon

Nodemon will watch the files in the directory in which nodemon was started, and if any files change, nodemon will automatically restart your node application.

Start Express.js app with nodemon at `http://localhost:3000/`:

```bash
$ nodemon bin/www
```

# Node PortFinder

Node PortFinder is a tool to find an open port or domain socket on the machine.

```js
var portfinder = require('portfinder');
var port = 3000;
var portSpan = 999;
portfinder.getPort({
  port: port,    // minimum port number
  stopPort: port + portSpan // maximum port number
}, function (err, openPort) {
  if (err) throw err;
  port = openPort;
});
```

# Nodejs Cluster

Node.js runs in a single process, by default. Ideally, we want one process for each CPU core, so we can distribute the workload across all the cores. Hence improving the scalability of web apps handling HTTP requests and performance in general. In addition to this, if one worker crashes, the others are still available to handle requests.

```js
var cluster = require('cluster');
var workers = process.env.WORKERS || require('os').cpus().length;

if (cluster.isMaster) {
  console.log('Master cluster is running on %s with %s workers', process.pid, workers);
  for (var i = 0; i < workers; ++i) {
    var worker = cluster.fork().process;
    console.log('worker %s on %s started', i+1, worker.pid);
  }
  cluster.on('exit', function(worker, code, signal) {
    console.log('worker %s died. restarting...', worker.process.pid);
    cluster.fork();
  });
}

if (cluster.isWorker) {
  // Server code
}
```

# Logger - Morgan & Winston

Morgan - HTTP request logger middleware for node.js:

```js
var logger = require('morgan');
app.use(logger('dev'));
app.use(logger(':remote-addr :remote-user :datetime :req[header] :method :url HTTP/:http-version :status :res[content-length] :res[header] :response-time[digits] :referrer :user-agent', {
    stream: accessLogStream
}));
```

Winston - is designed to be a simple and universal logging library with support for multiple transports:

```js
var winston = require('winston');
var logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.colorize({
        all: true
    }),
    winston.format.printf(
        data => `${data.level} : ${data.message}`
    )
  ),
  transports: [
    new winston.transports.Console({
      level: 'silly'
    }),
    new winston.transports.File({
      level: 'silly',
      filename: './log/ServerData.log'
    })
  ]
});
```
# MySQL Database Connectivity (with connection pool)

This is a node.js driver for mysql. Also implemented the connection pool, it is a cache of database connections maintained so that the connections can be reused when future requests to the database are required. Connection pools are used to enhance the performance of executing commands on a database.

```js
var mysql = require('mysql');
var pool  = mysql.createPool({
  connectionLimit : 50, // The maximum number of connections to create at once. (Default: 10)
  queueLimit: 100, // The maximum number of connection requests the pool will queue before returning an error from getConnection. (Default: 0)
  host : '127.0.0.1', // The hostname of the database you are connecting to. (Default: localhost)
  port : 3306, // The port number to connect to. (Default: 3306)
  user : 'kumar', // The MySQL user to authenticate as.
  password : '', // The password of that MySQL user.
  database : 'mysqldb', // Name of the database to use for this connection.
  connectTimeout : 10000, // The milliseconds before a timeout occurs during the initial connection to the MySQL server. (Default: 10000)
  waitForConnections: true, // Determines the pool's action when no connections are available and the limit has been reached. (Default: true)
  acquireTimeout: 10000, // The milliseconds before a timeout occurs during the connection acquisition. (Default: 10000)
  debug : false // Prints protocol details to stdout. (Default: false)
});
```
