const express = require('express');
const router = express.Router();
const usr_sign = require('./../../service/usr_sign')
const AES = require('crypto-js/aes');
const jwt = require('jsonwebtoken');

// require("dotenv").config({ path: `${__dirname}/../../../.env` });

// const passphrase = process.env.passphrase
// const JWT_token = process.env.JWT_token
// const clientID = process.env.clientID
// const clientSecret = process.env.clientSecret

const passphrase = '94cr378923er7ferywsz9i1213a1w2v'
const JWT_token = '8rymk45y4w304u8p59q7wr6zcv2jh87'
const clientID = 'ab5a6c0de98d1acb22f8'
const clientSecret = '54067a399d1fc3971ea0fb251099729e392d5598'


const encryptWithAES = (text, passphrase) => {
  return AES.encrypt(text, passphrase).toString();
};

const axios = require('axios')
var access_token = ''

router.get('/redirect', (req, res) => {

    // The req.query object has the query params that were sent to this route.
    requestToken = req.query.code ? req.query.code : requestToken
    axios({
        method: 'post',
        url: `https://github.com/login/oauth/access_token?client_id=${clientID}&client_secret=${clientSecret}&code=${requestToken}`,
        // Set the content type header, so that we get the response in JSON
        headers: {
            accept: 'application/json'
        }
    }).then((response) => {
        access_token = response.data.access_token ? response.data.access_token : access_token


        if (access_token) {
            axios({
                method: 'get',
                url: `https://api.github.com/user`,
                headers: {
                    Authorization: 'token ' + access_token
                }
            }).then((response) => {
                const data = response.data
                usr_sign(data)
                    .then((msg) => {
                        // console.log(msg);
                        // console.log(response.status);

                        const user = {
                            login_ID: data.id,
                        }

                        jwt.sign({ user }, JWT_token, { expiresIn: 2*24*60*60 }, (err, token) => {


                            if (err) {
                                res.json({ err });
                            }
                            // console.log( "\n originalcookie : " + token );
                            // console.log( token );
                            const encryptedcookie = encryptWithAES(token, passphrase);
                            // console.log( "\n\n encryptedcookie : " + encryptedcookie );

                            res.cookie('authorization', `bearer ${encryptedcookie}`);
                            res.redirect('/home');
                        });

                    })
                    .catch((err) => {
                        if (err.issue = 'invalid_name') {
                            res.status(403).send("<br><br><div style='text-align: center'><h2>before you sign in atleast you need to set up your name in your github account</h2> <a href='https://github.com/settings/profile'>click here to set it up</a></div>" )
                        } else {
                            return console.log(err);
                        }
                    });

            })
        } else {
            return res.send("<br><br><h2 style='text-align: center'> 401 || Access token not found </h2>")
        }
    })

});





module.exports = router;
