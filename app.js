const express = require('express');
const exphbs = require('express-handlebars');


const app = express();


const port = 3030;


//SET the default view
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));

// set Template engine
app.set('view engine', 'handlebars');

//How Middlewear works
app.use((req, res, next) => {
    req.name = 'Muhammad Hassan';
    next();
});


// Index Route
app.get('/', (req, res) => {
    console.log(req.name)
    const title = 'Welcome';
    res.render('home', {
        title
    });
});


// About Route
app.get('/about', (req, res) => {
    res.render('about');
});


app.listen(port, () => console.log(`Server started on port ${port}`));