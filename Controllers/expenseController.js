const CrudError = require('../Error/CrudError.js');

// Model Imports
const User = require('../Models/user.model');
const Expense = require('../Models/expense.model');

const monthList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const monthNo = {
    'Jan': '01',
    'Feb': '02',
    'Mar': '03',
    'Apr': '04',
    'May': '05',
    'Jun': '06',
    'Jul': '07',
    'Aug': '08',
    'Sep': '09',
    'Oct': '10',
    'Nov': '11',
    'Dec': '12'
}

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

    // extracting queries for filter and sort values
    const { month, year } = req.query;

    const userId = req['userId'];

    const dateRegex = new RegExp('^' + year + '-' + month);

    const monthName = monthList[parseInt(month) - 1]; // Ex: converting 03 => Mar

    // fetch expenses based on available fields and sorted by user choice
    const expenses = await Expense.find({
        userId: userId,
        $or: [{ year, month: monthName }, { date: { $regex: dateRegex } }]
    })
        .select('id title amount date userId quantity year month category')
        .sort({ date: 'asc' })

    if (expenses) {
        expenses.reverse();
        // cache expenses
        const client = req['redis-client'];
        const cacheKey = `${userId}:expenses:${month}:${year}`;

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
    const userCategory = req.body.category;

    if (userCategory === undefined) userCategory = 'Others';

    const userId = req['userId']

    const month = monthList[parseInt(userDate.slice(5, 7)) - 1];
    const year = userDate.slice(0, 4);

    const expense = new Expense({
        id: productId,
        userId: userId,
        date: userDate,
        month,
        year,
        title: userLabel,
        amount: userPrice,
        quantity: userQuantity,
        category: userCategory
    });

    try {
        await expense.save();

        // set update expense cache to true
        const client = req['redis-client'];
        const cacheKey = `${userId}:expenses:${userDate.slice(5, 7)}:${year}`;
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

    const userId = req['userId'];

    const updatedExpense = await Expense.findOneAndUpdate({ id: id }, req.body, { new: true });
    if (!updatedExpense)
        throw new CrudError(404, 'Item Not Found!', apiEndpoint);

    try {
        await updatedExpense.save();

        try {
            // set update expense cache to true
            const client = req['redis-client'];
            const { email } = await User.findById(updatedExpense.userId);
            const cacheKey = `${userId}:expenses:${updatedExpense.date.slice(5, 7)}:${updatedExpense.date.slice(0, 4)}`;
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
 * @function deleteExpense
 * @description delete an existing expense found by its id
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next function
 */
exports.deleteExpense = async (req, res, next) => {

    const apiEndpoint = req.method + '/ : ' + req.originalUrl;

    const { ids, month, year } = req.body;

    console.log(ids, month, year);

    const userId = req['userId'];

    if (ids.length === 0) throw new CrudError(400, 'No items selected!', apiEndpoint);

    var deletedExpense;

    deletedExpense = await Expense.deleteMany({ id: { $in: ids } });

    console.log(deletedExpense);

    const client = req['redis-client'];

    if (!deletedExpense) throw new CrudError(404, 'Item Not Found!', apiEndpoint);
    else {


        try {

            // set update expense cache to true
            const cacheKey = `${userId}:expenses:${monthNo[month]}:${year}`;

            await client.hSet(cacheKey, 'updateExpenseCache', 'true');
            res.status(200).json(deletedExpense);

            // await client.del(cacheKey);

        } catch (error) {
            throw new CrudError(500, null, apiEndpoint);
        }

    }
}