const CrudError = require('../Error/CrudError.js');
const verifyUser = require('../Middleware/verify-user');
const User = require('../Models/user.model');

exports.fetchAllExpenses = async (req, res, next) => {
    const decoded = verifyUser(req, next);
    console.log('its decoded', decoded);
    const email = decoded.email;
    try {
        const user = await User.findOne({ email: email });
        res.json(user.expenses);
    } catch (err) {
        next(new CrudError('DB_ERROR'))
    }
}

exports.addNewExpense = async (req, res, next) => {
    console.log(req.body);
    const userDate = req.body.date;
    const userLabel = req.body.title;
    const userPrice = req.body.amount;
    const decoded = verifyUser(req, next);
    console.log('its decoded', decoded);
    const email = decoded.email;
    try {
        const user = await User.findOne({ email: email });
        user.expenses.push({
            date: userDate,
            title: userLabel,
            amount: userPrice
        })
        const userId = user._id;
        const updatedUser = await User.findByIdAndUpdate(userId, user);
        res.status(200).json(updatedUser);
    } catch (err) {
        next(new CrudError('DB_ERROR'));
    }

}

exports.updateExpense = async (req, res, next) => {
    const { id } = req.params;
    console.log("req.body: ", req.body);
    const updatedDate = req.body.date;
    const updatedLabel = req.body.title;
    const updatedPrice = req.body.amount;

    const decoded = verifyUser(req, next);
    console.log('it is decoded: ', decoded);
    const email = decoded.email;
    try {
        const user = await User.findOne({ email: email });
        var expenses = user.expenses;
        var hasFound = false;

        for (let i = 0; i < expenses.length; i++) {
            var dbProductId = (expenses[i]._id).valueOf();
            if (dbProductId === id) {
                const _id = expenses[i]._id;
                expenses[i] = {
                    _id,
                    title: updatedLabel,
                    date: updatedDate,
                    amount: updatedPrice
                }
                hasFound = true;
                break;
            }
        }
        if (hasFound) {
            user.expenses = expenses;
            const doc = await User.findByIdAndUpdate(user._id, user)
            await doc.save();
        } else {
            throw new CrudError('INVALID_ID')
        }
    } catch (err) {
        next(err);
    }
}

// write code on how to delete an item from an array
exports.deleteExpense = async (req, res, next) => {
    const { id } = req.params;
    const decoded = verifyUser(req, next);
    const email = decoded.email;
    try {
        const user = await User.findOne({ email: email });
        var expenses = user.expenses;
        var hasFound = false;
        // var deleteProductId;
        for (let i = 0; i < expenses.length; i++) {
            var dbProductId = (expenses[i]._id).valueOf();
            if (dbProductId === id) {
                delete expenses[i];
                hasFound = true;
                break;
            }
        }
        if (hasFound) {
            user.expenses = expenses;
            const doc = await User.findByIdAndUpdate(user._id, user)
            await doc.save();
        } else {
            throw new CrudError('INVALID_ID')
        }
    } catch (err) {
        next(err);
    }
}


findProduct = async (req, res, next, id, logic) => {
    const decoded = verifyUser(req, next);
    console.log('it is decoded: ', decoded);
    const email = decoded.email;
    try {
        const user = await User.findOne({ email: email });
        var expenses = user.expenses;
        var hasFound = false;

        for (let i = 0; i < expenses.length; i++) {
            var dbProductId = (expenses[i]._id).valueOf();
            if (dbProductId === id) {
                expenses = logic(i, expenses);
                hasFound = true;
                break;
            }
        }
        if (hasFound) {
            user.expenses = expenses;
            const doc = await User.findByIdAndUpdate(user._id, user)
            await doc.save();
        } else {
            throw new CrudError('INVALID_ID')
        }
    } catch (err) {
        next(err);
    }
}

// // delete expense Logic
// (i, expenses) => {
//     delete expenses[i]
//     return expenses;
// }

// // update expense Logic
// (i, expenses) => {
//     const _id = expenses[i]._id;
//     expenses[i] = {
//         _id,
//         title: updatedLabel,
//         date: updatedDate,
//         amount: updatedPrice
//     }
//     return expenses;
// }