'use strict';

module.exports = function(app) {
 
  var mysql      = require('mysql');
  var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'tableau'
  });

  connection.connect();

  app.get('/soccer', function(req, res) {
    debugger
    res.send({
      code: 418,
      message: 'I\'m a teapot'
    })
  });
}