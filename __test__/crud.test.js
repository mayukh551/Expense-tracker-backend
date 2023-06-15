const request = require("supertest");
const { app, url, connectionParams } = require("../app");
const mongoose = require("mongoose");
var token = '';

const { email, password } = require("../config/testConfig").loginCreds;

// create redis client
// const redis = require('redis');
// const client = redis.createClient();

beforeAll(async () => {

    // Connect to Redis
    // client.on('error', err => console.log('Redis Client Error', err));
    // client.connect().then(() => console.log('Connected to Redis'));

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

    // delete all keys
    try {
        await client.flushAll();

    } catch (error) {
        console.log('Error deleting keys:', error);
    }

    // close connections
    await mongoose.connection.close();
    await client.quit();
});

/**
 * Test if the given object has all expected properties and their values are of the expected types.
 *
 * @param {object} body - The object to be tested.
 * @param {number} status - The expected status code.
 */
function testObjectProperties(body, status) {
    expect(status).toBe(200);
    expect(typeof body).toEqual('object');

    ['id', 'title', 'userId', 'amount', 'date', 'quantity'].forEach(prop => {
        expect(body).toHaveProperty(prop);
    });

    const { id, title, userId, amount, date, quantity } = body;
    expect(typeof id).toBe('string');
    expect(id.length).toBeGreaterThan(1);

    expect(typeof title).toBe('string');
    expect(typeof userId).toBe('string');
    expect(typeof amount).toBe('number');
    expect(typeof date).toBe('string');
    expect(quantity).toBeGreaterThanOrEqual(1);
}

describe('CRUD Test', () => {

    test('GET/ => Returns an array of expenses for Feb, 2023', async () => {
        const response = await request(app)
            .get('/expenses?month=02&year=2023')
            .set({ 'x-access-token': `${token}` })

        expect(response.status).toBe(200);
        const resopnseBody = response.body;
        expect(resopnseBody).toBeInstanceOf(Array);
    });

    test('POST/ => Returns new added expenses', async () => {
        const response = await request(app)
            .post('/expenses/new/').set({ 'x-access-token': `${token}` })
            .send({
                id: 'test-123',
                title: 'test title',
                amount: 123,
                date: '2022-01-19'
            })

        testObjectProperties(response.body, response.status);

    })

    test('PUT/ => Returns updated expense and Status should be 200', async () => {
        const response = await request(app)
            .put('/expenses/update/test-123/').set({ 'x-access-token': `${token}` })
            .send({
                id: 'test-123',
                title: 'test update title',
                amount: 231,
                date: '2022-02-19'
            })
        testObjectProperties(response.body, response.status);
    })

    test('DEL/ => Returns Deleted expense and Status should be 200', async () => {
        const response = await request(app)
            .delete('/expenses/delete/test-123/').set({ 'x-access-token': `${token}` })
        testObjectProperties(response.body, response.status);
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
            .delete('/expenses/delete/wrong-id-500/').set({ 'x-access-token': `${token}` })

        console.log(response.body.error);
        expect(response.status).toBe(404);
        expect(response.body.error.name).toBe('CrudError');
        expect(response.body.isSuccess).toBeFalsy();
    })
})