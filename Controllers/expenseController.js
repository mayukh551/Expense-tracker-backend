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
    const email = req['user-email']

    const user = await User.findOne({ email: email });

    // extracting queries for filter and sort values
    const { month, year, sortBy: sortValue } = req.query;

    const dateRegex = new RegExp('^' + year + '-' + month + '-');

    // set expenses filter fields based on month/year/date
    const eitherFields = [
        { month: month }, { year: year }, { date: { $regex: dateRegex } }
    ];

    // selective fields in response from Expense Model
    // 0 -> excludes, 1 -> includes
    const selectedFields = { _id: 0, id: 1, title: 1, amount: 1, date: 1, userId: 1, quantity: 1 };

    // fetch expenses based on available fields and sorted by user choice
    const expenses = await Expense.find({
        userId: user._id,
        $or: eitherFields
    },
        selectedFields,
    ).sort(sortValue);

    if (expenses) res.status(200).json(expenses);
    else throw new CrudError('DB_ERROR', 'Failed to load expenses. Try again later.');

}




/**
 * @function addNewExpense
 * @description add new expense provided by user
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next function
 */
exports.addNewExpense = async (req, res, next) => {
    console.log(req.body);
    const productId = req.body.id;
    const userDate = req.body.date;
    const userLabel = req.body.title;
    const userPrice = req.body.amount;

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
        amount: userPrice
    });

    expense.save(async (err) => {
        if (err)
            new CrudError('DB_ERROR', 'Failed to save new Expense!');
        else
            res.status(200).json(expense);
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
    const { id } = req.params;
    console.log('in update', id, req.body);

    const updatedExpense = await Expense.findOneAndUpdate({ id: id }, req.body, { new: true });
    if (!updatedExpense)
        throw new Error('INVALID_ID');
    updatedExpense.save((err) => {
        if (err) throw new CrudError('DB_ERROR');
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
    const { id } = req.params;
    console.log('in update', id, req.body);

    const deletedExpense = await Expense.findOneAndDelete({ id: id }, { new: true });

    if (!deletedExpense) throw new Error('INVALID_ID');
    else res.status(200).json(deletedExpense);
}