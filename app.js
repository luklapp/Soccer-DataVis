var express = require('express');
var path = require('path');
var logger = require('morgan');

var app = express();

app.use(logger('dev'));

app.get('*', function(req, res) {
  res.send('Nothing to see here');
});

// API routes
const normalizedPath = require("path").join(__dirname, "./apis/");
require("fs").readdirSync(normalizedPath).forEach(function(file) {
  require(normalizedPath + file + '/routes/routes.js')(app);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// production error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;