const express = require('express');
const passport = require('passport');
const router = express.Router();
const userController = require('../controller/users');
const catchAsync = require('../utilities/catchAsync');

router.route('/register')
    .get(userController.renderRegister)
    .post(catchAsync(userController.register));

router.route('/login')
    .get(userController.renderLogIn)
    //  passport.authenticate is used for authentication of the user
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), userController.login)

router.get('/logout', userController.logout)

module.exports = router;