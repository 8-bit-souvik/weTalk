const express = require('express');
const router = express.Router();
var ImageKit = require("imagekit");
const verify = require('./../../service/verify')
const activities = require('./../../service/database/models/activities')
var fs = require('fs');

const publicKey = process.env.publicKey;
const privateKey = process.env.privateKey;
const urlEndpoint = process.env.urlEndpoint;
var imagekit = new ImageKit({
    publicKey: publicKey,
    privateKey: privateKey,
    urlEndpoint: urlEndpoint
});


router.get('/redirect', verify, (req, res) => {

    if (req.headers.verified) {

        activities
            .find({
                'login_ID': {
                    $in: req.headers.member_data[0].login_ID
                }
            })
            .select('limit')
            .exec(temp = (err, data) => {

                if (Date.now() - data[0].limit.initial_time_stamp > 43200000) {

                    activities.updateOne(

                        { login_ID: req.headers.member_data[0].login_ID },
                        { limit: { initial_time_stamp: Date.now(), post_count: 1, media_auth: 1 } }
                    )
                        .then((data) => {
                            return sendSignature();
                        })
                        .catch((err) => {
                            console.log(err);
                        });

                } else if (data[0].limit.media_auth < 5) {
                    activities.updateOne(

                        { login_ID: req.headers.member_data[0].login_ID },
                        { $set: { "limit.media_auth": data[0].limit.media_auth + 1 } }
                    )
                        .then((data) => {
                            return sendSignature();
                        })
                        .catch((err) => {
                            return console.log(err);
                        });
                } else {

                    var time_remains = 43200 - ((Date.now() - data[0].limit.initial_time_stamp) / 1000)
                    var time_remains_hrs = Math.floor(time_remains / 3600)
                    var time_remains_min = Math.floor((time_remains % 3600) / 60)
                    var time_remains_sec = Math.floor((time_remains % 3600) % 60)

                    return res.status(403).send({ msg: "maximum limit per 12hr exceeded (5). " + `remaining time ${time_remains_hrs}:${time_remains_min}:${time_remains_sec}` });

                }
            })


        function sendSignature(params) {
            var authenticationParameters = imagekit.getAuthenticationParameters();
            // console.log(authenticationParameters);
            res.send(authenticationParameters);
        }




    }
    else {
        return res.status(401).send({ msg: "authentication error" })
    }
})



module.exports = router;