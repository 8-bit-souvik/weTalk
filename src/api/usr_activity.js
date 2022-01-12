const express = require('express');
const req = require('express/lib/request');
const router = express.Router();
const uuid = require('uuid')

const verify = require('./../service/verify')
const activities = require('./../service/database/models/activities')
const news_feed = require('./../service/database/models/news_feed')
const members = require('./../service/database/models/members')

const app = express()

const { urlencoded } = require('express');
app.use(express.json());
app.use(urlencoded({ extended: false }));


router.post('/create', verify, function (req, res) {

    if (req.headers.verified) {

        var content = req.body.content;              //content of the body

        // console.log(`usr_id: ${(req.headers.member_data[0].login_ID)}`);

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
                        { limit: { initial_time_stamp: Date.now(), post_count: 1 } }
                    )
                        .then((data) => {
                            return createPost();
                        })
                        .catch((err) => {
                            console.log(err);
                        });

                } else if (data[0].limit.post_count < 5) {
                    activities.updateOne(

                        { login_ID: req.headers.member_data[0].login_ID },
                        { $set: { "limit.post_count": data[0].limit.post_count + 1 } }
                    )
                        .then((data) => {
                            return createPost();
                        })
                        .catch((err) => {
                            return console.log(err);
                        });
                } else {

                    var time_remains = 43200 - ((Date.now() - data[0].limit.initial_time_stamp) / 1000)
                    var time_remains_hrs = Math.floor(time_remains / 3600)
                    var time_remains_min = Math.floor((time_remains % 3600) / 60)
                    var time_remains_sec = Math.floor((time_remains % 3600) % 60)

                    return res.status(403).send({ msg: "maximum post limit per 12hr exceeded (5). " + `remaining time ${time_remains_hrs}:${time_remains_min}:${time_remains_sec}` });

                }
            })


        var createPost = () => {

            if (content.length > 1501) {
                res.status(400).send({ msg: `word limit exeeded! (${content.length}/1500)` });
            } else if (content.length < 1) {
                res.status(400).send({ msg: `too short to post! (${content.length}/1500)` });
            } else {
                var post = { post_id: uuid.v4(), login_ID: req.headers.member_data[0].login_ID, sequence: Date.now(), time: Date(), content: content, media: "", like: [], comment: [] };
                // console.log(post);

                activities.updateOne(

                    { login_ID: req.headers.member_data[0].login_ID },
                    { $push: { posts: post.post_id } }
                )
                    .then((data) => {
                        // console.log(data);
                    })
                    .catch((err) => {
                       return console.log(err);
                    });




                news_feed.create(post)

                    .then((data) => {
                        // console.log(data);
                    })
                    .catch((err) => {
                       return console.log(err);
                    })

                return res.status(200).send({ msg: "posted successfully!" });

            }

        }

    }
    else {
        return res.status(401).send({ msg: "authentication error" })
    }

})


router.get('/show', verify, function (req, res) {
    // if (req.headers.verified) {

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


                    return res.send({ "data": newlist, "sequence": data[data.length - 1].sequence, my_ID: req.headers.member_data[0].login_ID })

                });

        }


        var get_news = () => {
            news_feed.find().sort({ sequence: -1 }).limit(10)
                .then((data) => {

                    if (data[0]) {
                        person_detail(data);
                    } else {
                        res.send({ "msg": "no more data available" })
                    }

                    return 0

                })
                .catch((err) => {
                    console.log(err);
                })
        }

        var get_sequential_news = (count) => {
            news_feed.find({ sequence: { "$lt": count } }).sort({ sequence: -1 }).limit(10)
                .then((data) => {

                    if (data[0]) {
                        person_detail(data);
                    } else {
                        res.send({ "msg": "no more data available" })
                    }


                    return 0

                })
                .catch((err) => {
                    console.log(err);
                })
        }

        if (req.headers.sequence && req.headers.sequence != 0) {
            get_sequential_news(req.headers.sequence)
        } else {
            get_news()
        }

    // }
    // else {
    //     return res.status(401).send({ msg: "authentication error" })
    // }
})


router.post('/comment', verify, (req, res) => {
    if (req.headers.verified) {
        // console.log(req.body)

        let comment_id = uuid.v4()

        activities.updateOne(

            { login_ID: req.headers.member_data[0].login_ID },
            { $push: { comment: { post_id: req.body.target, comment_id: comment_id } } }
        )
            .then((data) => {
                // console.log(data);

            })
            .catch((err) => {
                console.log(err);
            });

        news_feed.updateOne(

            { post_id: req.body.target },
            { $push: { comment: { comment_id: comment_id, author: req.headers.member_data[0].login_ID, data: req.body.comment, time: Date.now(), likes: [] } } }
        )
            .then((data) => {
                // console.log(data);

            })
            .catch((err) => {
                console.log(err);
            });

        comment_id = undefined



        return res.send({ data: req.body, author: req.headers.member_data[0].name })
    } else {
        return res.status(401).send("authentication error")
    }

})


