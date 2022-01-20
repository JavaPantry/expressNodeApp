const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/nodekb');
let db = mongoose.connection;
// check connection
db.once('open', function() {
    console.log('Connected to MongoDB');
});

// check for db errors
//db.on('error', console.error.bind(console, 'connection error:'));
db.on('error', function(err) {
    console.log('connection error:', err);
});


// Init app
const app = express();
const port = 3000;

// load models
const Article = require('./models/article');

// load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
// root route
// app.get('/', (req, res) => res.send('Hello World!'));

// add home route http://localhost:3000/
app.get('/', (req, res) => {
    // const articles = [
    //     {
    //         id: 1,
    //         title: 'Article One',
    //         author: 'John Doe',
    //         body: 'Article One. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quidem.'
    //     },
    //     {
    //         id: 2,
    //         title: 'Article Two',
    //         author: 'Alexei Ptitchkin',
    //         body: 'Article Two. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quidem.'
    //     },
    //     {
    //         id: 3,
    //         title: 'Article Three',
    //         author: 'Alexei Andreev',
    //         body: 'Article Three. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quidem.'
    //     }
    // ];
    
    let articles = Article.find({}, (err, articles) => {
        if (err) {
            console.log(err);
        } else {
            console.log(articles);
            res.render('index', {
                title: 'Hey! Hello there from node monitor!'
                , articles: articles}
                );
        }}).sort({_id: -1});


    }); 

// add route http://localhost:3000/articles/add
app.get('/articles/add', (req, res) => {
    res.render('add_article', {
        title: 'Add Article'
    })
});


// start server
app.listen(port, function() {
    console.log('Server started on port 3000')
})
