const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'bikehotel',
    password: '123456789'
});

module.exports = pool.promise();