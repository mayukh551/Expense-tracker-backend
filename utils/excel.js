const ExcelJS = require('exceljs');

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

const applyHeaderStyle = (worksheet, headerRow) => {
    headerRow.eachCell((cell) => {
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF4F81BD' }
        };
        cell.font = {
            bold: true,
            color: { argb: 'FFFFFFFF' }
        };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });
};

const applyAlternatingRowColors = (worksheet) => {
    worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) {
            const fill = rowNumber % 2 === 0
                ? { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF2F2F2' } }
                : { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } };
            row.eachCell({ includeEmpty: true }, (cell) => {
                cell.fill = fill;
            });
        }
    });
};

const addTotalRow = (worksheet, totalAmount) => {
    const totalRow = worksheet.addRow(['Total', '', formatCurrency(totalAmount), '', '']);
    totalRow.font = { bold: true };
    totalRow.getCell(3).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFF2CC' }
    };
};

const addCellBorder = (cell, style = 'thin') => {
    cell.border = {
        top: { style: style },
        left: { style: style },
        bottom: { style: style },
        right: { style: style }
    };
};

const addCellBackgroundColor = (cell, colorCode) => {
    cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: colorCode }
    };
};



module.exports = {
    formatCurrency,
    applyHeaderStyle,
    applyAlternatingRowColors,
    addTotalRow,
    addCellBorder,
    addCellBackgroundColor
};
