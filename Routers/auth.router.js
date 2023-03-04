const express = require('express');
const router = express.Router();
const { login, register } = require('../Controllers/authController');
const asyncWrap = require('../Middleware/async-wrapper');
const { validateUserLoginSchema, validateUserRegisterSchema } = require('../Middleware/schema-validator');

router.route('/login').post(validateUserLoginSchema, asyncWrap(login));

router.route('/register').post(validateUserRegisterSchema, asyncWrap(register));

module.exports = router;