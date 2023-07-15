'use strict'

const autocannon = require('autocannon');

// async/await
async function foo() {
    const result = await autocannon({
        // url: 'http://localhost:31980/',
        url: 'http://34.100.191.95:5000/',
        connections: 10, //default
        pipelining: 1, // default
        duration: 300 // default
    })
    console.log(result)
}

foo();