const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
// Express Validator Middleware
const { body, validationResult } = require('express-validator');

const { User } = require('../models/user');

// Register Form
router.get('/register', async (req, res) => {
  res.render('register');
});

// Register Proccess
router.post('/register', 
    body("name").notEmpty(),
    body("email").isEmail(),
    body("username").notEmpty(),
    body("password").notEmpty(),
    //body("password2").equals(body("password")),
    body("password2").notEmpty(),
    async (req, res) => {

        const errors = validationResult(req).errors;
        // if errors array not empty exist, render form again with errors
        if (errors.length > 0) {
          
            console.log("received fields\n",
            req.body.name,
            req.body.email,
            req.body.username,
            req.body.password,
            req.body.password2)

          console.log(errors);  
          res.render("register", {
            title: "fill out all required fields before submit new User",
            errors: errors
          });
          return;
        }

    const salt = await bcrypt.genSalt(10);
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      username: req.body.username,
      password: await bcrypt.hash(req.body.password, salt)
    });
    newUser.save();
    req.flash('success', 'You are now registered and can log in');
    res.redirect('/users/login');
});


// Login Form
router.get('/login', async (req, res) => {
  res.render('login');
});


// Login Process
router.post('/login', async (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// logout
router.get('/logout', async (req, res) => {
  req.logout();
  req.flash('success', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;