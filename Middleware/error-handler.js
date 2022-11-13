function errorLogger(err, req, res, next) {
    console.log("error caught", err.type);
    console.log("Error is", err);
    next(err);
}

function errorResponder(err, req, res, next) {
    console.log("Sending appropriate msg to user")
    const { status = 500, message = 'Server Error' } = err;
    res.status(status).json({ error: err, isSuccess: false, message: message })
    next(err);
}

function failSafeHandler(err, req, res, next) {
    res.status(500).json({ error: err, isSuccess: false, message: "Server Error" })
}

module.exports = {
    errorLogger,
    errorResponder,
    failSafeHandler
}