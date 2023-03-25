/**
 * @function errorHandler
 * @param {object} err Instance of an Error Class
 * @param {object} req The HTTP request object
 * @param {object} res The HTTP response object       
 * @param {Function} next A function to move to next middleware function
 * @returns error
 * @description a middleware function that handle all types of error and send it to the client in response
 */
function errorHandler(err, req, res, next) {
    console.log("Error is", err);
    var status = !err.status ? 500 : err.status;
    res.status(status).json({ error: err, isSuccess: false, message: err.message })
}

module.exports = errorHandler;