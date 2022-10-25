const User = require('../Models/user.model.js');

const login = async (req, res, next) => {
    console.log('in login');
}

const register = async (req, res, next) => {
    console.log('in register');
    try {
        const { username, email, password } = req.body;
        const newUser = await new User({
            username: username,
            email: email,
            password: password
        })
    }
    catch (err) {
        next(err);
    }

}