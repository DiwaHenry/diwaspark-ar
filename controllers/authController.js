const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UAParser = require("ua-parser-js");
const userModel = require('../models/userModel');
const tokenModel = require('../models/tokenModel');
const userLoginLogModel = require('../models/userLoginLogModel');

// Generate Token
const generateAccessToken = (user) => {
    return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "15m" });
}

const generateRefreshToken = (user) => {
    return jwt.sign(user, process.env.REFRESH_SECRET, { expiresIn: "7d" });
}


// Login process
exports.login = (req, res) => {
    const { schoolid, username, password } = req.body;
    const parser = new UAParser(req.headers["user-agent"]);
    const user_agent = parser.getResult();
    console.log('user_agent', user_agent);
  
    userModel.findUser(schoolid, username, async (err, results) => {
        if(err) return res.status(500).json(err);

        if(results.length === 0){
            return res.status(401).json({ message: "User not found" })
        }

        const user = results[0];
        const hash = user.password.replace(/^\$2y\$/, '$2b$');
        const isMatch = await bcrypt.compare(password, hash);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const payload = {
            id: user.id,
            schoolid: user.schoolid,
            username: user.username
        }

        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        res.cookie("accessToken", accessToken, {
            httpOnly: false,
            secure: true,
            path: "/"
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: false,
            secure: true,
            path: "/"
        });

        const logs_data = {
            user_id: user.id,
            username: user.username,
            user_agent: user_agent.ua,
            device_type: user_agent.device.type,
            browser: user_agent.browser.name,
            os: user_agent.os.name,
            refresh_token: refreshToken
        }

        userLoginLogModel.storeLogs(logs_data, (err, results) => {
            console.log('err', err);
            if(err) {
                return res.status(500).json({ error: "Something went wrong." });
            }

            tokenModel.storeToken(user.id, refreshToken, (err, results) => {
                if(err){ 
                    return res.status(500).json({ error: "Something went wrong." })
                }

                return res.json({ message: "Login successful" });
            });
        });

        
     
    });

}


// Refresh token
exports.refresh = (req, res) => {
    const { token } = req.body;
    if(!token) return res.sendStatus(401);

    tokenModel.findToken(token, (err, refreshToken) => {
        if(refreshToken.length === 0) return res.sendStatus(403);

        jwt.verify(token, REFRESH_SECRET, (err, user) => {
            if (err) return res.sendStatus(403);

            const newAccessToken = generateAccessToken({
                id: user.id,
                schoolid: user.schoolid,
                username: user.username
            })
        });

        res.json({ accessToken: newAccessToken });
    });

}


// logout
exports.logout = (req, res) => {
    const { token } = req.body;

    tokenModel.deleteToken(token, () => {
         res.json({ message: "Logged out successfully" });
    });

}