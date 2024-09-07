const ExcelJS = require('exceljs');
const Expense = require('../Models/expense.model');
const User = require('../Models/user.model');
const AppError = require('../Error/AppError');
const {
    formatCurrency,
    applyHeaderStyle,
    applyAlternatingRowColors,
    addTotalRow,
    addCellBorder,
    addCellBackgroundColor
} = require('../utils/excel');

const exportExpensesExcel = async (req, res, next) => {
    const apiEndpoint = req.method + '/ : ' + req.originalUrl;

    try {
        const email = req['user-email'];
        const { month, year } = req.query;

        // Convert month number to month name
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthIndex = parseInt(month, 10) - 1; // Subtract 1 as array is 0-indexed
        if (monthIndex < 0 || monthIndex > 11) {
            return next(new AppError(400, 'Invalid month', apiEndpoint));
        }
        const monthName = monthNames[monthIndex];

        const user = await User.findOne({ email: email });
        if (!user) {
            return next(new AppError(404, 'User not found', apiEndpoint));
        }

        const userId = user._id;

        const expenses = await Expense.find({
            userId: userId,
            year: year,
            month: monthName
        })
        .sort({ date: 1 }) // Sort expenses by date in ascending order
        .lean();

        if (expenses.length === 0) {
            return next(new AppError(404, 'No expenses found for this month', apiEndpoint));
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Expenses');

        // Define columns
        worksheet.columns = [
            { header: 'Date', key: 'date', width: 15 },
            { header: 'Title', key: 'title', width: 30 },
            { header: 'Amount', key: 'amount', width: 15 },
            { header: 'Category', key: 'category', width: 20 },
            { header: 'Quantity', key: 'quantity', width: 10 },
        ];

        // Apply header styles
        applyHeaderStyle(worksheet, worksheet.getRow(1));

        // Add rows
        expenses.forEach(expense => {
            worksheet.addRow({
                date: expense.date,
                title: expense.title,
                amount: formatCurrency(expense.amount),
                category: expense.category,
                quantity: expense.quantity,
            });
        });

        // Apply alternating row colors
        applyAlternatingRowColors(worksheet);

        // Add total row
        const totalAmount = expenses.reduce((sum, expense) => sum + (expense.amount * expense.quantity), 0);
        addTotalRow(worksheet, totalAmount);

        // count total items bought from quantity
        const totalItems = expenses.reduce((sum, expense) => sum + expense.quantity, 0);

        // add cell border to total row
        const totalRow = worksheet.getRow(worksheet.rowCount);
        totalRow.eachCell({ includeEmpty: true }, (cell) => {
            addCellBorder(cell);
            addCellBackgroundColor(cell, 'FFFFF2CC');
            cell.alignment = { vertical: 'middle', horizontal: 'center' };  // Center the text
        });

        // Add total quantity to the end of quantity column
        const totalQuantityCell = worksheet.getCell(`E${worksheet.rowCount}`);
        totalQuantityCell.value = totalItems;
        totalQuantityCell.font = { bold: true };
        addCellBackgroundColor(totalQuantityCell, 'FFFFF2CC');
        addCellBorder(totalQuantityCell);

        // Calculate highest expense and its category
        const highestExpense = expenses.reduce((max, expense) => 
            expense.amount > max.amount ? expense : max
        , { amount: 0 });

        // Add highest expense row
        const highestExpenseRow = worksheet.addRow([
            'Highest Expense:',
            highestExpense.title,
            formatCurrency(highestExpense.amount),
            highestExpense.category,
            highestExpense.quantity
        ]);

        highestExpenseRow.font = { bold: true };
        highestExpenseRow.eachCell({ includeEmpty: true }, (cell) => {
            addCellBorder(cell);
            addCellBackgroundColor(cell, 'FFFFD700');  // Gold color for emphasis
            cell.alignment = { vertical: 'middle', horizontal: 'center' };  // Center the text
        });

        // add lowest expense row
        const lowestExpense = expenses.reduce((min, expense) => 
            expense.amount < min.amount ? expense : min
        , { amount: Infinity });

        // Add lowest expense row
        const lowestExpenseRow = worksheet.addRow([
            'Lowest Expense:',
            lowestExpense.title,
            formatCurrency(lowestExpense.amount),
            lowestExpense.category,
            lowestExpense.quantity
        ]);

        lowestExpenseRow.font = { bold: true };
        lowestExpenseRow.eachCell({ includeEmpty: true }, (cell) => {
            addCellBorder(cell);        
            addCellBackgroundColor(cell, 'FFC0C0C0');  // Silver color for emphasis
            cell.alignment = { vertical: 'middle', horizontal: 'center' };  // Center the text
        });

        // add average expense row
        const averageExpense = totalAmount / expenses.length;
        const averageExpenseRow = worksheet.addRow([
            'Average Expense:',
            '',
            formatCurrency(averageExpense),
            '',
            ''
        ]);

        averageExpenseRow.font = { bold: true };
        averageExpenseRow.eachCell({ includeEmpty: true }, (cell) => {
            addCellBorder(cell);
            addCellBackgroundColor(cell, 'FFC0C0C0');  // Silver color for emphasis
            cell.alignment = { vertical: 'middle', horizontal: 'center' };  // Center the text
        });

        worksheet.getColumn('A').width = 30;

        // Set response headers
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition',
            `attachment; filename=expenses_${year}_${monthName}.xlsx`
        );

        // Write to response
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error('Error exporting expenses:', error);
        next(new AppError(500, 'Error exporting expenses', apiEndpoint));
    }
};

module.exports = {
    exportExpensesExcel,
};
