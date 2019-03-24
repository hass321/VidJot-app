const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
// Passport
const passport = require('passport');
// bcrypt for password
const bcrypt = require('bcryptjs');

// User model
require('../models/users');
const User = mongoose.model('users');

// User login Route
router.get('/login', (req, res) => {
    res.render('users/login')
})

// Login form post
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/ideas',
        failureRedirect: '/user/login',
        failureFlash: true
    })(req, res, next);
});

// User Register Route
router.get('/register', (req, res) => {
    res.render('users/register')
})

// Register form post
router.post('/register', (req, res) => {
    let errors = [];
    const { name, email, password, password2 } = req.body;

    if(req.body.password !== req.body.password2){
        errors.push({ text: 'password are not matched' })
    }
    if(req.body.password.length < 4 ){
        errors.push({ text: 'password must be atleast 4 characters' })
    }
    if(errors.length > 0){
        res.render('users/register', {
            errors,
            name,
            email,
            password,
            password2
        })
    }
    else{
        User.findOne({ email: email })
        .then(user => {
            if(user){
                req.flash('error_msg', 'Email already Registered!');
                res.redirect('/user/login');
            }else{
                const newUser = new User({
                    name,
                    email,
                    password
                })
        
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) throw err;
                        newUser.password = hash;
                        newUser.save()
                        .then(user => {
                            req.flash('success_msg', 'You are now registered and can login')
                            res.redirect('/user/login');;
                        })
                        .catch(err => {
                            console.log(err)
                            return;
                        })
                    })
                })
            }
        })
    }
});

// User logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'Your are logged out');
    res.redirect('/user/login');
})

module.exports = router;