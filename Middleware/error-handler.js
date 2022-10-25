function errorLogger(err, req, res, next) {
    if (!err.type)
        console.log("error caught", "failed to add or fetch expenses");
    else
        console.log("error caught", err.type);
    console.log("Error is", err);
    next(err);
}

function errorResponder(err, req, res, next) {
    console.log("Sending appropriate msg to user")

    if (err.type === "AUTH_ERROR")
        res.status(404).json({ error: err, message: 'auth error' })
    else if (err.type === 'INVALID_ID')
        res.status(404).json({ error: err, message: "Item ID is incorrect!" })
    else
        next(err);
}

function failSafeHandler(err, req, res, next) {
    res.status(500).json({ error: err, message: "Server Error" })
}

module.exports = {
    errorLogger,
    errorResponder,
    failSafeHandler
}