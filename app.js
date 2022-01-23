const express = require('express');
const path = require('path');
const bodyParser = require('body-parser')
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');



/* 
before refactoring

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/nodekb');
let db = mongoose.connection;
// check connection
db.once('open', function() {
    console.log('Connected to MongoDB');
});

// check for db errors
db.on('error', function(err) {
    console.log('connection error:', err);
});
 */

// Initial refactoring
/* 
// Initial refactoring database.js content:
module.exports = {
    database: 'mongodb://localhost:27017/nodekb',
    secret: 'yoursecret'
  }
 */
const mongoose = require('mongoose');
const config =  require('./config/database');
mongoose.connect(config.database);
let db = mongoose.connection;

// check connection
db.once('open', function() {
    console.log('Connected to MongoDB');
});

// check for db errors
db.on('error', function(err) {
    console.log('connection error:', err);
});


/* 
2nd refactoring
//const mongoose = require('mongoose');
const config = require('dotenv').config();
const connectDB = require('./config/database');
connectDB(); */


// Init app
const app = express();
const port = 3000;

// Bring in Models
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

// Express Session Middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
  }));
  
// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
res.locals.messages = require('express-messages')(req, res);
next();
});
  

// Express Validator Middleware
const { body, validationResult } = require('express-validator');

// Passport Config
require('./middleware/passport')(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function (req, res, next) {
    res.locals.user = req.user || null;
    next();
  });
  
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

// Route Files
let articles = require('./routes/articles');
let users = require('./routes/users');
app.use('/articles', articles);
app.use('/users', users);


// start server
app.listen(port, function() {
    console.log('Server started on port 3000')
})
