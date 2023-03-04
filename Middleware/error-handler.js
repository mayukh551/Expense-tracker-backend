const Joi = require('joi');

function errorHandler(err, req, res, next) {
    if (err instanceof Joi.ValidationError) {
        return res.status(400).json({ error: err.details[0].message });
    }
    console.log("Error is", err);
    const { status = 500, message = 'Server Error' } = err;
    res.status(status).json({ error: err, isSuccess: false, message: message })
}

module.exports = errorHandler;