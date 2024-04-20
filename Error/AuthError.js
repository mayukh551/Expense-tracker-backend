const AppError = require("./AppError");

class AuthError extends AppError {
    constructor(status, message, apiEndpoint, err = undefined) {
        super(status, message, apiEndpoint);
        this.name = this.constructor.name;

        // If the error object is provided

        if (err) {
            if (err.name === 'TokenExpiredError')
                this.message = 'Your token has expired!';

            else if (err.name === 'JsonWebTokenError')
                this.message = 'You have provided an invalid token!';
        }
    }
}

module.exports = AuthError;