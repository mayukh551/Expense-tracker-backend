const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const expenseRouter = require('./Routers/expense.router');
const authRouter = require('./Routers/auth.router');
const errorHandler = require('./Middleware/error-handler');
const dayjs = require('dayjs')

app.use(cors({
    origin: 'https://expense-tracker-react-nine.vercel.app'
}));
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
require("dotenv").config();

const url = process.env.DB_URL;

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
    console.log(`Incoming Request at ${dayjs().hour()}:${dayjs().minute()}\n`);
    next();
})

// API Routes
app.use('/auth', authRouter);
app.use('/expenses', expenseRouter);

// error-handling middlewaqre
app.use(errorHandler);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log('Server is Live on port deployed url');
})
