const { getYearAnalytics, getMonthAnalytics, noDataResponse } = require('../utils/analyticsHelper');
const User = require('../Models/user.model.js');
const verifyUser = require('../Middleware/verify-user');

const monthList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/* Analytics */

fetchAnalytics = async (req, res, next) => {
    console.log('in fetchAnalytics');
    const decoded = verifyUser(req, next);
    const email = decoded.email;
    const { expenses } = await User
        .findOne({ email: email })
        .populate('expenses')

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
    const decoded = verifyUser(req, next);
    const email = decoded.email;
    const { expenses } = await User
        .findOne({ email: email })
        .populate('expenses');

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

        var yearChartData = Object.values(expenseMonthSum);

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
    const decoded = verifyUser(req, next);
    const email = decoded.email;
    const { expenses } = await User
        .findOne({ email: email })
        .populate('expenses');

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
            console.log(monthNo, parseInt(expense.date.slice(5, 7)), expense.date.slice(0, 4));
            if (expense.date.slice(0, 4) === year && parseInt(expense.date.slice(5, 7)) === monthNo) {
                const dayNo = parseInt(expense.date.slice(9));
                console.log(dayNo);
                monthExpenseChart[dayNo] += parseInt(expense.amount);
            }
        })
        console.log(monthExpenseChart);
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
    // findHighestExpense,
    // findYearWithHighLowExpense
};