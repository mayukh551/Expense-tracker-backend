const res = require("dotenv").config({path: '../.env'});
console.log(res);
const d = process.env.PRIVATE_KEY;
console.log(d);
// const jwt = require('jsonwebtoken');

// console.dir(jwt.sign({
//     a: 1, b: 2
// }, 'asdfasdf', {
//     expiresIn: "7d"
// }));


// async function work(cond) {
//     if (cond)
//         console.log('yep');
//     else
//         throw new Error('hi there!');
// }


// work(false)
//     .then(() => console.log('all good'))
//     .catch((err) => console.log('Blimey!', err.message))



// var fruits = ["Banana", "Orange", "Lemon", "Apple", "Mango"];
// // fruits = fruits.slice(1);
// fruits.splice(0, 1);
// // console.log(citrus, fruits);
// console.log(fruits);