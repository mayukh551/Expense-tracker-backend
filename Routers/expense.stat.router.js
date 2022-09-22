const express = require('express');
const router = express.Router();
const Expense = require('../Models/expense.model.js');
const { findHighestExpense } = require('../Controllers/StatMethods');
const { findYearWithHighLowExpense } = require('../Controllers/StatMethods');

async function fetchItems() {
    const itemList = await Expense.find({});
    // console.log(itemList);
    return itemList;
}

fetchItems()
    .then((itemList) => {
        router.route('/highest-expense').get((req, res) => {
            console.log('in highest-expense');
            const result = findHighestExpense(itemList)
            res.json({ status: 'success', maxPrice: result });
        })

        router.route('/year-spent-most-least').get((req, res) => {
            const result = findYearWithHighLowExpense(itemList)
            res.json({ status: 'success', data: result })
        })
        // router.route('/year-least-spent').get((req, res) => {
        //     res.send('year least expense')
        // })
    })
    .catch(() => console.log('Could not fetch items from database'));


module.exports = router;