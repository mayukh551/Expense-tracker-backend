const User = require('../Models/user.model.js');

const login = async (req, res, next) => {
    console.log('in login');
    try {
        const user = await User.findOne({ email: req.body.email })
        if (user) {
            res.status(200).json({ status: 'success' })
        }
        else {
            throw new Error('Login failed!');
        }
    } catch (error) {
        error.type = 'AUTH_ERROR'
        next(error);
    }
}

const register = async (req, res, next) => {
    console.log('in register');
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            err.type = 'authError'
            next(err);
        }

        const newUser = await new User({
            username: username,
            email: email,
            password: password
        })
        res.status(200).json({ status: 'success' })
    }
    catch (err) {
        err.type = 'AUTH_ERROR'
        next(err);
    }
}


module.exports = {
    login,
    register
}