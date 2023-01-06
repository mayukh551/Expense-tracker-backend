// Fing Highest Expense/purchase till date
const findHighestExpense = (itemList) => {
    var maxPrice = 0;
    var itemName = "";
    var year = '';
    itemList.forEach(item => {
        // maxPrice = Math.max(maxPrice, item.amount);
        if (item.amount > maxPrice) {
            maxPrice = item.amount;
            itemName = item.title;
            year = item.date.slice(0, 4);
        }
    })

    console.log(itemName, year, maxPrice);

    return {
        maxPrice,
        itemName,
        year
    };
}

// to get which year is most spent and the amount
// also to get which year is least spent and the amount
const findYearWithHighLowExpense = (itemList) => {
    var yearExpense = {}
    const currentYear = new Date().getFullYear();
    for (let year = currentYear - 3; year <= currentYear; year++) {
        yearExpense[year] = 0;
    }

    // summing up total expense for every year ( 2019 - 2022 )
    itemList.forEach(item => {
        const fullYear = item.date.slice(0, 4);
        yearExpense[fullYear] = yearExpense[fullYear] + item.amount;
    })

    // list of years and amount list items
    const yearList = Object.entries(yearExpense);

    var maxVal = 0;
    var minVal = Number.MAX_VALUE;

    var chosenMaxYear = "";
    var chosenMinYear = "";

    // finding year with highest expenses and year lowest expenses
    yearList.forEach(el => {
        if (yearExpense[el[0]] > maxVal) {
            maxVal = yearExpense[el[0]]
            chosenMaxYear = el[0]
        }
        if (yearExpense[el[0]] < minVal) {
            minVal = yearExpense[el[0]]
            chosenMinYear = el[0]
        }
    })
    var yearWithMaxValue = { year: chosenMaxYear, amount: maxVal }
    var yearWithMinValue = { year: chosenMinYear, amount: minVal }

    console.log(yearWithMaxValue);
    console.log(yearWithMinValue);
    return { year_most_spent: yearWithMaxValue, year_least_spent: yearWithMinValue };
}


module.exports = {
    findHighestExpense,
    findYearWithHighLowExpense
};