const jwt = require('jsonwebtoken');
const db = require('../config/db1');

module.exports = (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return next();
    }

    db.query(
        "SELECT * FROM refresh_tokens WHERE token=?",
        [refreshToken],
        (dbErr, result) => {

            if (dbErr) {
                console.error(dbErr);
                return next();
            }

            if (result.length === 0) {
                return next();
            }

            jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, user) => {
                if (err) {
                    return next();
                }

                // already logged in
                return res.redirect("/rendering");
            });
        }
    );
};
