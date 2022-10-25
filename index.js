const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const expenseRouter = require('./Routers/expense.router');
const authRouter = require('./Routers/auth.router');
const { errorLogger, errorResponder, failSafeHandler } = require('./Middleware/error-handler');

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

app.get('/', (req, res) => {
    res.send("Server is Live");
})

app.use('/login',)

app.use('/expenses', expenseRouter);

// error-handling middlewaqre
app.use(errorLogger);
app.use(errorResponder);
app.use(failSafeHandler);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log('Server is Live on port deployed url');
})