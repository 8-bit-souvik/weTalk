// index.js

/*  EXPRESS */
const express = require('express');
var cookieParser = require('cookie-parser')
const path = require('path');
require("dotenv").config({ path: `${__dirname}/.env` });

const app = express()
app.use(cookieParser())


var cors = require('cors')
app.use(cors())


//body parser middleware 
const { urlencoded } = require('express');
app.use(express.json());
app.use(urlencoded({ extended: false }));


app.set('view engine', 'ejs');
var access_token = "";
var requestToken = "";


app.use("/public", express.static("./public"));

//routes
app.use('/', require('./src/api/template'));


app.use("/auth", require('./src/api/auth/auth'));

app.use("/activity/onpost", require('./src/api/usr_activity'))

app.use("/activity/savepost", require('./src/api/usr_savings'))

app.post("/test", (req, res) => {
    
    res.status(200).send(req.body);
})

app.use("/*", (req, res) => {
    res.status(404).send(`<br><br><h1 style="text-align: center;">404 || content not found</h1>`);

});



const port = process.env.PORT || 5510;
app.listen(port, () => console.log('App listening on port ' + port ));

