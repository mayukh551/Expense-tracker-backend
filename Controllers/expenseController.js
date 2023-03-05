const CrudError = require('../Error/CrudError.js');
const User = require('../Models/user.model');
const Expense = require('../Models/expense.model');

const monthList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/* CRUD Operations */

// fetch all expenses
exports.fetchAllExpenses = async (req, res, next) => {
    const email = req['user-email']

    const user = await User.findOne({ email: email });

    const { month, year } = req.query;

    const expenses = await Expense.find({ userId: user._id, month, year });

    if (expenses) res.status(200).json(expenses);
    else throw new CrudError('DB_ERROR', 'Failed to load expenses. Try again later.');

}

// add new expense
exports.addNewExpense = async (req, res, next) => {
    console.log(req.body);
    const productId = req.body.id;
    const userDate = req.body.date;
    const userLabel = req.body.title;
    const userPrice = req.body.amount;

    const email = req['user-email'];

    const user = await User.findOne({ email: email });

    const month = monthList[userDate.slice(5, 7)];
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

// update an existing expense
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

// delete an expense
exports.deleteExpense = async (req, res, next) => {
    const { id } = req.params;
    console.log('in update', id, req.body);

    const deletedExpense = await Expense.findOneAndDelete({ id: id }, { new: true });

    if (!deletedExpense) throw new Error('INVALID_ID');
    else res.status(200).json(deletedExpense);
}