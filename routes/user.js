const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/user');
const users = require('../controllers/users');
const catchAsync = require('../utils/catchAsync');

router.route('/register')
	.get(users.newForm)
	.post(catchAsync(users.registerLogic));

router.route('/login')
	.get(users.loginForm)
	//'local' is the strategy, options: flash if fail : true, redirect to /login if fail
	.post(passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), users.loginUser);

router.get('/logout', users.logoutUser);
	
module.exports = router;