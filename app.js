var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var sampleRouter = require('./routes/hello');
var processUsageRouter = require('./routes/process-usage');
var systemUsageRouter = require('./routes/system-usage');
var systemHardwareRouter = require('./routes/system-hardware');
var consoleErrorRouter = require('./routes/console-error');
var readConsoleLogRouter =require('./routes/read-console-log');
var readLogsRouter =require('./routes/read-logs');
var app = express();
var cors = require('cors')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Enable CORS for ALL Requests
app.use(cors());

//Default set of routes
app.use('/', indexRouter);
app.use('/users', usersRouter);

//User defined routes for our logic
app.use("/hello", sampleRouter);
app.use("/system/usage/all", systemUsageRouter);
app.use("/system/hardware", systemHardwareRouter);
app.use("/system/usage/process", processUsageRouter);
app.use("/system/consoleError", consoleErrorRouter);
app.use("/system/readConsoleLog", readConsoleLogRouter);
app.use("/system/readLogs", readLogsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
