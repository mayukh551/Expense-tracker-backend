const Joi = require('joi');

function errorHandler(err, req, res, next) {
    console.log("Error is", err);
    res.status(err.status).json({ error: err, isSuccess: false, message: message })
}

module.exports = errorHandler;