const mongoose = require('mongoose')
const  uniqid = require('uniqid');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    usage:{
        type: Number,
        required: true,
        default: 0
    }
})

module.exports = mongoose.model('user', userSchema)