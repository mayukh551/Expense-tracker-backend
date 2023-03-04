const Joi = require('joi');
const JoiObjectId = require('joi-objectid')(Joi);
const CrudError = require('../Error/CrudError');

function validateExpenseSchema(req, res, next) {
    const expenseSchema = Joi.object({
        id: Joi.string().required().trim(),
        userId: JoiObjectId.required(),
        date: Joi.string().required().trim().min(10).max(10),
        title: Joi.string().required().trim().min(1).max(40),
        amount: Joi.number().required().trim().min(1).max(999999999999999)
    })

    const { error } = expenseSchema.validate(req.body);

    if (error) next(new CrudError(error.name));
    else next();
}

function validateUserSchema(req, res, next) {
    const userSchema = Joi.object({
        name: Joi.string().required().trim().min(1).max(40),
        email: Joi.string().email().required().trim().min(1).max(40),
        password: Joi.string().required().trim().min(6).max(1000000),
    })

    const { error } = userSchema.validate(req.body);

    if (error) next(new CrudError(error.name));
    else next();
}

module.exports = {
    validateExpenseSchema,
    validateUserSchema
};