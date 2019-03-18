const express = require("express");
const exphbs = require("express-handlebars");
const path = require('path');
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


const app = express();

const port = 3030;

// Load routes
const Ideas = require('./routes/ideas');
const Users = require('./routes/users');

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


// Static folder
app.use(express.static(path.join(__dirname,'public')))

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

// About Route
app.get("/about", (req, res) => {
  res.render("about");
});

// Use router
app.use('/ideas', Ideas);
app.use('/user', Users);

app.listen(port, () => console.log(`Server started on port ${port}`));