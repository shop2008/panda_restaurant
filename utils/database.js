const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'pandaRestaurant',
  password: 'root0909',
});

module.exports = pool.promise();
