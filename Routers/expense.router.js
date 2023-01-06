const express = require('express');
const router = express.Router();
const asyncWrap = require('../Middleware/async-wrapper');
const expenseController = require('../Controllers/expenseController');
const {
    fetchAnalytics,
    fetchAllExpenses,
    addNewExpense,
    updateExpense,
    deleteExpense
} = expenseController;


// FETCH ALL EXPENSES
router.route('/').get(asyncWrap(fetchAllExpenses, 'Fetch all expenses'))

router.route('/profile').get(asyncWrap(fetchAnalytics, 'Fetch Analytics'))

// ADD NEW EXPENSE
router.route('/new').post(asyncWrap(addNewExpense, "New Expense Added"));

// DELETE AN EXPENSE
router.route('/delete/:id').delete(asyncWrap(deleteExpense, "Expense Deleted"));

// UPDATE AN EXPENSE
router.route('/update/:id').put(asyncWrap(updateExpense, "Expense Updated"));

router.route('*').get((req, res) => {
    console.log('Invalid URL');
    res.status(404).json({ status: "failure", message: "Invalid URL" });
})


module.exports = router;