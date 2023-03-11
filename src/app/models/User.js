const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');

mongoose.plugin(slug);

const User = new Schema({
    name: { type: String },
    birthday: { type: Date, required: true },
    gender: { type: String, required: true },
    height: { type: String, required: true },
    weight: { type: String, required: true },
    role: { type: Number },
    address: { type: String },
    email: { type: String, unique: true, required: true },
    phone_number: { type: String },
    image: { type: String },
    fb_link: { type: String },
    insta_link: { type: String },
    yt_link: { type: String },
    exercises_id: { type: String },
    gymnasium_id: { type: String },
    password: { type: String },
    authentication: { type: String },
});

module.exports = mongoose.model('user', User);
