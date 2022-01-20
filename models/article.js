const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost:27017/nodekb');
// let db = mongoose.connection;

// Article Schema
const articleSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    }
});

let Article = module.exports = mongoose.model('Article', articleSchema)
