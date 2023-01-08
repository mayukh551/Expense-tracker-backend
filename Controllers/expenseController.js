const CrudError = require('../Error/CrudError.js');
const verifyUser = require('../Middleware/verify-user');
const User = require('../Models/user.model');
const Expense = require('../Models/expense.model');
const { findHighestExpense } = require('../Controllers/AnalyticsController');
const { findYearWithHighLowExpense } = require('../Controllers/AnalyticsController');

/* Analytics */

exports.fetchAnalytics = async (req, res, next) => {
    console.log('in fetchAnalytics');
    const decoded = verifyUser(req, next);
    const email = decoded.email;
    const { expenses } = await User
        .findOne({ email: email })
        .populate('expenses')
    if (expenses) {
        const maxExpense = findHighestExpense(expenses);
        const { year_most_spent, year_least_spent } = findYearWithHighLowExpense(expenses);

        res.status(200).json({
            success: true,
            data: {
                maxExpense,
                year_most_spent,
                year_least_spent
            }
        })
    }

    else {
        res.status(200).json({})
    }
}


/* CRUD Operations */

// fetch all expenses
exports.fetchAllExpenses = async (req, res, next) => {
    const decoded = verifyUser(req, next);
    const email = decoded.email;

    const user = await User
        .findOne({ email: email })
        .populate('expenses')

    const expenses = user.expenses;
    if (expenses) {
        res.json(expenses);
    }
    else {
        throw new CrudError('DB_ERROR');
    }
}

// add new expense
exports.addNewExpense = async (req, res, next) => {
    console.log(req.body);
    const productId = req.body.id;
    const userDate = req.body.date;
    const userLabel = req.body.title;
    const userPrice = req.body.amount;
    const decoded = verifyUser(req, next);

    const email = decoded.email;

    const user = await User.findOne({ email: email });

    const expense = new Expense({
        id: productId,
        userId: user._id,
        date: userDate,
        title: userLabel,
        amount: userPrice
    });

    expense.save(async (err) => {
        if (err)
            new CrudError('DB_ERROR');
        else {
            user.expenses.push(expense);
            await user.save();
            res.status(200).json(expense);
        }
    });
}

// update an existing expense
exports.updateExpense = async (req, res, next) => {
    const { id } = req.params;
    console.log('in update', id, req.body);

    const updatedExpense = await Expense.findOneAndUpdate({ id: id }, req.body, { new: true });
    if (!updatedExpense)
        throw new Error('INVALID_ID');
    updatedExpense.save((err) => {
        if (err)
            throw new CrudError('DB_ERROR');
        else
            res.status(200).json(updatedExpense);
    });
}

// delete an expense
exports.deleteExpense = async (req, res, next) => {
    const { id } = req.params;
    console.log('in update', id, req.body);

    const deletedExpense = await Expense.findOneAndDelete({ id: id }, { new: true });
    if (!deletedExpense)
        throw new Error('INVALID_ID');

    else {
        res.status(200).json(deletedExpense);
    }
}