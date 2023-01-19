const stringTypeFields = {
    type: String,
    minLength: 6,
    maxLength: 40,
    trim: true
}

const output = {
    ...stringTypeFields,
    minLength: 1,
    required: true
}

console.log(output);