
const mongoAddress = process.env.mongoDB_remote

const mongoose = require("mongoose");
const connection = mongoose.createConnection(
    mongoAddress
);

// const mongoose = require("mongoose");
// const connection = mongoose.createConnection(
//     "mongodb://localhost:27017/test"
// );







module.exports = connection;