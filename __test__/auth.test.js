const request = require("supertest");
const { app, url, connectionParams } = require("../app");
const mongoose = require("mongoose");

const { email, password, invalidEmail, invalidPassword } = require("../config/testConfig").loginCreds;

afterAll(async () => {
    await mongoose.connection.close();
});

const count = (str) => {
    const regex = /\./g;
    return (str.match(regex) || []).length;
}


describe('AUTH Test', () => {
    test('Login - should return token string and a success boolean', async () => {

        const response = await request(app)
            .post('/auth/login/')
            .send({
                email,
                password
            })
        expect(response.status).toBe(200);
        expect(response.body.isSuccess).toBeTruthy();
        expect(typeof response.body.token).toBe("string");
        expect(count(response.body.token)).toBe(2);
    })
})


//* ------------------------------- Error Test for AUTH -----------------------------------------


describe('Invalid AUTH Credential Test', () => {

    test('Incorrect Email id : should return AuthError and StatusCode 401', async () => {

        const response = await request(app)
            .post('/auth/login/')
            .send({
                email: invalidEmail,
                password: '123456'
            })

        console.log(response.body.error);

        expect(response.status).toBe(401);
        expect(response.body.isSuccess).toBeFalsy();
        expect(response.body.error.name).toBe('AuthError');
    })


    test('Incorrect Password : should return ValidationError and StatusCode 400', async () => {

        const response = await request(app)
            .post('/auth/login/')
            .send({
                email,
                password: invalidPassword
            })

        console.log(response.body.error);

        expect(response.status).toBe(400);
        expect(response.body.isSuccess).toBeFalsy();
        expect(response.body.error.name).toBe('ValidationError');
    })
})