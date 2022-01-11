const express = require('express');
const router = express.Router();
const app = express()

const verify = require('./../service/verify')
const activities = require('./../service/database/models/activities')
const news_feed = require('./../service/database/models/news_feed')
const members = require('./../service/database/models/members')

const { urlencoded } = require('express');
app.use(express.json());
app.use(urlencoded({ extended: false }));



router.get('/', verify, function (req, res) {
    if (req.headers.verified) {
        res.status(200).send({ msg: "server is working! you are verified!" })
    } else {
        res.status(404).send({ msg: "server is working! But you are not verified" })
    }
})




module.exports = router;