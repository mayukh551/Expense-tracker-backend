const express = require('express');
const router = express.Router();
const { login, register } = require('../Controllers/authController');
const asyncWrap = require('../Middleware/async-wrapper');

router.route('/login').post(asyncWrap(login, 'login Successful!'));

router.route('/register').post(asyncWrap(register, 'registration Successful!'));

module.exports = router;