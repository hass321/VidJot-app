const express = require("express");
const exphbs = require("express-handlebars");
// mongoose
const mongoose = require("mongoose");
// body-parser
const bodyParser = require('body-parser');
// Method-override
const methodOverride = require('method-override');
//Flash
const flash = require('connect-flash');
// Session
const session = require('express-session');

// Map global Promise to avoid warning
mongoose.Promise = global.Promise;
// connecting to mongoosedb
mongoose
  .connect("mongodb://localhost/vidjot-app", { useNewUrlParser: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Mongoose Schema
require('./models/ideas')
const Idea = mongoose.model('ideas');

const app = express();

const port = 3030;

//SET the default view
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);

// set Template engine
app.set("view engine", "handlebars");

//How Middlewaer works
app.use((req, res, next) => {
  req.name = "Muhammad Hassan";
  next();
});
// session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))
// body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
// Methode Override Middleware
app.use(methodOverride('_method'));
// flash middleware
app.use(flash());

// Global variables
app.use(function(req, res, next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})

// Index Route
app.get("/", (req, res) => {
  const title = "Welcome";
  res.render("home", {
    title
  });
});

// Ideas route
app.get('/ideas', (req, res) => {
    Idea.find({})
        .sort({date: 'desc'})
        .then(ideas => {
            res.render('ideas/index',{
                ideas
            })
        })
})

// Ideas edit route
app.get('/ideas/edit/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
        .then(idea => {
            res.render('ideas/edit', {
                idea
            })
        })
})

// About Route
app.get("/about", (req, res) => {
  res.render("about");
});

// Add Route
app.get("/ideas/add",(req, res) => {
    res.render("ideas/add")
})

// listening to POST req
app.post('/ideas', (req, res) => {
    const errors = [];
    if(!req.body.title){ errors.push({text: 'Please add a title'}) };
    if(!req.body.details){ errors.push({text: 'Please add some details'}) };
    if(errors.length > 0){
        res.render('ideas/add', {
            errors,
            title: req.body.title,
            details: req.body.details
        });
    }else{
        const newUser = {
            title: req.body.title,
            details: req.body.details
        }

        new Idea(newUser)
            .save()
            .then(idea => {
                req.flash('success_msg', 'video idea added')
                res.redirect('/ideas');
            })
    };
})

// Idea update or PUT request
app.put('/ideas/:id', (req, res) => {
    const _id = req.params.id;
    Idea.findOne({ _id })
        .then(idea => {
            idea.title = req.body.title;
            idea.details = req.body.details;
            idea.save()
                .then(idea => {
                    req.flash('success_msg', 'video idea updated')
                    res.redirect('/ideas')
                })

        })
})

// Delete request or delete idea
app.delete('/ideas/:id', (req, res) => {
    Idea.remove({ _id: req.params.id })
        .then(() => {
            req.flash('success_msg', 'Video idea delete');
            res.redirect('/ideas');
        })
})

app.listen(port, () => console.log(`Server started on port ${port}`));