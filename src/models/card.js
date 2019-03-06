const mongoose = require('mongoose');
const { Schema } = mongoose;

const CardSchema = new Schema({
    cardname: { type: String, required: true },
    uid: { type: String, required: true },
    name: {type: String, required: false },
    description: {type: String, required: false} ,
    is_private: { type: Boolean, required: true },
    date: { type: Number, required: true },
    updated: { type: Number, required: false},
    contacts: { type: Object, required: false},
    pictures: { type: Array, required: false},

    cardholder: { type: Object, required: false},
    c_updated: { type: Number, required: false},

    keepers: { type: Object, required: false},
    k_updated: { type: Number, required: false},

    notifications: { type: Array, required: false},
    n_updated: { type: Number, required: false},
    oldid: {type: String, required: false},
});

module.exports = mongoose.model('Card', CardSchema, 'cards');