const mongoose = require('mongoose');
const connection = require('./../utill/database');

const members = new mongoose.Schema({

    name: {
        type: String
    },
    login_ID: {
        type: String,
        required: true
    },
    github_ID: {
        type: String,
        required: true
    },
    contact: [
        { email: String},
        { twitter: String},
        { website: String}
    ],
    restriction: String,
    profile_img: String,
    cover_img: String,
    about: String,
    location: String
});

const Members = connection.model('Members', members);

module.exports = Members;