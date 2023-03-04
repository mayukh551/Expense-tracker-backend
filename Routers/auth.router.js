const express = require('express');
const router = express.Router();
const { login, register } = require('../Controllers/authController');
const asyncWrap = require('../Middleware/async-wrapper');
const { validateUserSchema } = require('../Middleware/schema-validator');

router.route('/login').post(validateUserSchema, asyncWrap(login));

router.route('/register').post(validateUserSchema, asyncWrap(register));

module.exports = router;