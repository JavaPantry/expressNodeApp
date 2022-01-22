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
    let articles = Article.find({}, (err, articles) => {
        if (err) {
            console.log(err);
        } else {
            console.log(articles);
            res.render('index', {
                title: 'Articles:'
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
                                }
        );

// Delete Article
app.delete('/article/:id', async (req, res) => {
    try {
    //   if (!req.user._id) {
    //     res.status(500).send();
    //   }
      let query = { _id: req.params.id }
      const article = await Article.findById(req.params.id);
  
      Article.remove(query, (err) => {
        if (err) {
          console.log(err);
        }
        res.send('Success');
      }
      );

    //   if (article.author != req.user._id) {
    //     res.status(500).send();
    //   } else {
    //     remove = await Article.findByIdAndRemove(query);
    //     if (remove) {
    //       res.send('Success');
    //     }
    //   };
    } catch (e) {
      res.send(e);
    }
  
  });

// Load Edit Form - route for edit article
app.get('/article/edit/:id', (req, res) => {
    Article.findById(req.params.id, (err, article) => {
            if (err) {
                console.log(err);
            } else {
                res.render('edit_article', {title:'Edit Article "'+article.title+'"', article: article})
            }
        }
    )
}
);

// Update/Save Edit Article Form - route for POST edit article
app.post('/article/edit/:id', (req, res) => {
    console.log('Submitted POST DATA', req.body);  
    let article = {};
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;
    console.log("Received Article", article);

    let query = {_id: req.params.id}

    Article.update(query, article, (err) => {
        if (err) {
            console.log('Save error', err); 
            return
            // res.redirect('/');
        }else{
            console.log('Saved successfully');
            res.redirect('/');
        }
    });
    return;
});



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
