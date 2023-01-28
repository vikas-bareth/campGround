const express = require('express');
const passport = require('passport');
const User = require('../models/user')
const catchAsync = require('../utils/catchAsync');
const router = express.Router();


router.get('/register',(req,res) => {
    res.render('users/register')
})

router.post('/register', catchAsync(async (req,res,next) => {
    try{
    const {username, email, password} = req.body;
    const user = new User({email,username})
    const registeredUser = await User.register(user,password);
    req.login(registeredUser, err => {
        if(err) return next(err);
        req.flash('success',`Welcome to campingGrounds ${req.user.username}`);
        res.redirect('/campgrounds')
    })
    
    } catch(e){
        req.flash('error',e.message)
        res.redirect('/register')
    }
}))

router.get('/login',(req,res) => {
    res.render('users/login')
})

router.post('/login', passport.authenticate('local',{ failureFlash:true, failureRedirect:'/login',keepSessionInfo: true}), (req,res) => {
    req.flash('success',`Welcome back ${req.user.username}`);
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})

router.get('/logout',(req,res,next) => {
    req.logout((err) => {
        if(err) {return next(err);}
        req.flash('success','Logged you out!');
        res.redirect('/');
    });
})


module.exports = router;