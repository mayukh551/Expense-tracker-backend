const CrudError = require('../Error/CrudError.js');
const verifyUser = require('../Middleware/verify-user');
const User = require('../Models/user.model');

exports.fetchAllExpenses = async (req, res, next) => {
<<<<<<< HEAD
=======
    const decoded = verifyUser(req, next);
    console.log('its decoded', decoded);
    const email = decoded.email;
>>>>>>> auth
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

    findProductAndUpdateExpense(req, res, next, id, data = {
        updatedDate: req.body.date,
        updatedLabel: req.body.title,
        updatedPrice: req.body.amount
    }, (i, expenses) => {
        const _id = expenses[i]._id;
        expenses[i] = {
            _id,
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
    findProductAndUpdateExpense(req, res, next, id, data={}, (i, expenses) => {
        expenses.splice(i, i);
        return expenses;
    })
}


const findProductAndUpdateExpense = async (req, res, next, id, data = {}, logic) => {
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
                expenses = logic(i, expenses, data);
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