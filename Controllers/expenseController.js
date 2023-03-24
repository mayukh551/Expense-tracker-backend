const CrudError = require('../Error/CrudError.js');
const User = require('../Models/user.model');
const Expense = require('../Models/expense.model');

/* CRUD Operations */

// fetch all expenses
exports.fetchAllExpenses = async (req, res, next) => {

    const apiEndpoint = req.originalUrl;

    const email = req['user-email']

    const user = await User.findOne({ email: email });

    const expenses = await Expense.find({ userId: user._id });
    if (expenses) {
        res.status(200).json(expenses);
    }
    else {
        throw new CrudError(500, 'Failed to load expenses. Try again later.', apiEndpoint);
    }
}

// add new expense
exports.addNewExpense = async (req, res, next) => {

    const apiEndpoint = req.originalUrl;

    const productId = req.body.id;
    const userDate = req.body.date;
    const userLabel = req.body.title;
    const userPrice = req.body.amount;
    // const decoded = verifyUser(req, next);

    const email = req['user-email'];

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
            new CrudError(500, 'Failed to save new Expense!', apiEndpoint);
        else
            res.status(200).json(expense);
    });
}

// update an existing expense
exports.updateExpense = async (req, res, next) => {

    const apiEndpoint = req.originalUrl;
    const { id } = req.params;

    const updatedExpense = await Expense.findOneAndUpdate({ id: id }, req.body, { new: true });
    if (!updatedExpense)
        throw new CrudError(404, 'Item Not Found!', apiEndpoint);
    updatedExpense.save((err) => {
        if (err) throw new CrudError(500, null, apiEndpoint);
        else res.status(200).json(updatedExpense);
    });
}

// delete an expense
exports.deleteExpense = async (req, res, next) => {

    const apiEndpoint = req.originalUrl;
    const { id } = req.params;

    const deletedExpense = await Expense.findOneAndDelete({ id: id }, { new: true });

    if (!deletedExpense) throw new Error(404, 'Item Not Found!', apiEndpoint);
    else res.status(200).json(deletedExpense);
}