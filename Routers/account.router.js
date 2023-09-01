const express = require('express');
const router = express.Router();
const asyncWrap = require('../Middleware/async-wrapper');
const verifyUser = require('../Middleware/verify-user');

const {
    createAccount,
    deleteAccount,
    getAccount,
    updateAccount
} = require('../Controllers/accountController');

router.route('/:id')
    .get(verifyUser, asyncWrap(getAccount))
    .put(verifyUser, asyncWrap(updateAccount))
    .post(verifyUser, asyncWrap(createAccount))
    .delete(verifyUser, asyncWrap(deleteAccount))

router.route('*').get((req, res) => {
    console.log('Invalid URL');
    res.status(404).json({ status: "failure", message: "Invalid URL" });
})

module.exports = router;