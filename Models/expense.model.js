const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stringTypeFields = {
    type: String,
    minLength: 1,
    maxLength: 40,
    trim: true
}

const expenseSchema = new Schema({
    id: {
        type: String,
        required: [true, 'Every item should have a unique id'],
        unique: true
    },

    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },

    date: {
        type: String,
        required: [true, 'Date is compulsory']
    },

    title: {
        ...stringTypeFields,
        required: [true, 'item title is compulsory']
    },

    amount: {
        type: Number,
        min: 1,
        max: 999999999999999,
        required: [true, 'Purchase Amount is requried']
    }
})

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;