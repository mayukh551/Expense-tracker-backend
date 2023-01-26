const express = require('express');
const router = express.Router();
const asyncWrap = require('../Middleware/async-wrapper');
const {
    fetchAnalytics,
    getYearhChartData,
    getMonthChartData
} = require('../Controllers/AnalyticsController');

router.route('/').get(asyncWrap(fetchAnalytics, 'Fetch Analytics'));

router.route('/year/:year').get(asyncWrap(getYearhChartData, ''));

router.route('/month/:month/:year').get(asyncWrap(getMonthChartData, ''));

router.route('*').get((req, res) => {
    console.log('Invalid URL');
    res.status(404).json({ status: "failure", message: "Invalid URL" });
})

module.exports = router;