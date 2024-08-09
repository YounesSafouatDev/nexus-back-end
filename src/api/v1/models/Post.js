const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
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
        enum: ['FR', 'MA'],
    },
    keywords: {
        type: [String],
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    postType: {
        type: String,
        required: true,
        enum: ['orderGiver', 'devTeam']
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
