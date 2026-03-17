const mongoose = require('mongoose')

const validateNumber = (number) => {
    const regex = /^\d{2,3}-\d+$/
    return regex.test(number) && number.length >= 8
}

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3
    },
    number: {
        type: String,
        required: true,
        validate: {
            validator: validateNumber,
            message: props => `${props.value} is not a valid phone number! Use format: XX-XXXXXX or XXX-XXXXX with at least 8 digits total.`
        }
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)
