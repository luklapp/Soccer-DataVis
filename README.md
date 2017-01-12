# InfoVis Soccer API

## DB.js
Mysql requires a secret file called db.js.
Path: "apis/soccer/db.js"
### Content
    var mysql      = require('mysql');
    module.exports = mysql.createConnection({
        host     : 'localhost',
        user     : '*user*',
        password : '*pwd*',
        database : '*database name*',
        socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
      });
