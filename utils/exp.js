cond = process.argv[2];

if (cond == 'true') {
    console.log('Hello');
}

else {
    console.log('Bye');
}

if(typeof cond == 'string'){
    console.log('String');
}