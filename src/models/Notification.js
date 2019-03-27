const mongoose = require('mongoose');
const { Schema } = mongoose;

const NotificationSchema = new Schema({
    type: { type: String, required: true },
    cardname: { type: String, required: true },
    from_cardname: { type: String, required: true },
    viewed: { type: Boolean, required: false },
    action: { type: String, required: false },
    shared_cardname: { type: String, required: false },
    hidden: { type: Boolean, required: false },
    date: { type: Number, required: true },
    updated: { type: Number, required: true },
});

module.exports = mongoose.model('Notification', NotificationSchema, 'notifications');