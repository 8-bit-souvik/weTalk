
const mongoAddress = 'mongodb+srv://8bitsouvik:SBlUpd26oz0Lhmkx@cluster0.jig07.mongodb.net/sampleBlog?retryWrites=true&w=majority'

const mongoose = require("mongoose");
const connection = mongoose.createConnection(
    mongoAddress
);

// const mongoose = require("mongoose");
// const connection = mongoose.createConnection(
//     "mongodb://localhost:27017/test"
// );







module.exports = connection;