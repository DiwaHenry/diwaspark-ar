const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/authMiddleware');
const alreadyAuthMiddleware = require('../middleware/alreadyAuthMiddleware');
const noCacheMiddleware = require('../middleware/noCacheMiddleware');

router.get('/', noCacheMiddleware, alreadyAuthMiddleware, (req, res) => {
    res.render('index');
});

router.get('/rendering', noCacheMiddleware, authMiddleware, (req, res) => {
    res.render("splash");
});

router.get('/scanner', noCacheMiddleware, authMiddleware, (req, res) => {
    res.render("scanner");
});

module.exports = router;