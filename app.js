const express = require('express');
const path = require('path');
// Init app
const app = express();
const port = 3000;

// load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
// root route
// app.get('/', (req, res) => res.send('Hello World!'));

// add home route http://localhost:3000/
app.get('/', (req, res) => {
    const articles = [
        {
            id: 1,
            title: 'Article One',
            author: 'John Doe',
            body: 'Article One. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quidem.'
        },
        {
            id: 2,
            title: 'Article Two',
            author: 'Alexei Ptitchkin',
            body: 'Article Two. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quidem.'
        },
        {
            id: 3,
            title: 'Article Three',
            author: 'Alexei Andreev',
            body: 'Article Three. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quidem.'
        }
    ];
    
    res.render('index', {
                        title: 'Hey! Hello there from node monitor!'
                        , articles: articles}
            );
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
