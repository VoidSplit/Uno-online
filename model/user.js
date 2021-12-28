const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
    username: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    wins: {
        type: Number
    },
    loses: {
        type: Number
    }
});

module.exports = {
    User: model('User', UserSchema)
}
