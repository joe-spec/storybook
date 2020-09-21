const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const passport = require('passport')

//user model
const User = require('../models/User').User;

//login page
router.get('/login', (req,res) => res.render('login'));

//register page
router.get('/register', (req,res) => res.render('register'));

//register handle
router.post('/register', (req,res) =>{
    const { name, email, password, password2, /*file*/ } = req.body;
    let errors = [];

    //check require field
    if(!name || !email || !password || !password2 /*|| file*/){
        errors.push({ msg: 'Please fill in all fields' });
    }

    //check passwors match
    if(password !== password2){
        errors.push({ msg: 'Passwords do not match' });
    }

    //check passwords length
    if(password.length < 6){
        errors.push({ msg: 'Password should be atleast six characters' });
    }

    if(errors.length > 0){
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2,
            // file
        });
    }else{
        //validation pass
        User.findOne({ email:email })
        .then(user => {
            if(user){
                //user exist
                errors.push({ msg:' Email is registered'})
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2,
                    // file
                });
            }else{
                const newUser = new User({
                    name,
                    email,
                    password,
                    // file
                });
                //hash password
                bcrypt.genSalt(10, (err, salt)=>{
                    bcrypt.hash(newUser.password, salt, (err, hash)=> {
                        if(err) throw err;
                        newUser.password = hash;
                        newUser.save().then(user => {
                            req.flash('success_msg','registered')
                            res.redirect('/users/login')
                        }).catch(err => {
                            console.log(err)
                        });
                    })
                })
            }
        });
    }
});

//login handle
router.post('/login', (req,res,next)=>{
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req,res,next);
});

//logout handle
router.get('/logout', (req,res) =>{
    req.logout();
    req.flash('success_msg', 'loggout');
    res.redirect('/');
})

module.exports = router;