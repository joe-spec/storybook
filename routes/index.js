const express = require('express');
const { ensureAuthenticated, ensureGuest } = require('../config/auth');
const router = express.Router();
const Story = require('../models/Story').Story;


router.get('/', async (req,res) => {
    try {
        const stories = await Story.find({ status: 'public' })
            .populate('user')
            .sort({ createdAt: 'desc' })
            .lean()
        res.render('welcome', {
            // user,
            user: req.user,
            story:stories
        })
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
});


router.get('/dashboard', ensureAuthenticated, (req, res)=>{
    Story.find({user: req.user.id}, function(err, stories){
        if(err){
            console.error(err);
            res.render('error/500')
        }else{
            res.render('dashboard',{
                name: req.user.name,
                story:stories
            });
        }
    })
});

module.exports = router;