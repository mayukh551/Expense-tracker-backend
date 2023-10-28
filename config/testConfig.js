const loginCreds = {
    email: 'mactavish171@gmail.com',
    password: '123456',
    invalidEmail: 'notRegisteredEmail@gmail.com',
    invalidPassowrd: 'IncorrectPassword123'
};


const testsOrder = [
    'app.test.js',
    'auth.test.js',
    'crud.test.js',
    'analytics.test.js',
    // 'account.test.js',
    'empty-token.test.js',
];

module.exports = {
    testsOrder,
    loginCreds
};