const express = require('express');
const path = require('path');
const bodyParser = require('body-parser')

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

// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// set public folder
app.use(express.static(path.join(__dirname, 'public')));


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

// add route for single article
app.get('/article/:id', (req, res) => {
                                    Article.findById(req.params.id, (err, article) => {
                                            if (err) {
                                                console.log(err);
                                            } else {
                                                //console.log(article); // print article record
                                                res.render('article', {article: article})
                                            }
                                        }
                                    )
                                    // res.render('add_article', {
                                    //     title: 'Add Article'
                                }
        );

    

// add route http://localhost:3000/articles/add
app.get('/articles/add', (req, res) => {
    res.render('add_article', {
        title: 'Add Article'
    })
});

// add Submit POST route http://localhost:3000/articles/add
app.post('/articles/add', (req, res) => {
    console.log('Submitted POST DATA', req.body);  
    let article = new Article();
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;
    console.log("Received Article", article);
    article.save((err) => {
        if (err) {
            console.log('Save error', err); 
            res.redirect('/');
        }else{
            console.log('Saved successfully');
            res.redirect('/');
        }
    });
    return; //Article.create(req.body, (err, article) => {})
});

// start server
app.listen(port, function() {
    console.log('Server started on port 3000')
})
