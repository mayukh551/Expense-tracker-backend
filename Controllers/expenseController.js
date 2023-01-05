const CrudError = require('../Error/CrudError.js');
const verifyUser = require('../Middleware/verify-user');
const User = require('../Models/user.model');
const { findHighestExpense } = require('../Controllers/AnalyticsController');
const { findYearWithHighLowExpense } = require('../Controllers/AnalyticsController');

/* Analytics */

exports.fetchAnalytics = async (req, res, next) => {
    const decoded = verifyUser(req, next);
    const email = decoded.email;
    const { expenses } = await User.findOne({ email: email }, 'expenses -_id');
    if (expenses) {
        const maxExpense = findHighestExpense(itemList);
        const { year_most_spent, year_least_spent } = findYearWithHighLowExpense(itemList);

        res.status(200).json({
            status: success,
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
    // console.log(itemList);
}


/* CRUD Operations */

exports.fetchAllExpenses = async (req, res, next) => {
    const decoded = verifyUser(req, next);
    const email = decoded.email;

    const { expenses } = await User.findOne({ email: email }, 'expenses -_id');
    if (expenses) {
        res.json(expenses);
    }
    else {
        throw new CrudError('DB_ERROR');
    }
}

exports.addNewExpense = async (req, res, next) => {
    console.log(req.body);
    const productId = req.body.id;
    const userDate = req.body.date;
    const userLabel = req.body.title;
    const userPrice = req.body.amount;
    const decoded = verifyUser(req, next);
    // console.log('its decoded', decoded);
    const email = decoded.email;

    const user = await User.findOne({ email: email }, 'expenses _id');
    const { expenses } = user;
    if (expenses) {
        expenses.push({
            id: productId,
            date: userDate,
            title: userLabel,
            amount: userPrice
        })
        const userId = user._id;
        const updatedUser = await User.findByIdAndUpdate(userId, user, { new: true });
        await updatedUser.save();
        console.log('afer save');

        if (updatedUser) res.status(200).json(updatedUser.expenses);

        else next(new CrudError('DB_ERROR'));

    }
    else next(new CrudError('DB_ERROR'));

}

exports.updateExpense = async (req, res, next) => {
    const { id } = req.params;
    console.log('in update', id, req.body);

    findProductAndUpdateExpense(req, res, next, id, data = {
        updatedDate: req.body.date,
        updatedLabel: req.body.title,
        updatedPrice: req.body.amount
    }, (i, expenses) => {
        const id = expenses[i].id;
        expenses[i] = {
            id,
            title: data.updatedLabel,
            date: data.updatedDate,
            amount: data.updatedPrice
        }
        return expenses;
    })
}

// write code on how to delete an item from an array
exports.deleteExpense = async (req, res, next) => {
    const { id } = req.params;
    console.log('in delete', id);
    findProductAndUpdateExpense(req, res, next, id, data = {}, (i, expenses) => {
        expenses.splice(i, 1);
        console.log('after delete', expenses);
        return expenses;
    })
}


const findProductAndUpdateExpense = async (req, res, next, id, data = {}, logic) => {
    const decoded = verifyUser(req, next);
    // console.log('it is decoded: ', decoded);
    var email;
    try {
        email = decoded.email;
    } catch (err) {
        throw new AuthError('Unauthorized Attempt!');
    }
    const user = await User.findOne({ email: email });
    var expenses = user.expenses;
    var hasFound = false;

    for (let i = 0; i < expenses.length; i++) {
        var dbProductId = (expenses[i].id);
        if (dbProductId === id) {
            console.log('Item Found: ', dbProductId);
            expenses = logic(i, expenses);
            hasFound = true;
            break;
        }
    }
    if (hasFound) {
        user.expenses = expenses;
        const doc = await User.findByIdAndUpdate(user._id, user, { new: true });
        await doc.save();
        res.status(200).json(doc);
    } else {
        console.log('throw error due to invalid id');
        next(new CrudError('INVALID_ID'));
    }
}