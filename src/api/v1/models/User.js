const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /.+\@.+\..+/
    },
    phone: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                return /^\+?[1-9]\d{1,14}$/.test(value);
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    phoneCountry: {
        type: String,
        required: true,
        enum: ['FR', 'MA']
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    userType: {
        type: String,
        required: true,
        enum: ['orderGiver', 'devTeam']
    },
    industrySector: {
        type: String,
        required: false,
    },
    refreshToken: {
        type: String,
        required: false,
    }
});

module.exports = mongoose.model('User', userSchema);