router.get('/showcomments', verify, (req, res) => {

    if (req.headers.verified) {

        var prepareData = (data) => {

            query_field = []

            data.forEach((item, index) => {
                query_field.push(data[index].author)
            });


            members
                .find({
                    'login_ID': {
                        $in: query_field
                    }
                })
                .select('name , github_ID , profile_img , login_ID')
                .exec(temp = (err, author_data) => {
                    // console.log(author_data);

                    newlist = []
                    data.forEach((item, index) => {

                        var i = 0;
                        while (item.author != author_data[i].login_ID) {
                            i++;
                        }

                        var isliked = null
                        if (req.headers.member_data) {
                            isliked = item.likes.includes(req.headers.member_data[0].login_ID)
                            /// I don't know why in case of postman's request member_data is showing undefined
                        }

                        newlist[index] = {
                            comment_id: item.comment_id,
                            author_login_id: item.author,
                            author_name: author_data[i].name,
                            author_github_ID: author_data[i].github_ID,
                            author_profile_img: author_data[i].profile_img,
                            content: item.data,
                            time: item.time,
                            likes: item.likes,
                            isliked: false
                        }
                    });
                    // console.log(newlist);


                    return res.send({ "my_ID": req.headers.member_data[0].login_ID, "data": newlist })

                });
        }


        news_feed
            .find({
                'post_id': {
                    $in: req.headers.post_id
                }
            })
            .select('comment')
            .exec(temp = (err, comments) => {
                console.log("post ID :-");
                console.log(req.headers.post_id);
                console.log("comments : -");
                console.log(comments);
                if (comments[0]) {
                    return prepareData(comments[0].comment);
                    // return res.send(comments[0].comment);
                } else {
                    // console.log(comments);
                    return res.status(404).send({ msg: "no data found" });
                }


            })

    } else {
        return res.status(401).send("authentication error")
    }
})


router.put('/like', verify, function (req, res) {


    if (req.headers.verified) {

        // console.log(req.body.post_id);
        var post_id = req.body.post_id;

        if (post_id) {
            var like = (pid, count) => {
                news_feed.updateOne(

                    { post_id: pid },
                    { $push: { like: req.headers.member_data[0].login_ID } }
                )
                    .then((data) => {
                        // console.log(data);
                        return res.status(200).send({ count: count + 1 });
                    })
                    .catch((err) => {
                        return console.log(err);
                    });
            }


            var unlike = (pid, count) => {
                news_feed.updateOne(

                    { post_id: pid },
                    { $pullAll: { like: [req.headers.member_data[0].login_ID] } }
                )
                    .then((data) => {
                        // console.log(data);
                        return res.status(200).send({ count: count - 1 });
                    })
                    .catch((err) => {
                        return console.log(err);
                    });
            }

            news_feed
                .find({
                    'post_id': {
                        $in: post_id
                    }
                })
                .select('like')
                .exec(temp = (err, data) => {

                    // console.log(data[0].like);
                    // console.log(data[0].like.includes(req.headers.member_data[0].login_ID))

                    if (data[0]) {

                        if (data[0].like.includes(req.headers.member_data[0].login_ID)) {
                            return unlike(post_id, data[0].like.length)
                        } else {
                            return like(post_id, data[0].like.length)
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


router.delete('/delete_post', verify, function (req, res) {

    if (req.headers.verified) {

        post_id = req.headers.post_id

        if (post_id) {

            news_feed
                .find({
                    'post_id': {
                        $in: req.headers.post_id
                    }
                })
                .select('login_ID')
                .exec(temp = (err, user) => {

                    if (user[0]) {
                        if (user[0].login_ID == req.headers.member_data[0].login_ID) {

                            news_feed.deleteOne({ post_id: req.headers.post_id }, function (err) {
                                if (err) {
                                    return console.log(err)
                                } else {
                                    return res.status(200).send({ msg: "post deleted" })
                                };

                            });

                        } else {
                            return res.status(401).send({ msg: "author is not you, only author can delete this post" })
                        }
                    } else {
                        return res.status(404).send({ msg: "no post found" })
                    }
                })

        } else {

            return res.status(403).send({ msg: "invalid data" })
        }

    } else {
        return res.status(401).send("authentication error")
    }
})


router.delete('/delete_comment', verify, function (req, res) {

    if (req.headers.verified) {

        post_id = req.headers.post_id
        comment_id = req.headers.comment_id

        if (post_id && comment_id) {

            news_feed
                .find({
                    'post_id': {
                        $in: req.headers.post_id
                    }
                })
                .select('comment')
                .exec(temp = (err, data) => {

                    if (data[0]) {

                        if (data[0].comment.filter((x) => x.comment_id == comment_id)[0]) {
                            if (data[0].comment.filter((x) => x.comment_id == comment_id)[0].author == req.headers.member_data[0].login_ID) {
                                news_feed.updateOne(
                                    { 'post_id': post_id },
                                    { $pull: { comment: { comment_id: comment_id } } }
                                )
                                    .then((data) => {
                                        return res.status(200).send({ msg: "comment deleted" })
                                    });
                            } else {
                                return res.status(401).send({ msg: "author is not you, only author can delete this comment" })
                            }
                        } else {
                            return res.status(404).send({ msg: "comment not found" })
                        }


                    } else {
                        return res.status(404).send({ msg: "no post found" })
                    }
                })

        } else {

            return res.status(403).send({ msg: "invalid data" })
        }

    } else {
        return res.status(401).send("authentication error")
    }
})


module.exports = router;