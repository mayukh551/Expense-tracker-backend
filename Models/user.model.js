const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const expenseSchema = require('./expense.model');

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
            validator: (e) => {
                return e.includes('@')
            },
            message: "Invalid Email Id"
        }
    },
    password: {
        ...stringTypeFields,
        minLength: 6,
        required: [true, 'Password is compulsory'],
    },
    expenses: {
        type: [expenseSchema]
    }
})

const User = mongoose.model('User', userSchema);

module.exports = User;