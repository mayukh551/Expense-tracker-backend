const jwt = require('jsonwebtoken');
const AuthError = require('../Error/AuthError');
const asyncWrap = require('./async-wrapper')

const verifyUser = (req, res, next) => {

    const apiEndpoint = req.originalUrl;

    require("dotenv").config({ path: '../.env' });
    const privateKey = process.env.PRIVATE_KEY;
    try {
        const token = req.headers['x-access-token'];
        if (!token)
            throw new AuthError(401, 'Unauthorized Attempt!', apiEndpoint);
        var decoded = jwt.verify(token, privateKey);
        if (decoded) {
            req['user-email'] = decoded.email;
            next();
        } else {
            throw new AuthError(401, 'Unauthorized Attempt!', apiEndpoint);
        }


    } catch (error) {
        next(new AuthError(401, 'Unauthorized Attempt!', apiEndpoint, error));
    }
}

module.exports = verifyUser;