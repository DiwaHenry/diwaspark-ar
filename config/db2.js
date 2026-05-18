const mysql = require('mysql2');
require('dotenv').config();

const db2 = mysql.createConnection({
    host: process.env.DB2_HOST,
    user: process.env.DB2_USER,
    password: process.env.DB2_PASS,
    database: process.env.DB2_NAME
});

db2.connect((err) => {
    if(err) throw err;
    console.log("MYSQL connected...");
});

module.exports = db2; 