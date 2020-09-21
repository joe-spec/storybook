const express = require('express');
const { ensureAuthenticated, ensureGuest } = require('../config/auth');
const router = express.Router();
const Story = require('../models/Story').Story;


//add page
// stories/add
router.get('/add',ensureAuthenticated, (req,res) => res.render('stories/add'));

//add process
// stories/add
router.post('/',ensureAuthenticated, async (req,res) => {
    try {
        req.body.user = req.user.id
        await Story.create(req.body)
        res.redirect('/dashboard')
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
});


//show all stories
// stories/add 
router.get('/', ensureAuthenticated, async (req,res) => {
    try {
        const stories = await Story.find({ status: 'public' })
        // const user = await User.find( req.user)
            .populate('user')
            .sort({ createdAt: 'desc' })
            .lean()
        res.render('stories/index', {
            // user,
            user: req.user,
            story:stories
        })
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
});

//single stories
// stories/:id
router.get('/:id',ensureAuthenticated, async (req,res) => {
    try {
        let story = await Story.findById(req.params.id)
            .populate('user')
            .lean()

            if(!story){
                return res.redirect('error/404')
            }

            res.render('stories/show',{
                story
            })
    } catch (err) {
        console.error(err)
        res.render('error/404')
    }
});

//edit stories
// stories/edit/:id
router.get('/edit/:id', ensureAuthenticated, async (req, res)=>{
    try {
        const story = await Story.findOne({
            _id: req.params.id
        }).lean()

        if(!story){
            return res.render('error/404')
        }

        if (story.user != req.user.id) {
            res.redirect('/stories')
        }else{
            res.render('stories/edit', {
                story
            })
        }
    } catch (err) {
        console.error(err)
        return res.render('error/500')
    }
});

//update story
// stories/:id
router.put('/:id',ensureAuthenticated, async (req,res) => {
    try {
        let story = await Story.findById(req.params.id).lean()

        if(!story){
            return res.render('error/404')
        }

        if (story.user != req.user.id) {
            res.redirect('/stories')
        }else{
            story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
                new: true,
                runValidations: true
            })

            res.redirect('/dashboard')
        }
    } catch (err) {
        console.error(err)
        return res.render('error/500')
    }
});

//delete story
// stories/:id
router.delete('/:id',ensureAuthenticated, async (req,res) => {
    try {
        await Story.remove({ _id: req.params.id})
        res.redirect('/dashboard')
    } catch (err) {
        console.error(err)
        return res.render('error/500')
    }
});

//user stories
// stories/user/:id
router.get('/user/:userId',ensureAuthenticated, async (req,res) => {
    try {
        const story = await Story.find({
            user: req.params.userId,
            status: 'public'
        })
        .populate('user')
        .lean()

        // let story = await Story.find(req.params.id).lean()

        res.render('stories/index',{
            story
        })
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
});




module.exports = router;