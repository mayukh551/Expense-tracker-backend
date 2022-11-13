const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const expenseSchema = require('./expense.model');

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    expenses: {
        type: [expenseSchema]
    }
})

const User = mongoose.model('User', userSchema);

module.exports = User;