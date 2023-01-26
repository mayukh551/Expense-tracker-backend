/* 
Year Anatyics with user's choice of year
*/

const getYearAnalytics = (year, itemList) => {
    // Total Purchase Amount for the year
    var totalPurchaseAmount = 0;
    var itemCounter = 0;
    var highestExpense = 0;
    var lowestExpense = Number.MAX_VALUE;
    var avgExpenditure = 0.0;
    itemList.forEach((item) => {
        if (item.date.slice(0, 4) === year) {
            totalPurchaseAmount += item.amount;
            itemCounter++;
            highestExpense = Math.max(highestExpense, item.amount);
            lowestExpense = Math.min(lowestExpense, item.amount);
        }
    })

    if (itemCounter > 0)
        avgExpenditure = totalPurchaseAmount / itemCounter;

    // Total no. of item brought on a given year
    var totalItems = itemCounter;

    // Return an object containing the statistics for the specified year
    return {
        totalPurchaseAmount,
        totalItems,
        avgExpenditure,
        highestExpense,
        lowestExpense
    }
}


/* 
Month Analytics based on year of user's choice
*/

const getMonthAnalytics = (year, itemList) => {

    const monthList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var expenseMonthSum = {};
    for (let index = 1; index <= 12; index++) {
        let monthNo = String(index);
        if (index < 10)
            expenseMonthSum['0' + monthNo] = 0;
        else
            expenseMonthSum[monthNo] = 0;
    }

    // Total Expense Sum of every month for a given year
    itemList.forEach((item) => {
        if (item.date.slice(0, 4) === year) {
            let monthNo = item.date.slice(5, 7);
            expenseMonthSum[monthNo] += item.amount;
        }
    })

    console.log('expenseMonthSum', expenseMonthSum);

    // Finding months with highest and lowest Expense Sum;
    var expenseMonths = Object.keys(expenseMonthSum);
    var maxTotalExpense = 0;
    var totalExpenseIsZeroCounter = 0;
    var minTotalExpense = Number.MAX_VALUE;
    var highExpenseMonthDetails = {};
    var lowExpenseMonthDetails = {};
    expenseMonths.forEach((expenseMonth) => {

        var totalExpense = expenseMonthSum[expenseMonth];
        console.log(totalExpense);
        // Highest Expense
        if (totalExpense > maxTotalExpense) {
            maxTotalExpense = totalExpense;
            highExpenseMonthDetails = {
                amount: maxTotalExpense,
                month: monthList[parseInt(expenseMonth) - 1]
            };
        }

        if (totalExpense != 0)
            totalExpenseIsZeroCounter++;

        // Lowest Expense
        if (totalExpense < minTotalExpense) {
            minTotalExpense = totalExpense;
            lowExpenseMonthDetails = {
                amount: minTotalExpense,
                month: monthList[parseInt(expenseMonth) - 1]
            };
        }
    })

    // only 1 month expense is caclulated, rest all are zero
    if (totalExpenseIsZeroCounter == 1)
        lowExpenseMonthDetails = highExpenseMonthDetails;

    /* Return an object containing the statistics 
    for the highest and lowest expenditure months*/
    return {
        highExpenseMonthDetails,
        lowExpenseMonthDetails
    };
}

const noDataResponse = (res) => {
    res.status(200).json({
        success: true,
        data: null
    })
}


module.exports = {
    getYearAnalytics,
    getMonthAnalytics,
    noDataResponse
}