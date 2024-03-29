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

    month: {
        type: String,
        enum: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },

    year: {
        type: String,
        minLength: 4,
        maxLength: 4,
        min: 2019,
        max: 2050
    },

    title: {
        ...stringTypeFields,
        required: [true, 'item title is compulsory']
    },

    quantity: {
        type: Number,
        // required: [true, 'quantity is compulsory'],
        default: 1,
        min: 1,
        max: 1000000,
    },

    amount: {
        type: Number,
        min: 1,
        max: 999999999999999,
        required: [true, 'Purchase Amount is requried']
    },

    category: {
        ...stringTypeFields,
        default: 'Others'
    }
})

expenseSchema.index({ userId: 1 });

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;