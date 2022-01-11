const express = require('express');
const router = express.Router();


router.use('/', require('./../template'));
router.use('/github', require('./github'));















module.exports = router;
