const mongoose = require('mongoose');
const { Schema } = mongoose;

const CardSchema = new Schema({
    cardname: { type: String, required: true },
    uid: { type: String, required: true },
    name: {type: String, required: false },
    description: {type: String, required: false} ,
    is_private: { type: Boolean, required: true },
    date: { type: Number, required: true }
});

module.exports = mongoose.model('Card', CardSchema, 'cards');