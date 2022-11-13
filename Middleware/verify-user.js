const jwt = require('jsonwebtoken');
const AuthError = require('../Error/AuthError');
// const privateKey = process.env.PRIVATE_KEY;
const privateKey = '3546asdfa06a5sas6dfgas564as';;

const verifyUser = (req, next) => {
    try {
        const token = req.headers['x-access-token'];
        console.log('token received', token);
        if (!token)
            next(new AuthError('Unauthorized attempt'));
        var decoded;
        if (token) {
            console.log('before verification');
            try {
                decoded = jwt.verify(token, privateKey);
            } catch (error) {
                // throw new Error('verification failed');
                throw new AuthError('Unauthorized attempt');
            }
            console.log('after verification');
            if (decoded) {
                return decoded;

            } else {
                throw new AuthError('Unauthorized attempt');
            }
        }
    } catch (error) {
        next(error);
    }
}

module.exports = verifyUser;