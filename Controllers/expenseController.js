const CrudError = require('../Error/CrudError.js');

// Model Imports
const User = require('../Models/user.model');
const Expense = require('../Models/expense.model');

const monthList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/* CRUD Operations */

/**
 * @function fetchAllExpenses
 * @description fetch all expenses from Expense Model
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next function
 */
exports.fetchAllExpenses = async (req, res, next) => {

    const apiEndpoint = req.originalUrl;

    const email = req['user-email'];

    const user = await User.findOne({ email: email });

    // extracting queries for filter and sort values
    const { month, year } = req.query;

    const dateRegex = new RegExp('^' + year + '-' + month + '-');

    // fetch expenses based on available fields and sorted by user choice
    const expenses = await Expense.find({
        userId: user._id,
        date: { $regex: dateRegex }
    })
        .select('id title amount date userId quantity year month')
        .sort({ date: 'asc' })

    if (expenses) {
        expenses.reverse();
        res.status(200).json(expenses);
    }
    else throw new CrudError(500, 'Failed to load expenses. Try again later.', apiEndpoint);

}




/**
 * @function addNewExpense
 * @description add new expense provided by user
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next function
 */
exports.addNewExpense = async (req, res, next) => {

    const apiEndpoint = req.originalUrl;

    const productId = req.body.id;
    const userDate = req.body.date;
    const userLabel = req.body.title;
    const userPrice = req.body.amount;
    const userQuantity = req.body.quantity;

    const email = req['user-email'];

    const user = await User.findOne({ email: email });

    const month = monthList[parseInt(userDate.slice(5, 7)) - 1];
    const year = userDate.slice(0, 4);

    const expense = new Expense({
        id: productId,
        userId: user._id,
        date: userDate,
        month,
        year,
        title: userLabel,
        amount: userPrice,
        quantity: userQuantity
    });

    expense.save(async (err) => {
        if (err) new CrudError(500, 'Failed to save new Expense!', apiEndpoint);
        else res.status(200).json(expense);
    });
}




/**
 * @function updatedExpense
 * @description update an existing expense found by its id
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next function
 */
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




/**
 * @function deletedExpense
 * @description delete an existing expense found by its id
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next function
 */
exports.deleteExpense = async (req, res, next) => {

    const apiEndpoint = req.originalUrl;
    const { id } = req.params;

    const deletedExpense = await Expense.findOneAndDelete({ id: id }, { new: true });

    if (!deletedExpense) throw new CrudError(404, 'Item Not Found!', apiEndpoint);
    else res.status(200).json(deletedExpense);
}