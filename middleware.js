const Campground = require('./models/campground');
const {campgroundSchema, reviewSchema} = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Review = require('./models/review');
const validator = require('validator');

module.exports.isLoggedIn = (req,res,next)=>{
	if(!req.isAuthenticated()){
		req.session.returnTo = req.originalUrl;
		req.flash('error', 'You must be logged in to create a campground!');
		return res.redirect('/login');
	}
	next();
}

module.exports.validateCampground = (req,res,next) => {  
	// Remove HTML-specific chars
	for (let property in req.body.campground) {
		req.body.campground[property] = validator.blacklist(req.body.campground[property], '<>/')
		console.log(req.body.campground[property], 'hi');
	}

	const {error} = campgroundSchema.validate(req.body);
	if(error){
		const msg= error.details.map(el=> el.message).join(',')
		throw new ExpressError(msg, 400);
	} else {
		next();
	}
}

module.exports.isAuthor = async (req,res,next) => {
	const {id} = req.params;
	const campground = await Campground.findById(id);
	if(!campground.author.equals(req.user._id)){
		req.flash('error', 'You do not have permission to do that!');
		return res.redirect(`/campgrounds/${id}`);
	}
	next();
}

module.exports.validateReview = (req,res,next) => {
	// Remove HTML-specific chars
	for (let property in req.body) {
		req.body[property] = validator.blacklist(req.body[property], '<>/')
	}
	const {error} = reviewSchema.validate(req.body)
	if(error){
		const msg= error.details.map(el=> el.message).join(',')
		throw new ExpressError(msg, 400);
	} else {
		next();
	}
}
module.exports.isReviewAuthor = async (req,res,next) => {
	const {id, reviewId} = req.params;
	const review = await Review.findById(reviewId);
	if(!review.author.equals(req.user._id)){
		req.flash('error', 'You do not have permission to do that!');
		return res.redirect(`/campgrounds/${id}`);
	}
	next();
}