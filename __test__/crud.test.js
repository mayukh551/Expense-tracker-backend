const request = require("supertest");
const { app, url, connectionParams } = require("../app");
const mongoose = require("mongoose");
const client = require("../config/redisConfig");
var token = '';

const { email, password } = require("../config/testConfig").loginCreds;

const monthList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

beforeAll(async () => {

    // get access token
    const response = await request(app)
        .post('/auth/login/')
        .send({
            email,
            password
        })

    token = response.body.token;
});

// close Mongoose and redis connection
afterAll(async () => {
    // close connections
    await mongoose.connection.close();
    await client.quit();
});



describe('CRUD Test', () => {

    test('POST/ => Returns new added expenses', async () => {

        const newExpense = {
            id: 'test-123',
            title: 'test title',
            amount: 123,
            date: '2022-01-19',
            month: 'Jan',
            year: '2022',
            quantity: 1,
            category: 'test-category'
        }

        const response = await request(app)
            .post('/expenses/new/').set({ 'x-access-token': `${token}` })
            .send(newExpense);

        console.log('in Post Crud Test', response.body);

        expect(response.status).toBe(200);

        Object.keys(newExpense).forEach(prop => expect(newExpense[prop]).toBe(response.body[prop]));

    })


    test('GET/ => Returns an array of expenses for Feb, 2023', async () => {
        const response = await request(app)
            .get('/expenses?month=02&year=2023')
            .set({ 'x-access-token': `${token}` })

        expect(response.status).toBe(200);
        const resopnseBody = response.body;
        expect(resopnseBody).toBeInstanceOf(Array);
    });


    test('PUT/ => Returns updated expense and Status should be 200', async () => {

        const updatedExpense = {
            id: 'test-123',
            title: 'test update title',
            amount: 231,
            date: '2022-01-21',
            quantity: 3
        };

        const response = await request(app)
            .put('/expenses/update/test-123/').set({ 'x-access-token': `${token}` })
            .send(updatedExpense);

        expect(response.status).toBe(200);
        const resopnseBody = response.body;
        expect(resopnseBody).toBeInstanceOf(Object);

        // check if all properties are present in the response body same as updatedExpense
        Object.keys(updatedExpense).forEach(prop => expect(updatedExpense[prop]).toBe(resopnseBody[prop]));
    })


    test('DEL/ => Returns Deleted expense and Status should be 200', async () => {

        const ids = ['test-123'];

        const response = await request(app)
            .post('/expenses/delete/')
            .set({ 'x-access-token': `${token}` })
            .send({
                ids: ids,
                month: '01',
                year: '2022'
            })

        expect(response.status).toBe(200);
        expect(response.body.deletedCount).toBe(ids.length);
    })

})


// * ------------------------------------ Invalid ID Test ---------------------------------------------

describe('Invalid ID Test : sending request with invalid product id', () => {

    test('Update Req with wrong Expense Item Id: Should throw 404 CrudError', async () => {

        const response = await request(app)
            .put('/expenses/update/wrong-id-500/').set({ 'x-access-token': `${token}` })
            .send({
                id: 'test-123',
                title: 'test update title',
                amount: 231,
                date: '2022-02-19'
            })

        expect(response.status).toBe(404);
        expect(response.body.error.name).toBe('CrudError');
        expect(response.body.isSuccess).toBeFalsy();
    })


    test('DEL Req with wrong Expense Item Id: Should throw 404 CrudError', async () => {
        const response = await request(app)
            .delete('/expenses/delete/')
            .set({ 'x-access-token': `${token}` })
            .send({
                ids: ['wrong-id-500'],
                month: '01',
                year: '2022'
            })

        console.log(response.body.error);
        expect(response.status).toBe(404);
        // expect(response.body.error.name).toBe('CrudError');
        expect(response.body.isSuccess).toBeFalsy();
    })
})