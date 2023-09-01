const AppError = require('./AppError');

class UserError extends AppError {
    constructor(status, message, apiEndpoint) {
        super(status, message, apiEndpoint);
        this.name = this.constructor.name;
    }
}

module.exports = UserError;