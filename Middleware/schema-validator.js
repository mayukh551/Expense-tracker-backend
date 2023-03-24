const Joi = require('joi');
const JoiObjectId = require('joi-objectid')(Joi);
const ValidationError = require('../Error/ValidationError');

function validateSchema(schema, req, next) {
    const { error } = schema.validate(req.body);
    if (error) next(new ValidationError(400, error.details[0].message, req.originalUrl));
    else next();
}

function validateExpenseSchema(req, res, next) {
    const expenseSchema = Joi.object({
        id: Joi.string().required().trim(),
        userId: JoiObjectId,
        date: Joi.string().required().trim().min(10).max(10),
        month: Joi.string().required().trim().min(1).max(3),
        year: Joi.string().required().trim().min(4).max(4),
        title: Joi.string().required().trim().min(1).max(40),
        amount: Joi.number().required().min(1).max(999999999999999)
    })

    validateSchema(expenseSchema, req, next);
}

function validateUserLoginSchema(req, res, next) {

    const userLoginSchema = Joi.object({
        email: Joi.string().email().required().trim().min(1).max(40),
        password: Joi.string().required().trim().min(6).max(1000000),
    })

    validateSchema(userLoginSchema, req, next);
}

function validateUserRegisterSchema(req, res, next) {
    const userRegisterSchema = Joi.object({
        name: Joi.string().required().trim().min(1).max(40),
        email: Joi.string().email().required().trim().min(1).max(40),
        password: Joi.string().required().trim().min(6).max(1000000),
    })

    validateSchema(userRegisterSchema, req, next);
}

module.exports = {
    validateExpenseSchema,
    validateUserLoginSchema,
    validateUserRegisterSchema
};