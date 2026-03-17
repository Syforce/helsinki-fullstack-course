const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 3
    },
    name: String,
    passwordHash: String,
})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passwordHash
    }
})

userSchema.virtual('blogs', {
    ref: 'Blog',
    foreignField: 'user',
    localField: '_id'
})

module.exports = mongoose.model('User', userSchema)
