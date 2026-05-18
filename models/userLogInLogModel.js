const db1 = require('../config/db1');

// insert logs
exports.storeLogs = ($logs_data, callback) => {
    db1.query("INSERT INTO user_login_logs SET ?", $logs_data, callback);
}