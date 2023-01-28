const { default: mongoose, Mongoose } = require('mongoose');

module.exports = {
    mutipleMongooseToObject: function (mongoosesArray) {
        return mongoosesArray.map((mongoose) => mongoose.toObject());
    },
    mongooseToObject: function (mongoose) {
        return mongoose ? mongoose.toObject() : mongoose;
    },
};
