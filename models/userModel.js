const db2 = require('../config/db2');

// find specific user
exports.findUser = (schoolid, username, callback) => {
    const sql = "SELECT * FROM users WHERE schoolid = ? AND username = ?";
    db2.query(sql, [schoolid, username], callback);
}