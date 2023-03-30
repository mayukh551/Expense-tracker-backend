const statusCodes = require('../config/statusCode');

/**
 * @param {number} status - The HTTP status code
 * @param {string} message - Contains custom error messages (if provided) or default error messages
 * @param {string} apiEndpoint - Contains the api endpoint where the error has occurred
 * @methods toString( ), toJSON( )
 * @properties status, apiEndpoint, timestamp, name, description
 * @description  Class create Error instances for Auth related errors or unwanted attempts.
 */


class AppError extends Error {
    constructor(status, message = '', apiEndpoint = 'Unknown') {
        super();

        // if status provided, else 503
        this.status = status !== undefined ? status : 503;

        // setting message and description using status
        this.message = message || statusCodes[status].message;
        this.description = statusCodes[status].description;

        // additional details for finding errors
        this.timestamp = new Date().toISOString();

        // should be treated as private variable.
        // Do not access or modify this variable directly
        this._apiEndpoint = apiEndpoint;
    }

    /* 
    Override the default toString method to provide a better error message
    the message provides: timestamp, error name, statusCode, and error message
    */
    toString() {
        return `${this.apiEndpoint} - ${this.name} [${this.status}]: ${this.message}`;
    }

    // toJSON method to return a JSON representation of the error
    toJSON() {
        return {
            name: this.name,
            status: this.status,
            message: this.message,
            timestamp: this.timestamp,
            apiEndpoint: this._apiEndpoint,
            description: this.description
        }
    }
}

module.exports = AppError;