const express = require('express');
const router = express.Router();
const asyncWrap = require('../Middleware/async-wrapper');
const verifyUser = require('../Middleware/verify-user');
const {
    fetchAnalytics,
    getYearhChartData,
    getMonthChartData
} = require('../Controllers/AnalyticsController');

router.route('/').get(verifyUser, asyncWrap(fetchAnalytics));

router.route('/year/:year').get(verifyUser, asyncWrap(getYearhChartData));

router.route('/month/:month/:year').get(verifyUser, asyncWrap(getMonthChartData));

router.route('*').get((req, res) => {
    console.log('Invalid URL');
    res.status(404).json({ status: "failure", message: "Invalid URL" });
})

module.exports = router;