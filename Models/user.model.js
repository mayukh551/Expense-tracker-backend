const mongoose = require('mongoose');
const { validateEmail } = require('../utils/validator');
const Schema = mongoose.Schema;

const stringTypeFields = {
    type: String,
    minLength: 1,
    maxLength: 40,
    trim: true
}

const userSchema = new Schema({
    name: {
        ...stringTypeFields,
        required: [true, 'Name is compulsory'],
    },
    email: {
        type: String,
        required: [true, 'Email id compulsory'],
        unique: true,
        validate: {
            validator: validateEmail,
            message: "Invalid Email Id"
        },
        maxLength: 40,
    },
    password: {
        ...stringTypeFields,
        minLength: 6,
        maxLength: 1000000,
        required: [true, 'Password is compulsory'],
    }
})

const User = mongoose.model('User', userSchema);

module.exports = User;