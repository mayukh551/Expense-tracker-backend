const express = require('express');
const router = express.Router();
const Expense = require('../Models/expense.model.js');

function asyncWrap(fn, msg) {
    return (req, res) => {
        fn(req, res)
            .then(() => console.log(msg))
            .catch(err => res.status(500).json({ error: err, message: err.message }))
    }
}


// FETCH ALL EXPENSES
router.route('/').get(asyncWrap(async (req, res) => {
    console.log('get all requests');
    const response = await Expense.find({});
    res.json(response);
}))


// ADD NEW EXPENSE
router.route('/new').post(asyncWrap((req, res) => {
    console.log(req.body);
    const userDate = req.body.date;
    const userLabel = req.body.title;
    const userPrice = req.body.amount;
    const newExpense = new Expense({
        date: userDate,
        title: userLabel,
        amount: userPrice
    })
    newExpense.save();
}, "New Expense Added"));


// DELETE AN EXPENSE
router.route('/delete/:id').delete(asyncWrap(async (req, res) => {
    const { id } = req.params;
    console.log("ID is :", id);
    await Expense.findByIdAndDelete(id);
}, "Expense Deleted"));


// UPDATE AN EXPENSE
router.route('/update/:id').put(asyncWrap(async (req, res) => {
    const { id } = req.params;
    console.log("req.body: ", req.body);
    const updatedDate = req.body.date;
    const updatedLabel = req.body.title;
    const updatedPrice = req.body.amount;
    await Expense.findByIdAndUpdate(id, {
        title: updatedLabel,
        date: updatedDate,
        amount: updatedPrice
    });
}, "Expense Updated"));


module.exports = router;