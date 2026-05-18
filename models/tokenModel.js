const db1 = require('../config/db1');

// Save refresh token
exports.storeToken = (userid, token, callback) => {
    const sql = "INSERT INTO refresh_tokens (user_id, token) VALUES (?, ?)";
    db1.query(sql, [userid, token], callback);
}

// Find token
exports.findToken = (token, callback) => {
    const sql =  "SELECT * FROM refresh_tokens WHERE token=?";
    db1.query(sql, [token], callback);
}

// Delete token by id
exports.deleteToken = (token, callback) => {
    const sql = "DELETE FROM refresh_tokens WHERE token=?";
    db1.query(sql, [token], callback);
}
