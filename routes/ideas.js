const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

// Mongoose Schema
require('../models/ideas')
const Idea = mongoose.model('ideas');

// Ideas route
router.get('/', (req, res) => {
    Idea.find({})
        .sort({date: 'desc'})
        .then(ideas => {
            res.render('ideas/index',{
                ideas
            })
        })
})

// Ideas edit route
router.get('/edit/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
        .then(idea => {
            res.render('ideas/edit', {
                idea
            })
        })
});

// listening to POST req
router.post('/', (req, res) => {
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
router.put('/:id', (req, res) => {
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
router.delete('/:id', (req, res) => {
    Idea.remove({ _id: req.params.id })
        .then(() => {
            req.flash('success_msg', 'Video idea delete');
            res.redirect('/ideas');
        })
})

module.exports = router;