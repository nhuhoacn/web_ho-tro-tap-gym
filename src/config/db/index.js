const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

async function connect() {
    try {
        await mongoose.connect('mongodb://127.0.0.1/f8_education_dev');
        console.log('connect successfully!!!');
    } catch (error) {
        console.log('connect failure!!!');
    }
}

module.exports = { connect };
