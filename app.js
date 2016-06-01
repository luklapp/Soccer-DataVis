var express = require('express');
var path = require('path');
var logger = require('morgan');

var app = express();
var http = require('http').Server(app);

app.use(logger('dev'));

// Load APIs
const normalizedPath = require("path").join(__dirname, "./apis/");
require("fs").readdirSync(normalizedPath).forEach(function(file) {
  try {
    require(normalizedPath + file + '/api.js')(app);
  }
  catch (err) {
    console.log('Appears like an Api module couldn`t be required');
    console.log(err);
  }
});

app.get('*', function(req, res) {
  res.send('Nothing to see here');
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
  res.send('error', {
    message: err.message,
    error: {}
  });
});

http.listen(7878, function() {
  console.log('There we go ♕');
  console.log('Gladly listening on http://127.0.0.1:7878');
});
