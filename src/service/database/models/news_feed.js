const { type } = require('express/lib/response');
const mongoose = require('mongoose');
const connection = require('./../utill/database');

const news_feed = new mongoose.Schema({

    post_id: { type: String },
    login_ID: {type: mongoose.Schema.Types.String, ref: 'members'},
    sequence: {type:Number},
    time: { type: String },
    content: { type: String },
    media: { type: String },
    like: [],
    comment: []
});

const News_feed = connection.model('News_feeds', news_feed);

module.exports = News_feed;