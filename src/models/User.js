const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    email: {type: String, required: true},
    username: {type: String, required: false},
    password: {type: String, required: false},
    enabled: { type: Boolean, required: true },
    cards: { type: Array, required: false},
    date: {type: Number, required: true},
    updated: {type: Number, required: false},
    search: {type: Array, required: false},
    search_updated: {type: Number, required: false},
    auth: {type: String, required: false},
    auth_method: {type: String, required: false},
    oldid: {type: String, required: false},
});

module.exports = mongoose.model('User', UserSchema, 'users');