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

    const apiEndpoint = req.method + '/ : ' + req.originalUrl;

    // Extract email from request object
    const email = req['user-email'];
    console.log(email);

    // extracting queries for filter and sort values
    const { month, year } = req.query;

    if (!email) throw new CrudError(401, 'Invalid Email', apiEndpoint);

    const user = await User.findOne({ email: email });

    const dateRegex = new RegExp('^' + year + '-' + month);

    const monthName = monthList[parseInt(month) - 1]; // Ex: converting 03 => Mar

    // fetch expenses based on available fields and sorted by user choice
    const expenses = await Expense.find({
        userId: user._id,
        $or: [{ year, month: monthName }, { date: { $regex: dateRegex } }]
    })
        .select('id title amount date userId quantity year month')
        .sort({ date: 'asc' })

    if (expenses) {
        expenses.reverse();
        // cache expenses
        const client = req['redis-client'];
        const cacheKey = `${email}:expenses:${month}:${year}`;

        await client.hSet(cacheKey, 'expenses', JSON.stringify(expenses));
        await client.hSet(cacheKey, 'updateExpenseCache', 'false');
        // key expiry after 30 minutes
        await client.expire(cacheKey, 1800);
        // send response
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

    const apiEndpoint = req.method + '/ : ' + req.originalUrl;

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

    try {
        await expense.save();

        // set update expense cache to true
        const client = req['redis-client'];
        const cacheKey = `${email}:expenses:${userDate.slice(5, 7)}:${year}`;
        await client.hSet(cacheKey, 'updateExpenseCache', 'true');

        // sending response
        res.status(200).json(expense);

    } catch (err) {
        console.log(err);
        throw new CrudError(500, 'Failed to save new Expense!', apiEndpoint);
    }
}




/**
 * @function updatedExpense
 * @description update an existing expense found by its id
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next function
 */
exports.updateExpense = async (req, res, next) => {

    const apiEndpoint = req.method + '/ : ' + req.originalUrl;
    const { id } = req.params;

    const updatedExpense = await Expense.findOneAndUpdate({ id: id }, req.body, { new: true });
    if (!updatedExpense)
        throw new CrudError(404, 'Item Not Found!', apiEndpoint);

    try {
        await updatedExpense.save();

        try {
            // set update expense cache to true
            const client = req['redis-client'];
            const { email } = await User.findById(updatedExpense.userId);
            const cacheKey = `${email}:expenses:${updatedExpense.date.slice(5, 7)}:${updatedExpense.date.slice(0, 4)}`;
            await client.hSet(cacheKey, 'updateExpenseCache', 'true');

        } catch (error) {
            console.log(error);
        }

        res.status(200).json(updatedExpense);
    } catch (error) {
        console.log(error);
        throw new CrudError(500, null, apiEndpoint);
    }

}




/**
 * @function deletedExpense
 * @description delete an existing expense found by its id
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next function
 */
exports.deleteExpense = async (req, res, next) => {

    const apiEndpoint = req.method + '/ : ' + req.originalUrl;
    const { id } = req.params;

    const deletedExpense = await Expense.findOneAndDelete({ id: id }, { new: true });

    if (!deletedExpense) throw new CrudError(404, 'Item Not Found!', apiEndpoint);
    else {

        try {
            // set update expense cache to true
            const client = req['redis-client'];
            const { email } = await User.findById(deletedExpense.userId);
            const cacheKey = `${email}:expenses:${deletedExpense.date.slice(5, 7)}:${deletedExpense.date.slice(0, 4)}`;
            await client.hSet(cacheKey, 'updateExpenseCache', 'true');

        } catch (error) {
            console.log(error);
        }

        res.status(200).json(deletedExpense);
    }
}