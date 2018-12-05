const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    email: {type: String, required: true},
    username: {type: String, required: false},
    password: {type: String, required: false},
    enabled: { type: Boolean, required: true },
    cards: { type: Array, required: false},
    date: {type: Number, required: true},
});

module.exports = mongoose.model('User', UserSchema, 'users');