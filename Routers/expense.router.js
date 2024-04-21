const express = require('express');
const router = express.Router();
const asyncWrap = require('../Middleware/async-wrapper');
const expenseController = require('../Controllers/expenseController');
const verifyUser = require('../Middleware/verify-user');
const { validateExpenseSchema } = require('../Middleware/schema-validator');
const cacheData = require('../Middleware/cache-data');
const getExpenseStats = require('../Controllers/expenseStats');
const {
    fetchAllExpenses,
    addNewExpense,
    updateExpense,
    deleteExpense
} = expenseController;


// FETCH ALL EXPENSES
router.route('/').get(verifyUser, cacheData, asyncWrap(fetchAllExpenses));

// ADD NEW EXPENSE
router.route('/new').post(verifyUser, validateExpenseSchema, cacheData, asyncWrap(addNewExpense));

// DELETE AN EXPENSE
router.route('/delete').post(verifyUser, cacheData, asyncWrap(deleteExpense));

// UPDATE AN EXPENSE
// router.route('/update/:id').put(verifyUser, validateExpenseSchema, cacheData, asyncWrap(updateExpense));
router.route('/update/:id').put(verifyUser, cacheData, asyncWrap(updateExpense));


// expense stats
router.route('/stats').get(verifyUser, asyncWrap(getExpenseStats));


router.route('*').get((req, res) => {
    console.log('Invalid URL');
    res.status(404).json({ status: "failure", message: "Invalid URL" });
})


module.exports = router;