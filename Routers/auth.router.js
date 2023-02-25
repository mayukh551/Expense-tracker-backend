const express = require('express');
const router = express.Router();
const { login, register } = require('../Controllers/authController');
const asyncWrap = require('../Middleware/async-wrapper');

router.route('/login').post(asyncWrap(login));

router.route('/register').post(asyncWrap(register));

module.exports = router;