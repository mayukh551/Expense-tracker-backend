const User = require('../Models/user.model.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AuthError = require('../Error/AuthError');


const register = async (req, res, next) => {
    console.log('in register');
    console.log(req.body);
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        next(new AuthError('Verification Failed'));
    }

    // To check if account already exists with the same email
    if (email) {
        const user = await User.findOne({ email: email });
        if (user)
            next(new AuthError('You already have an existing account. Log in!'));
    }

    // hashing password for storage in DB
    const hashedPassword = await bcrypt.hash(password, 10)
    console.log(name, email, hashedPassword);
    const newUser = new User({
        name: name,
        email: email,
        password: hashedPassword
    });
    await newUser.save();
    const token = jwt.sign({
        name: name,
        email: email
    }, privateKey)

    res.status(200).json({ isSuccess: true, token: token })
}

const login = async (req, res, next) => {
    console.log('in login');
    console.log(req.body);

    const user = await User.findOne({ email: req.body.email })
    // if user exists
    if (user) {
        // comparing login password with password from DB
        const isValidPassword = await bcrypt.compare(req.body.password, user.password);
        console.log('is Passowrd Valid?', isValidPassword);
        if (isValidPassword) {
            require("dotenv").config({ path: '../.env' });
            const privateKey = process.env.PRIVATE_KEY;
            console.log(privateKey);
            // create token
            const token = jwt.sign({
                name: user.name,
                email: user.email
            }, privateKey)
            console.log('token: ', token);
            res.status(200).json({ isSuccess: true, token: token })
        } else {
            throw new AuthError('Login failed!');
        }
    }

    // if user does not exist
    else {
        throw new AuthError('You do not have an account. Sign Up!');
    }

}

module.exports = {
    login,
    register
}