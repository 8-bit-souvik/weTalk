const express = require('express');
const router = express.Router();


router.use('/', require('./../template'));
router.use('/github', require('./github'));
router.use('/imagekit', require('./imagekit'));















module.exports = router;
