const request = require("supertest");
const { app, url, connectionParams } = require("../app");
const mongoose = require("mongoose");
var token = '';

beforeAll(async () => {
    await mongoose.connect(url, connectionParams);
    const response = await request(app)
        .post('/auth/login/')
        .send({
            email: 'mactavish171@gmail.com',
            password: '123456'
        })
    token = response.body.token;
});

afterAll(async () => {
    await mongoose.connection.close();
});


function testObjectProperties(body, status) {
    expect(status).toBe(200);
    expect(typeof body).toEqual('object');

    expect(body).toHaveProperty('_id');
    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('title');
    expect(body).toHaveProperty('userId');
    expect(body).toHaveProperty('amount');
    expect(body).toHaveProperty('date');
}

describe('CRUD Test', () => {

    test('GET/ => Returns an array of expenses and Status should be 200', async () => {
        const response = await request(app)
            .get('/expenses/')
            .set({ 'x-access-token': `${token}` })

        expect(response.status).toBe(200);
        const resopnseBody = response.body;
        expect(resopnseBody).toBeInstanceOf(Array);
    });

    test('POST/ => Returns new added expenses and Status should be 200', async () => {
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