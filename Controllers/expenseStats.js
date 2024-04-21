const Expense = require('../Models/expense.model');
const User = require('../Models/user.model');
const AppError = require('../Error/AppError');
const asyncWrap = require('../Middleware/async-wrapper');


const getExpenseStats = async (req, res, next) => {

    const apiEndpoint = req.method + '/ : ' + req.originalUrl;


    try {
        const email = req['user-email'];

        const { month, year } = req.query;

        const user = await User.findOne({ email: email });

        const userId = user._id;

        const stats = await Expense.aggregate([
            {
                $match: {
                    userId: userId,
                    year: year,
                    month: month
                }
            },
            {
                $group: {
                    _id: "$userId",
                    totalAmount: {
                        $sum: { $multiply: ["$amount", "$quantity"] },
                    },
                    count: { $sum: 1 }
                }
            }
        ]);

        console.log(stats);

        if (stats.length === 0) {
            return next(new AppError(404, 'No expenses found for this month', apiEndpoint));
        }

        const { budget } = await User.findById(userId);

        const purchasedAmount = stats[0].totalAmount;

        const totalItems = stats[0].count;

        const savedAmount = budget.monthly - purchasedAmount;

        res.status(200).json({
            status: 'success',
            data: {
                purchasedAmount,
                totalItems,
                savedAmount
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 'success',
            data: {}
        });
    }

}


module.exports = getExpenseStats;