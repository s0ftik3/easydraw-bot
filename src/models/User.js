const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    first_name: String,
    last_name: String,
    username: String,
    language: String,
    type: {
        type: String,
        required: false,
        default: 'user'
    },
    beta: {
        type: Boolean,
        required: false,
        default: true
    },
    mode: {
        type: Number,
        required: false,
        default: 0
    },
    processed: {
        type: Number,
        required: false,
        default: 0
    },
    agreement: {
        type: Boolean,
        required: false,
        default: null
    },
    files: {
        type: Array,
        required: false,
        default: []
    },
    timestamp: {
        type: Date,
        required: false,
        default: new Date()
    }
});

module.exports = mongoose.model('User', userSchema);