const Members = require("./database/models/members");
const Activity = require("./database/models/activities");
const res = require("express/lib/response");




function use_private(data) {
    return new Promise((resolve, reject) => {
        github_id = data.id;
        Members.find({ login_ID: github_id })
            .then((member_data) => {
                if (member_data[0]) {
                } else {
                    // console.log(`-----------name: ${data.name}`);
                    if (data.name && data.name != null) {
                        Members.create({
                            name: data.name,
                            login_ID: data.id,
                            github_ID: data.login,
                            contact: [
                                { email: data.email },
                                { twitter: data.twitter_username }
                            ],
                            restriction: "none",
                            profile_img: data.avatar_url,
                            cover_img: "",
                            about: "",
                            location: data.location
                        })
                            .catch((err) => {
                                reject({ msg: err })
                            });
                    } else {
                        return reject({ issue: "invalid_name" })
                    }

                }

                Activity.find({ login_ID: github_id })
                    .then((activity_data) => {

                        if (activity_data[0]) {
                            // console.log("\nactivities data exists------------------\n");
                        } else {
                            // console.log("new activity collection created-----------------");
                            if (data.name && data.name != null) {
                                return Activity.create({
                                    name: data.name,
                                    login_ID: data.id,
                                    github_ID: data.login,
                                    posts: [],
                                    liked: [],
                                    commented: [],
                                    limit: { initial_time_stamp: 0, post_count: 0 }
                                })
                                    .catch((err) => {
                                        reject({ msg: err })
                                    });
                            } else {
                                return reject({ issue: "invalid_name" })
                            }

                        }
                    });

            })
            .then(() => {
                resolve({ msg: "verified" })
            })
            .catch((err) => {
                console.log(err);
                if (err) {
                    reject(err)
                }
            });



    })
}





module.exports = use_private;