var arr = [1, 2, 3, 4];
var b = arr;
b[1] = 11;
console.log(arr);



// var user = {
//     _id: '1',
//     expenses: [
//         {
//             _id: 'a',
//             amount: 123
//         },
//         {
//             _id: 'b',
//             amount: 361
//         },
//     ],
// }

// var expenses = user.expenses;
// var id = 'b'
// for (var i = 0; i < expenses.length; i++) {
//     if (expenses[i]._id === id) {
//         const _id = expenses[i]._id;
//         expenses[i] = {
//             _id,
//             amount: 500
//         }
//         break;
//     }
// }

// // user.expenses = expenses;
// console.log(user);