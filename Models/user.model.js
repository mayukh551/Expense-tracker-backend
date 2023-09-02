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
    },

    phone: {
        type: String,

        //TODO : Improve the regex test
        validate: {
            validator: function (v) {
                return /\d{10}/.test(v);
            },
        },
        unique: true,
        minLength: 10
    },

    budget: {
        monthly: {
            type: Number,
            default: 0,
            min: 0,
            max: 1000000,
        },

        yearly: {
            type: Number,
            default: 0,
            min: 0,
            max: 1000000,
        }
    },

    age: {
        type: Number,
        min: 6,
        max: 150
    },

    salary: {
        type: Number,
        min: 500,
        max: 100000000
    },

    category: [{
        type: String,
    }],

    profile_img: {
        type: String,
        default: `https://i.stack.imgur.com/YaL3s.jpg`
    }
})

const User = mongoose.model('User', userSchema);

module.exports = User;