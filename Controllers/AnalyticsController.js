const { getYearAnalytics, getMonthAnalytics, noDataResponse } = require('../utils/analyticsHelper');
const User = require('../Models/user.model.js');
const Expenses = require('../Models/expense.model')
const UserError = require('../Error/UserError');

const monthList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/* Analytics */

fetchAnalytics = async (req, res, next) => {
    console.log('in fetchAnalytics');
    // const decoded = verifyUser(req, next);
    const email = req['user-email'];
    const user = await User.findOne({ email: email });
    const expenses = await Expenses.find({ userId: user._id });

    if (expenses) {
        const year = String(new Date().getFullYear());
        const {
            totalPurchaseAmount,
            totalItems,
            highestExpense,
            lowestExpense
        } = getYearAnalytics(year, expenses);

        const {
            highExpenseMonthDetails,
            lowExpenseMonthDetails
        } = getMonthAnalytics(year, expenses);

        res.status(200).json({
            success: true,
            data: {
                year_stats: {
                    totalPurchaseAmount,
                    totalItems,
                    highestExpense,
                    lowestExpense
                },
                month_stats: {
                    highExpenseMonthDetails,
                    lowExpenseMonthDetails
                }
            }
        })
    }

    else noDataResponse(res);

}


const getYearhChartData = async (req, res, next) => {

    const email = req['user-email'];
    const user = await User.findOne({ email: email });
    const expenses = await Expenses.find({ userId: user._id });

    const { year } = req.params;

    if (year && expenses) {

        var expenseMonthSum = {};
        // filling up with zero
        for (let index = 1; index <= 12; index++) {
            let monthNo = String(index);
            if (index < 10)
                expenseMonthSum['0' + monthNo] = 0;
            else
                expenseMonthSum[monthNo] = 0;
        }

        // Total Expense Sum of every month for a given year
        expenses.forEach((item) => {
            if (item.date.slice(0, 4) === year) {
                let monthNo = item.date.slice(5, 7);
                expenseMonthSum[monthNo] += item.amount;
            }
        })

        // labels are month no.s
        const labels = Object.keys(expenseMonthSum);

        // to store expense amount for every month of a given year for the year chart
        var yearChartData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        // filling up expense amount for every month of a given year for the year chart
        labels.forEach(label => {
            yearChartData[parseInt(label) - 1] = expenseMonthSum[label];
        })

        var isYearEmpty = 0;
        yearChartData.forEach(amount => {
            if (amount != 0) isYearEmpty++;
        })

        if (isYearEmpty > 0) res.status(200).json({ success: true, data: yearChartData })

        else noDataResponse(res);
    }
    else noDataResponse(res);
}


const getMonthChartData = async (req, res, next) => {
    // const decoded = verifyUser(req, next);
    const email = req['user-email'];
    const user = await User.findOne({ email: email });
    const expenses = await Expenses.find({ userId: user._id });

    // extracting params from req object    
    const { year } = req.params;
    const { month } = req.params;

    var monthExpenseChart = {}; // carry expenses for all days of a given month and year

    // find total no. of days of a given month and year
    const totalDays = new Date(parseInt(monthList.indexOf(month)) + 1, parseInt(year), 0).getDate();
    var monthChartData = []; // to store expense amount for every day of a given month for the month chart
    var days = []; // to store all day no.s of the month

    // initializing total amount for all days as zero
    for (let day = 1; day <= totalDays; day++) {
        days.push(day);
        monthExpenseChart[day] = 0;
    }

    if (year && month && expenses) {

        // adding up expenses for every day of a given month and year
        expenses.forEach(expense => {
            var monthNo = monthList.indexOf(month) + 1;

            // extracting year, month, day from date prop
            var expenseYear = expense.date.slice(0, 4);
            var expenseMonth = expense.date.slice(5, 7);
            var expenseDay = expense.date.slice(8);

            if (expenseYear === year && parseInt(expenseMonth) === monthNo) {
                const dayNo = parseInt(expenseDay);
                monthExpenseChart[dayNo] += parseInt(expense.amount);
            }
        })

        // filling up expenses of every day of the given month
        for (let day = 1; day <= totalDays; day++)
            monthChartData.push(monthExpenseChart[day]);

        var isYearEmpty = 0;
        monthChartData.forEach(amount => {
            if (amount != 0) isYearEmpty++;
        })

        if (isYearEmpty > 0)
            res.status(200).json({
                success: true,
                data: monthChartData,
                labels: days
            })

        else noDataResponse(res);

    }
    // no expenses
    else noDataResponse(res);

}


