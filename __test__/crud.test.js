const request = require("supertest");
const { app, url, connectionParams } = require("../app");
const mongoose = require("mongoose");

beforeAll(async () => {
    await mongoose.connect(url, connectionParams);
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('CRUD Test', () => {
    require('dotenv').config({ path: '../.env' })
    // get expenses
    describe('GET/', () => {
        test('Return an array of expenses and status should be 200', async () => {
            const response = await request(app)
                .get('/expenses/')
                .set({ 'x-access-token': `${process.env.TOKEN}` })

            expect(response.status).toBe(200);
            const resopnseBody = response.body;
            expect(resopnseBody).toBeInstanceOf(Array);
        });
    })

    describe('POST/', () => {
        test('Return new added expenses and status should be 200', async () => {
            const response = await request(app)
                .post('/expenses/new/').set({ 'x-access-token': `${process.env.TOKEN}` })
                .send({
                    id: 'test-123',
                    title: 'test title',
                    amount: 123,
                    date: '2022-01-19'
                })
            expect(response.status).toBe(200);
            expect(typeof response.body).toEqual('object');
        })
    })

    describe('PUT/', () => {
        test('Return updated expense and Status should be 200', async () => {
            const response = await request(app)
                .put('/expenses/update/test-123/').set({ 'x-access-token': `${process.env.TOKEN}` })
                .send({
                    id: 'test-123',
                    title: 'test update title',
                    amount: 231,
                    date: '2022-02-19'
                })
            expect(response.status).toBe(200);
            expect(typeof response.body).toEqual('object');
        })
    })

    describe('DEL/', () => {
        test('Return Deleted expense and Status should be 200', async () => {
            const response = await request(app)
                .delete('/expenses/delete/test-123/').set({ 'x-access-token': `${process.env.TOKEN}` })
            expect(response.status).toBe(200);
            expect(typeof response.body).toEqual('object');
        })
    })
})