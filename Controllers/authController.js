// const User = require('../Models/user.model.js');
const bycript = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res, next) => {
    console.log('in register');
    try {
        console.log(req.body);
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            err.type = 'authError'
            next(err);
        }

        const hashedPassword = await bycript.hash(password, 10)
        console.log(name, email, hashedPassword);
        // await new User({
        //     username: username,
        //     email: email,
        //     password: hashedPassword
        // })
        const token = jwt.sign({
            name: name,
            email: email
        }, '3546asdfa06a5sas6dfgas564as')

        res.status(200).json({ isSuccess: true, user: token })

    }
    catch (err) {
        err.type = 'AUTH_ERROR'
        next(err);
    }
}

const login = async (req, res, next) => {
    console.log('in login');
    // try {
    //     const user = await User.findOne({ email: req.body.email })
    //     if (user) {
    //         // comparing login password with password from DB
    //         const isValidPassword = bcrypt.compare(user.password, req.body.password)
    //         if (isValidPassword) {
    //             // create token
    //             const token = jwt.sign({
    //                 name: user.name,
    //                 email: user.email
    //             }, '3546asdfa06a5sas6dfgas564as')

    //             res.status(200).json({ status: 'success', user: token })
    //         } else {
    //             throw new Error('Login failed!');
    //         }
    //     }
    //     else {
    //         throw new Error('Login failed!');
    //     }
    // } catch (error) {
    //     error.type = 'AUTH_ERROR'
    //     next(error);
    // }
}

const verifyUser = async (req, res, next) => {
    const token = req.headers['x-access-token'];
    console.log('token received', token);
    var decoded;
    try {
        if (token) {
            console.log('before verification');
            try {
                decoded = jwt.verify(token, '3546asdfa06a5sas6dfgas564as');
            } catch (error) {
                throw new Error('verification failed');
            }
            console.log('after verification');
            if (decoded) {
                // const email = decoded.email;
                // const user = await User.findOne({ email: email });
                // res.status(200).json({ status: 'success', expenseId: user.expenses })
                next();
            } else {
                throw new Error('verification failed');
            }
        }
    } catch (error) {
        error.type = 'AUTH_ERROR';
        next(error);
    }
}


module.exports = {
    login,
    register,
    verifyUser
}