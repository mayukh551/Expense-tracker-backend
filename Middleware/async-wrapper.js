// try-catch wrapper function for controllers
function asyncWrap(fn, msg) {
    return (req, res, next) => {
        fn(req, res, next)
            .catch(err => next(err))
    }
}

module.exports = asyncWrap;