const jwt = require('jsonwebtoken');
const db = require('../config/db1');

module.exports = (req, res, next) => {
   
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

   // No tokens at all
  if (!accessToken && !refreshToken) {
    return res.redirect("/");
  }

   // Try verifying access token first
  jwt.verify(accessToken, process.env.JWT_SECRET, (err, user) => {

    if (!err) {
      req.user = user;
      return next(); // still valid
    }

    // If access token expired → try refresh
    if (!refreshToken) return res.redirect("/");

    db.query(
        "SELECT * FROM refresh_tokens WHERE token=?",
        [refreshToken],
        (dbErr, result) => {

            if (result.length === 0) return res.redirect("/");
            jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, user) => {
                if (err) return res.redirect("/");

                const payload = {
                    id: user.id,
                    schoolid: user.schoolid,
                    username: user.username
                };

                // Generate NEW tokens
                const newAccessToken = jwt.sign(payload, process.env.JWT_SECRET, {
                    expiresIn: "15m"
                });

                const newRefreshToken = jwt.sign(payload, process.env.REFRESH_SECRET, {
                    expiresIn: "7d"
                });

                // Update refresh token in DB
                db.query(
                    "UPDATE refresh_tokens SET token=? WHERE token=?",
                    [newRefreshToken, refreshToken]
                );

                // Set new cookies
                res.cookie("accessToken", newAccessToken, {
                    httpOnly: false,
                    secure: true,
                    path: "/"
                });

                res.cookie("refreshToken", newRefreshToken, {
                    httpOnly: false,
                    secure: true,
                    path: "/"
                });

                req.user = payload;

                next(); // continue request WITHOUT logout

            });

        }
    );
  });

};