const express = require('express');
const router = express.Router();
const asyncWrap = require('../Middleware/async-wrapper');
const verifyUser = require('../Middleware/verify-user');
const {
    fetchAnalytics,
    getYearhChartData,
    getMonthChartData,
    categoryPieChart,
    createMonthlyExpenditurePieChart
} = require('../Controllers/AnalyticsController');

router.route('/').get(verifyUser, asyncWrap(fetchAnalytics));

router.route('/year/:year').get(verifyUser, asyncWrap(getYearhChartData));

router.route('/month/:month/:year').get(verifyUser, asyncWrap(getMonthChartData));

router.route('/pie-chart/category/:id').get(verifyUser, asyncWrap(categoryPieChart));

router.route('/pie-chart/month/:id').get(verifyUser, asyncWrap(createMonthlyExpenditurePieChart));

router.route('*').get((req, res) => {
    console.log('Invalid URL');
    res.status(404).json({ status: "failure", message: "Invalid URL" });
})

module.exports = router;