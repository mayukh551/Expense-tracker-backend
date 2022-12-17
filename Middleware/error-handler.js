function errorHandler(err, req, res, next) {
    console.log("error caught", err.type);
    console.log("Error is", err);
    const { status = 500, message = 'Server Error' } = err;
    res.status(status).json({ error: err, isSuccess: false, message: message })
}

module.exports = errorHandler;