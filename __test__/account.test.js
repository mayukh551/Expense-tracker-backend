const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const User = require('../Models/user.model');
const client = require('../config/redisConfig');

var token = '';

const { email, password } = require("../config/testConfig").loginCreds;

let accountId;

beforeAll(async () => {

    // get access token
    const response = await request(app)
        .post('/auth/login/')
        .send({
            email,
            password
        });

    token = response.body.token;

    const user = await User.find({ email });
    accountId = user._id;
});

afterAll(async () => {
    // Disconnect from the test database
    await mongoose.connection.close();
    await client.quit();
});

// describe('POST /account/:id', () => {
//     test('should create a new account', async () => {
//         const response = await request(app)
//             .post(`/account/${accountId}`)
//             .send({
//                 phone: '1234567890',
//                 budget: {
//                     monthly: 1000,
//                     yearly: 12000,
//                 },
//                 age: 30,
//                 salary: 50000,
//             });

//         expect(response.status).toBe(201);
//         expect(response.body.message).toBe('Account Created Successfully');
//         expect(response.body.data).toHaveProperty('_id');
//         accountId = response.body.data._id;
//     });
// });

describe('GET /account/:id', () => {
    test('should get the account details', async () => {
        const response = await request(app)
            .set({ 'x-access-token': `${token}` })
            .get(`/account/${accountId}`);

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveProperty('name', 'Mayukh Bhowmick');
        expect(response.body.data).toHaveProperty('email', 'mactavish171@gmail.com');
    });
});

describe('PUT /account/:id', () => {
    test('should update the account details', async () => {

        const updateAcc = {
            name: 'Jane Doe',
            email: 'janedoe@example.com',
            phone: '9876543210',
            budget: {
                monthly: 2000,
                yearly: 24000,
            },
            age: 35,
            salary: 60000,
            category: ['category3', 'category4']
        }

        const response = await request(app)
            .set({ 'x-access-token': `${token}` })
            .put(`/account/${accountId}`)
            .send(updateAcc);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Account Updated Successfully');

        const responseBody = response.body.data;

        Object.keys(updateAcc).forEach(prop => expect(updateAcc[prop]).toBe(responseBody[prop]));

    });
});

describe('DELETE /account/:id', () => {
    test('should delete the account', async () => {

        const response = await request(app)
            .set({ 'x-access-token': `${token}` })
            .delete(`/account/${accountId}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Account Deleted Successfully');

    });
});
