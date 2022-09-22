const express = require('express');
const router = express.Router();
const statRouter = require('./expense.stat.router');

const expenseController = require('../Controllers/expenseController');

const { fetchAllExpenses, addNewExpense, updateExpense, deleteExpense } = expenseController;

// try-catch wrapper function for controllers
function asyncWrap(fn, msg) {
    return (req, res) => {
        fn(req, res)
            .then(() => console.log(msg))
            .catch(err => res.status(500).json({ error: err, message: err.message }))
    }
}

// FETCH ALL EXPENSES
router.route('/').get(asyncWrap(fetchAllExpenses, 'Fetch all expenses'))

// ADD NEW EXPENSE
router.route('/new').post(asyncWrap(addNewExpense, "New Expense Added"));

// DELETE AN EXPENSE
router.route('/delete/:id').delete(asyncWrap(updateExpense, "Expense Deleted"));

// UPDATE AN EXPENSE
router.route('/update/:id').put(asyncWrap(deleteExpense, "Expense Updated"));

router.use('/stats', statRouter)

router.route('*').get((req, res) => {
    console.log('Invalid URL');
    res.status(404).json({ status: "failure", message: "Invalid URL" });
})


module.exports = router;