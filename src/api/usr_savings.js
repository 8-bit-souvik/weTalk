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


router.get('/show', verify, function (req, res) {

    var person_detail = (data) => {
        //  console.log(data);

        var temp;

        query_field = []

        data.forEach((item, index) => {
            query_field.push(data[index].login_ID)
        })


        members
            .find({
                'login_ID': {
                    $in: query_field
                }
            })
            .select('name , github_ID , profile_img , login_ID')
            .exec(temp = (err, author_data) => {

                newlist = []

                // console.log(data.length);

                var i = 0;

                data.forEach((item, index) => {

                    var flag = 0;

                    while (item.login_ID != author_data[i].login_ID) {
                        i++;
                        
                        if (author_data[i] == undefined) {
                            i = 0;
                            flag++
                        }

                        if (flag > 1) {
                            return;
                        }
                    }


                    var liked = null
                    if (req.headers.member_data) {
                        liked = item.like.includes(req.headers.member_data[0].login_ID)
                        /// I don't know why in case of postman's request member_data is showing undefined
                    }


                    newlist[index] = {
                        post_id: item.post_id,
                        login_ID: item.login_ID,
                        sequence: item.sequence,
                        time: item.time,
                        content: item.content,
                        media: item.media,
                        like: item.like.length,
                        comment: item.comment.length,
                        liked: liked,
                        author_name: author_data[i].name,
                        author_github_ID: author_data[i].github_ID,
                        author_profile_img: author_data[i].profile_img
                    }


                });
                // console.log(newlist);


                return res.send({ "data": newlist })

            });

    }


    activities
        .find({
            'login_ID': {
                $in: login_ID
            }
        })
        .select('saved')
        .exec(temp = (err, data) => {

            // console.log(data[0].like);
            // console.log(data[0].like.includes(req.headers.member_data[0].login_ID))

            if (data[0].saved) {

                // if (data[0].saved.includes(req.headers.member_data[0].login_ID)) {
                //     return unsave(post_id)
                // } else {
                //     return save(post_id)
                // }

                news_feed
                    .find({
                        'post_id': {
                            $in: data[0].saved
                        }
                    })
                    // .select('sequence , content , media , login_ID')
                    .exec(temp = (err, posted_data) => {
                        if (posted_data[0]) {
                            person_detail(data);
                        } else {
                            res.send({ "msg": "no more data available" })
                        }
                    })
            } else {
                return res.status(403).send({ msg: "invalid request" });
            }

        });
})


router.post('/save', verify, function (req, res) {
    // if (req.headers.verified) {
    //     res.status(200).send({ msg: "server is working! you are verified!" })
    // } else {
    //     res.status(404).send({ msg: "server is working! But you are not verified" })
    // }


    if (req.headers.verified) {

        // console.log(req.body.post_id);
        var post_id = req.body.post_id;

        if (post_id) {
            var save = (pid) => {
                activities.updateOne(

                    { login_ID: req.headers.member_data[0].login_ID },
                    { $push: { saved: pid } }
                )
                    .then((data) => {
                        // console.log(data);
                        return res.status(200).send({ msg: "saved" });
                    })
                    .catch((err) => {
                        return console.log(err);
                    });
            }


            var unsave = (pid) => {
                activities.updateOne(

                    { login_ID: req.headers.member_data[0].login_ID },
                    { $pullAll: { saved: pid } }
                )
                    .then((data) => {
                        // console.log(data);
                        return res.status(200).send({ msg: "unsaved" });
                    })
                    .catch((err) => {
                        return console.log(err);
                    });
            }

            activities
                .find({
                    'login_ID': {
                        $in: login_ID
                    }
                })
                .select('saved')
                .exec(temp = (err, data) => {

                    // console.log(data[0].like);
                    // console.log(data[0].like.includes(req.headers.member_data[0].login_ID))

                    if (data[0].saved) {

                        if (data[0].saved.includes(req.headers.member_data[0].login_ID)) {
                            return unsave(post_id)
                        } else {
                            return save(post_id)
                        }
                    } else {
                        return res.status(403).send({ msg: "invalid request" });
                    }

                });

        } else {
            return res.status(403).send({ msg: "invalid request" });
        }

    } else {
        return res.status(401).send("authentication error")
    }

})




module.exports = router;