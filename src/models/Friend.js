const mongoose = require('mongoose');
const { Schema } = mongoose;

const FriendSchema = new Schema({
    cardname: { type: String, required: true },
    friend_cardname: { type: String, required: true },
    enabled: { type: Boolean, required: true },
    deleted: { type: Boolean, required: false },
    private_enabled: { type: Boolean, required: false },
    updated: { type: Number, required: false },
    date: { type: Number, required: true },
});

module.exports = mongoose.model('Friend', FriendSchema, 'friends');