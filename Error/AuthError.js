class AuthError extends Error {
    constructor(message) {
        super();
        this.message = message;
        this.status = 401;
    }
}

module.exports = AuthError;