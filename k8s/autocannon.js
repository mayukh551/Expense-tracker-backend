'use strict'

const autocannon = require('autocannon');

// async/await
async function foo() {
    const result = await autocannon({
        url: 'http://localhost:32503/',
        connections: 10, //default
        pipelining: 1, // default
        duration: 300 // default
    })
    console.log(result)
}

foo();