const mongoose = require('mongoose');
const { Schema } = mongoose;

const CardSchema = new Schema({
    cardname: { type: String, required: true },
    uid: { type: String, required: true },
    name: {type: String, required: false },
    description: {type: String, required: false} ,
    is_private: { type: Boolean, required: true },
    contacts: { type: Object, required: false},
    pictures: { type: Array, required: false},
    date: { type: Number, required: true },

    oldid: {type: String, required: false},
    updated: { type: Number, required: false},
    friends_updated: {type: Number, required: false},
    notifications_updated: {type: Number, required: false},


    //remove this
    cardholder: { type: Object, required: false},
    c_updated: { type: Number, required: false},
    notifications: { type: Array, required: false},
    n_updated: { type: Number, required: false},
});

module.exports = mongoose.model('Card', CardSchema, 'cards');