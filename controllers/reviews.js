const Review = require('../models/review');
const Campground = require('../models/campground');

module.exports.createRV = async (req,res,next)=> {
	const {id} = req.params;
	const campground = await Campground.findById(id);
	const review = new Review(req.body.review);
	review.author = req.user._id;
	campground.reviews.push(review);
	await review.save();
	await campground.save();
	req.flash('success', 'Successfully created review!');
	res.redirect(`/campgrounds/${campground._id}`);
};
module.exports.deleteRV = async (req,res,next) => {
	const {id, reviewId} = req.params;
	//$pull is Mongo method which pulls certain instance out of array matching certain condition -- in this case matching the certain reviewId
	await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
	await Review.findByIdAndDelete(reviewId);
	req.flash('success', 'Successfully deleted review!');
	res.redirect(`/campgrounds/${id}`);
};