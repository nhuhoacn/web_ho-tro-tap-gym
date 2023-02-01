const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');

mongoose.plugin(slug);

const Student = new Schema({
    name: { type: String },
    birthday: { type: String, required: true },
    gender: { type: String, required: true },
    height: { type: String, required: true },
    weight: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    phone_number: { type: String },
    gymnasium_id: { type: String },
    exercises_id: { type: String },
});

module.exports = mongoose.model('Student', Student);
