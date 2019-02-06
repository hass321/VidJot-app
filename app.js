const express = require("express");
const exphbs = require("express-handlebars");
// mongoose
const mongoose = require("mongoose");
// body-parser
const bodyParser = require('body-parser');

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

// body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

// Index Route
app.get("/", (req, res) => {
  console.log(req.name);
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
                res.redirect('/ideas');
            })
    };
})

app.listen(port, () => console.log(`Server started on port ${port}`));
