const request = require("supertest");
const { app, url, connectionParams } = require("../app");
const mongoose = require("mongoose");

beforeAll(async () => {
    await mongoose.connect(url, connectionParams);
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('AUTH Test', () => {
    test('Login - should return token string and a success boolean', async () => {
        const response = await request(app)
            .post('/auth/login/')
            .send({
                email: 'mactavish171@gmail.com',
                password: '123456'
            })
        expect(response.status).toBe(200);
        expect(response.body.isSuccess).toBeTruthy();
        expect(typeof response.body.token).toBe("string");  
    })
})
