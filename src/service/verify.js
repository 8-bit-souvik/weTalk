const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const express = require('express');
const Members = require("./database/models/members");
const Activity = require("./database/models/activities");

const app = express();
app.use(cookieParser());


const passphrase = process.env.passphrase
const JWT_token = process.env.JWT_token




const AES = require('crypto-js/aes');
const Utf8 = require('crypto-js/enc-utf8');

const decryptWithAES = (ciphertext, passphrase) => {
    const bytes = AES.decrypt(ciphertext, passphrase);
    const originalText = bytes.toString(Utf8);
    return originalText;
};



function verifyLogin(req, res, next) {

    // req.headers.member_data[0].github_ID = "https://wetalk021.herokuapp.com/login";
    // req.headers.member_data[0].profile_img = null;
    // req.headers.member_data[0].name = null;

    req.headers.member_data = [{
        github_ID: 'https://wetalk021.herokuapp.com/login',
        profile_img: null,
        name: null
    }]

    console.log(req.headers.member_data);

    const { cookies } = req;
    const bearerHeader = cookies.authorization;

    // Check if bearer is undefined
    if (typeof bearerHeader != 'undefined') {
        const bearer = bearerHeader.split(' ');
        const decryptedcookie = decryptWithAES(bearer[1], passphrase);


        jwt.verify(decryptedcookie, JWT_token, (err, authData) => {


            if (err) {
                next();
            } else {
                Members.find({ login_ID: authData.user.login_ID })
                    .then((member_data) => {
                        if (member_data[0]) {
                            Activity.find({ login_ID: authData.user.login_ID })
                                .then((activity_data) => {
                                    if (activity_data[0]) {
                                        req.headers.verified = true;
                                        req.headers.member_data = member_data;

                                        if (req.headers.member_data[0].restriction == "none") {
                                            return next();
                                        } else if (req.headers.member_data[0].restriction == "full") {
                                            return res.send("<br><br><h2 style='text-align: center; color: red'>You are restricted!</h2>");
                                        } else {
                                            return res.send("<br><br><h2 style='text-align: center;'>contact with developer</h2>");
                                        }

                                    } else {
                                        return next();
                                    }
                                })
                        } else {
                            return next();
                        }

                    })
            }
        });

    } else {
        return next();
    }
}


module.exports = verifyLogin;