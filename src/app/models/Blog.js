const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
    name: { type: String },
    gender: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    phone_number: { type: String },
    gymnasium_id: { type: String },
    exercises_id: { type: String },
});

module.exports = mongoose.model('user', User);
