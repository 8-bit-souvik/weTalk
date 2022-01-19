const { type } = require('express/lib/response');
const mongoose = require('mongoose');
const connection = require('./../utill/database');
const marked = require('marked')
const slugify = require('slugify')
const createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom')
const dompurify = createDomPurify(new JSDOM().window)

const news_feed = new mongoose.Schema({

    post_id: { type: String, required: true, unique: true },
    login_ID: { type: mongoose.Schema.Types.String, required: true, ref: 'members' },
    sequence: { type: Number },
    time: { type: String },
    content: { type: String },
    media: { type: String },
    like: [],
    comment: []
});

news_feed.pre('validate', function (next) {
    // if (this.title) {
    //     this.slug = slugify(this.title, { lower: true, strict: true })
    // }

    if (this.content) {
        this.content = this.content.replace('<', '&lt;')
        this.content = this.content.replace('>', '&gt;')
        this.content = dompurify.sanitize(marked(this.content))

    }

    next()
})


const News_feed = connection.model('News_feeds', news_feed);

module.exports = News_feed;