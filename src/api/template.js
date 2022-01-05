const express = require('express');
const router = express.Router();
const axios = require('axios');

const verify = require('./../service/verify')

// require("dotenv").config({ path: `${__dirname}/../../.env` });
// const clientID = process.env.clientID

const clientID = 'ab5a6c0de98d1acb22f8'


router.get('/', verify, function (req, res) {
    if (req.headers.verified) {
        return res.render('pages/home', { client_id: clientID });
         
    } else {
        return res.render('pages/index', { client_id: clientID });
    }
});


router.get('/home', verify, function (req, res) {
    // console.log(req.headers.member_data);
    if (req.headers.verified) {
        return res.render('pages/home', { userData: req.headers.member_data[0] });
         
    } else {
        return res.redirect('/')
    }
});


router.get('/new_post', verify, function (req, res) {
    if (req.headers.verified) {
        return res.render('pages/new_post', { userData: req.headers.member_data[0] });
         
    } else {
        return res.redirect('/')
    }
});



router.get('/about', verify, function (req, res) {
    if (req.headers.verified) {
        return res.render('pages/about', { userData: req.headers.member_data[0] });
         
    } else {
        return res.redirect('/')
    }
});


router.get('/logout', verify, function (req, res) {
    if (req.headers.verified) {
        res.clearCookie("authorization")
       return res.redirect("/");
         
    } else {
        return res.redirect('/')
    }
});

module.exports = router;