const categoryPieChart = async (req, res, next) => {

    console.log("Inside categoryPieChart");

    // prepare data from categories of Expenses documents
    try {
        const apiEndpoint = req.originalUrl;

        const { id: userId } = req.params;

        const year = req.query.year;

        if (!userId) throw new UserError(400, 'User ID is required', apiEndpoint);

        const expenses = await Expenses.find({ userId: userId, year: year });

        if (!expenses) throw new UserError(400, 'No expenses found', apiEndpoint);

        // from the expenses array, find the total sum of amount for each category
        var categorySum = {};

        expenses.forEach(expense => {

            // if category already exists, add the amount to the existing amount
            if (expense.category in categorySum)
                categorySum[expense.category] += expense.amount * expense.quantity;

            // if category doesn't exist, create a new category and add the amount
            else
                categorySum[expense.category] = expense.amount * expense.quantity;
        });

        const labels = Object.keys(categorySum)

        const data = [];

        labels.forEach(key => {
            data.push(categorySum[key]);
        })

        console.log(labels, data);

        res.status(200).json({
            success: true,
            data: data,
            labels: labels
        })
    }
    catch (err) {
        noDataResponse(res);
    }

}


// create monthly expenditure pie chart

const createMonthlyExpenditurePieChart = async (req, res, next) => {

    // prepare data from categories of Expenses documents
    try {

        const apiEndpoint = req.originalUrl;

        const { id: userId } = req.params;

        const year = req.query.year;

        if (!userId) throw new UserError(400, 'User ID is required', apiEndpoint);

        const expenses = await Expenses.find({ userId: userId, year: year });

        if (!expenses) throw new UserError(400, 'No expenses found', apiEndpoint);

        // from the expenses array, find the total sum of amount for each category
        var monthSum = {};

        for (let index = 0; index < 12; index++)
            monthSum[monthList[index]] = 0;

        expenses.forEach(expense => {
            // add the amount to the existing amount
            monthSum[expense.month] += expense.amount * expense.quantity;
        });

        const labels = monthList;

        const data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        labels.forEach(key => {
            let ind = monthList.indexOf(key);
            data[ind] = monthSum[key];
        })

        console.log(labels, data);

        res.status(200).json({
            success: true,
            data: data,
            labels: labels
        })
    }
    catch (err) {
        noDataResponse(res);
    }
}



// const findHighestExpense = (itemList) => {
//     var maxPrice = 0;
//     var itemName = "";
//     var year = '';
//     var month = '';
//     var day = '';
//     itemList.forEach(item => {
//         // maxPrice = Math.max(maxPrice, item.amount);
//         if (item.amount > maxPrice) {
//             maxPrice = item.amount;
//             itemName = item.title;
//             year = item.date.slice(0, 4);

//         }
//     })

//     console.log(itemName, year, maxPrice);

//     return {
//         maxPrice,
//         itemName,
//         year,
//         month,
//         day
//     };
// }

// // to get which year is most spent and the amount
// // also to get which year is least spent and the amount
// const findYearWithHighLowExpense = (itemList) => {
//     var yearExpense = {}
//     const currentYear = new Date().getFullYear();
//     for (let year = currentYear - 3; year <= currentYear; year++) {
//         yearExpense[year] = 0;
//     }

//     // summing up total expense for every year ( 2019 - 2022 )
//     itemList.forEach(item => {
//         const fullYear = item.date.slice(0, 4);
//         yearExpense[fullYear] = yearExpense[fullYear] + item.amount;
//     })

//     // list of years and amount list items
//     const yearList = Object.entries(yearExpense);

//     var maxVal = 0;
//     var minVal = Number.MAX_VALUE;

//     var chosenMaxYear = "";
//     var chosenMinYear = "";

//     // finding year with highest expenses and year lowest expenses
//     yearList.forEach(el => {
//         if (yearExpense[el[0]] > maxVal) {
//             maxVal = yearExpense[el[0]]
//             chosenMaxYear = el[0]
//         }
//         if (yearExpense[el[0]] < minVal) {
//             minVal = yearExpense[el[0]]
//             chosenMinYear = el[0]
//         }
//     })
//     var yearWithMaxValue = { year: chosenMaxYear, amount: maxVal }
//     var yearWithMinValue = { year: chosenMinYear, amount: minVal }

//     console.log(yearWithMaxValue);
//     console.log(yearWithMinValue);
//     return { year_most_spent: yearWithMaxValue, year_least_spent: yearWithMinValue };
// }


module.exports = {
    fetchAnalytics,
    getYearhChartData,
    getMonthChartData,
    categoryPieChart,
    createMonthlyExpenditurePieChart
};