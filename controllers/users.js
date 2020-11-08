const User = require('../models/user');

module.exports.newForm = (req,res) => {
	res.render('users/register');
};

module.exports.registerLogic = async (req,res, next) => {
	try {
		const {email, username, password} = req.body;
		const user = new User({email, username});
		const registeredUser = await User.register(user, password);
		req.login(registeredUser, (e) => {
			if (e) return next(e);
			req.flash('success', 'Welcome to Yelpcamp!');
			res.redirect('/campgrounds');
		});	
	}
	catch(e){
		req.flash('error', e.message);
	}
};

module.exports.loginForm = (req,res) => {
	res.render('users/login');
};

module.exports.loginUser = (req,res) => {
	req.flash('success', 'Welcome back!');
	const redirectUrl = req.session.returnTo || '/campgrounds';
	//to delete url from session afterwards
	delete req.session.returnTo;
	res.redirect(redirectUrl);
};

module.exports.logoutUser = (req,res) =>{
	req.logout();
	req.flash('success', 'Logged out');
	res.redirect('/campgrounds');
};