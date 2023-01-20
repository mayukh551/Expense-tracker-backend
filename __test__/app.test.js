const request = require("supertest");
const { app, url, connectionParams } = require("../app");
const mongoose = require("mongoose");

beforeAll(async () => {
    await mongoose.connect(url, connectionParams);
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('Root Test', () => {
    test('It should respond to the GET Request', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
        expect(response.text).toMatch(/Server is Live/);
    })
})