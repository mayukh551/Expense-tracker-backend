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

function shouldHaveData(response) {
    expect(response.status).toBe(200);
    expect(response.body.data).toBeInstanceOf(Array);
    expect(response.body.data).not.toHaveLength(0);
}

function shouldNotHaveData(response) {
    expect(response.status).toBe(200);
    expect(response.body.data).toBe(null);
}


describe('Fetch Year and Month Analytics', () => {

    // Testing Filled Data from Analytics

    test('Test total Purchase Amount, total items and more', async () => {
        const response = await request(app)
            .get('/profile/')
            .set('x-access-token', `${token}`)

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('data');
        if (response.body.data) {
            expect(response.body.data).toHaveProperty('year_stats');
            expect(response.body.data).toHaveProperty('month_stats');
            expect(typeof response.body.data.month_stats).toEqual('object');
        }
    })


    test('Fetch Year Chart Data', async () => {
        const response = await request(app)
            .get('/profile/year/2023')
            .set('x-access-token', `${token}`);

        shouldHaveData(response);
    })


    test('Fetch Month Chart Data', async () => {
        const response = await request(app)
            .get('/profile/month/Jan/2023')
            .set('x-access-token', `${token}`);

        shouldHaveData(response);
    })


    // Testing Empty Data from Analytics

    test('Must not Get Year Chart Data for year beyond 2019', async () => {
        const response = await request(app)
            .get('/profile/year/2018')
            .set('x-access-token', `${token}`);

        shouldNotHaveData(response);
    })


    test('Must not Get Month Chart Data for year beyond 2019', async () => {
        const response = await request(app)
            .get('/profile/month/Jan/2018')
            .set('x-access-token', `${token}`);

        shouldNotHaveData(response);
    })
})