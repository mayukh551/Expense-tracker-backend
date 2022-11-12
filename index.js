const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const expenseRouter = require('./Routers/expense.router');
const authRouter = require('./Routers/auth.router');
const { errorLogger, errorResponder, failSafeHandler } = require('./Middleware/error-handler');
// const verifyUser = require('./Middleware/verify-user.js');

app.use(cors());
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

const url = "mongodb+srv://mongoUser:UMeZWwfjbKKpz57v@cluster0.znp6gdd.mongodb.net/test?retryWrites=true&w=majority";

const connectionParams = {
    useNewUrlParser: true
}

mongoose.connect(url, connectionParams)
    .then(() => console.log('Connected to MongoDB'))
    .catch(() => console.log('Connection Failed'));

app.get('/', (req, res) => {
    res.send("Server is Live");
})

// request testing
app.use((req, res, next) => {
    console.log("Request Incoming");
    next();
})

// API Routes
app.use('/auth', authRouter);
// app.use('/expenses', verifyUser, expenseRouter);
app.use('/expenses', expenseRouter);

// error-handling middlewaqre
app.use(errorLogger);
app.use(errorResponder);
app.use(failSafeHandler);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log('Server is Live on port deployed url');
})