const jwt = require('jsonwebtoken');
const AuthError = require('../Error/AuthError');

const verifyUser = (req, res, next) => {
    require("dotenv").config({ path: '../.env' });
    const privateKey = process.env.PRIVATE_KEY;
    try {
        const token = req.headers['x-access-token'];
        if (!token)
            throw new AuthError('Unauthorized attempt');
        var decoded = jwt.verify(token, privateKey);
        if (decoded) {
            req['user-email'] = decoded.email;
            next();
        } else {
            throw new AuthError('Unauthorized attempt');
        }


    } catch (error) {
        next(error);
    }
}

module.exports = verifyUser;