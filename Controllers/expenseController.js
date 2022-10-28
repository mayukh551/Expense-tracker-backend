const { Expense } = require('../Models/expense.model.js');

exports.fetchAllExpenses = async (req, res, next) => {
    try {
        const response = await Expense.find({});
        res.json(response);
    } catch (err) {
        next(err)
    }
}

exports.addNewExpense = async (req, res, next) => {
    console.log(req.body);
    const userDate = req.body.date;
    const userLabel = req.body.title;
    const userPrice = req.body.amount;

    try {
        const newExpense = new Expense({
            date: userDate,
            title: userLabel,
            amount: userPrice
        })
        await newExpense.save();
    } catch (err) {
        next(err);
    }

}

exports.updateExpense = async (req, res, next) => {
    const { id } = req.params;
    console.log("req.body: ", req.body);
    const updatedDate = req.body.date;
    const updatedLabel = req.body.title;
    const updatedPrice = req.body.amount;

    try {
        await Expense.findByIdAndUpdate(id, {
            title: updatedLabel,
            date: updatedDate,
            amount: updatedPrice
        });
    } catch (err) {
        err.type = 'INVALID_ID'
        next(err);
    }
}


exports.deleteExpense = async (req, res, next) => {
    const { id } = req.params;
    console.log("ID is :", id);
    try {
        await Expense.findByIdAndDelete(id);
    } catch (err) {
        err.type = 'INVALID_ID';
        next(err);
    }
}