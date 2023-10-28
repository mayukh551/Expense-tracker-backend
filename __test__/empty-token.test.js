const request = require("supertest");
const { app, url, connectionParams } = require("../app");
const mongoose = require("mongoose");

beforeAll(async () => {
    await mongoose.connect(url, connectionParams);
});

afterAll(async () => {
    await mongoose.connection.close();
});


describe('Unauthorized CRUD Attempt Test', () => {

    test('GET/ => Empty token | statusCode should be 401', async () => {
        const response = await request(app)
            .get('/expenses/')
            .set({ 'x-access-token': `${''}` })

        expect(response.status).toBe(401);
    });

    test('POST/ => Empty token | statusCode should be 401', async () => {
        const response = await request(app)
            .post('/expenses/new/').set({ 'x-access-token': `${''}` })
            .send({
                id: 'test-123',
                title: 'test title',
                amount: 123,
                date: '2022-01-19'
            })

        expect(response.status).toBe(401);
    })

    test('PUT/ => Empty token | statusCode should be 401', async () => {
        const response = await request(app)
            .put('/expenses/update/test-123/').set({ 'x-access-token': `${''}` })
            .send({
                id: 'test-123',
                title: 'test update title',
                amount: 231,
                date: '2022-02-19'
            })
        expect(response.status).toBe(401);
    })

    test('DEL/ => Empty token | statusCode should be 401', async () => {
        const response = await request(app)
            .post('/expenses/delete/')
            .set({ 'x-access-token': `${''}` })
            .send({
                ids: ['test-123'],
                month: 'Jan',
                year: '2022'
            })

        expect(response.status).toBe(401);
    })

})