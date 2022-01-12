const express = require('express');
const router = express.Router();
const axios = require('axios');

const verify = require('./../service/verify')


const clientID = process.env.clientID



router.get('/', verify, function (req, res) {
        return res.redirect('/home');
});

router.get('/login', verify, function (req, res) {
    if (req.headers.verified) {
        return res.redirect('/home');
         
    } else {
        return res.render('pages/index', { client_id: clientID });
    }
});


router.get('/home', verify, function (req, res) {
    // console.log(req.headers.member_data);
    if (req.headers.verified) {
        return res.render('pages/home', { userData: req.headers.member_data[0] });
         
    } else {
        return res.render('pages/home', { userData: null });
    }
});


router.get('/new_post', verify, function (req, res) {
    if (req.headers.verified) {
        return res.render('pages/new_post', { userData: req.headers.member_data[0] });
         
    } else {
        return res.redirect('/login')
    }
});



router.get('/about', verify, function (req, res) {
    // if (req.headers.verified) {
        return res.render('pages/about', { userData: req.headers.member_data[0] });
         
    // } else {
    //      return res.redirect('/login')
    // }
});


router.get('/logout', verify, function (req, res) {
    if (req.headers.verified) {
        res.clearCookie("authorization")
       return res.redirect("/");
         
    } else {
         return res.redirect('/login')
    }
});

module.exports = router;