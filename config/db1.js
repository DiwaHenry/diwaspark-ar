const mysql = require('mysql2');
require('dotenv').config();

const db1 = mysql.createConnection({
    host: process.env.DB1_HOST,
    user: process.env.DB1_USER,
    password: process.env.DB1_PASS,
    database: process.env.DB1_NAME
});

db1.connect((err) => {
    if(err) throw err;
    console.log("MYSQL connected...");
});

module.exports = db1; 