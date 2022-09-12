const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
// const Expense = require('./Models/expense.model.js');
const expenseRouter = require('./Routers/expense.router');

app.use(cors());
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

const url = "mongodb+srv://mongoUser:UMeZWwfjbKKpz57v@cluster0.znp6gdd.mongodb.net/?retryWrites=true&w=majority";

const connectionParams = {
    useNewUrlParser: true
}

mongoose.connect(url, connectionParams)
    .then(() => console.log('Connected to MongoDB'))
    .catch(() => console.log('Connection Failed'));


app.use('/expenses', expenseRouter);

app.listen(8800, () => {
    console.log('Server is Live on port 8800');
})