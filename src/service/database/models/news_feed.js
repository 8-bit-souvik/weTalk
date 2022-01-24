const { type } = require('express/lib/response');
const mongoose = require('mongoose');
const connection = require('./../utill/database');

const news_feed = new mongoose.Schema({

    post_id: { type: String, required: true, unique: true },
    login_ID: { type: mongoose.Schema.Types.String, required: true, ref: 'members' },
    sequence: { type: Number },
    time: { type: String },
    content: { type: String },
    media: {url:{ type: String }, id:{ type: String }},
    like: [],
    comment: [{ comment_id: { type: String }, author: { type: String }, data: { type: String }, time: { type: Number }, likes: [{ type: String }] }]
});




const News_feed = connection.model('News_feeds', news_feed);

module.exports = News_feed;