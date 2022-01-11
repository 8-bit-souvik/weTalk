const express = require('express');
const router = express.Router();
const app = express()

const { urlencoded } = require('express');
app.use(express.json());
app.use(urlencoded({ extended: false }));



router.get('/', verify, function (req, res){
    res.send({msg: "working!"})
})




module.exports = router;