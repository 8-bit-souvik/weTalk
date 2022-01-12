const { type } = require('express/lib/response');
const mongoose = require('mongoose');
const connection = require('./../utill/database');

const activities = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    login_ID: {
        type: String,
        required: true
    },
    github_ID: {
        type: String,
        required: true
    },
    posts: [{ type: mongoose.Schema.Types.String, ref: 'news_feed' }],
    liked: [],
    comment: [],
    limit: { initial_time_stamp: {}, post_count: {} },
    last_access: { type: String }
});

const Activities = connection.model('Activities', activities);

module.exports = Activities;