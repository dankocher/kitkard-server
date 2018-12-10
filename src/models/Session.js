const mongoose = require('mongoose');
const { Schema } = mongoose;

const SessionSchema = new Schema({
    _id: {type: String, required: true},
    expires: {type: Date, required: true},
    session: {type: String, required: true}
});

module.exports = mongoose.model('Session', SessionSchema, 'sessions');