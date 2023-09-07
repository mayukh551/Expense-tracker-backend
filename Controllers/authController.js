const User = require('../Models/user.model.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AuthError = require('../Error/AuthError');


const register = async (req, res, next) => {

    const apiEndpoint = req.method + '/ : ' + req.originalUrl;
    const { name, email, password } = req.body;

    // To check if account already exists with the same email
    if (email) {
        const user = await User.findOne({ email: email });
        if (user)
            throw new AuthError(401, 'You already have an existing account. Log in!', apiEndpoint);
    }

    // hashing password for storage in DB
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
        name: name,
        email: email,
        password: hashedPassword
    });
    await newUser.save();

    require("dotenv").config({ path: '../.env' });
    const privateKey = process.env.PRIVATE_KEY;

    const token = jwt.sign({
        name: name,
        email: email
    }, privateKey)

    res.status(200).json({
        isSuccess: true, token: token,
        user: {
            userId: newUser._id,
            email: newUser.email,
            name: newUser.name
        }
    })
}

const login = async (req, res, next) => {

    const apiEndpoint = req.method + '/ : ' + req.originalUrl;
    const user = await User.findOne({ email: req.body.email })
    // if user exists
    if (user) {
        // comparing login password with password from DB
        const isValidPassword = await bcrypt.compare(req.body.password, user.password);
        console.log('is Passowrd Valid?', isValidPassword);
        if (isValidPassword) {
            require("dotenv").config({ path: '../.env' });
            const privateKey = process.env.PRIVATE_KEY;

            // create token
            const token = jwt.sign({
                name: user.name,
                email: user.email
            }, privateKey)

            res.status(200).json({
                isSuccess: true,
                token: token,
                user: {
                    userId: user._id,
                    budget: user.budget,
                    email: user.email,
                    name: user.name
                }
            })

        } else {
            throw new AuthError(401, 'Invalid Password!', apiEndpoint);
        }
    }

    // if user does not exist
    else {
        throw new AuthError(401, 'Invalid Username or Password!', apiEndpoint);
    }

}

module.exports = {
    login,
    register
}