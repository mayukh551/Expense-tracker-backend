const Expense = require('../Models/expense.model.js');

exports.fetchAllExpenses = async (req, res) => {
    console.log('fetch all expenses');
    const response = await Expense.find({});
    res.json(response);
}

exports.addNewExpense = async (req, res) => {
    console.log(req.body);
    const userDate = req.body.date;
    const userLabel = req.body.title;
    const userPrice = req.body.amount;
    const newExpense = new Expense({
        date: userDate,
        title: userLabel,
        amount: userPrice
    })
    await newExpense.save();
}

exports.updateExpense = async (req, res) => {
    const { id } = req.params;
    console.log("req.body: ", req.body);
    const updatedDate = req.body.date;
    const updatedLabel = req.body.title;
    const updatedPrice = req.body.amount;
    await Expense.findByIdAndUpdate(id, {
        title: updatedLabel,
        date: updatedDate,
        amount: updatedPrice
    });
}


exports.deleteExpense = async (req, res) => {
    const { id } = req.params;
    console.log("ID is :", id);
    await Expense.findByIdAndDelete(id);
}