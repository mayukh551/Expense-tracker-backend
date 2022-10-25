const express = require('express');
const router = express.Router();
const { login, register } = require('../Controllers/authController');
const asyncWrap = require('../Middleware/async-wrapper');

router.route('/login', asyncWrap(login, 'login Successful!'));

router.route('/register', asyncWrap(register, 'registration Successful!'));

module.exports = router;