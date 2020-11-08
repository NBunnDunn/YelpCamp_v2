const Campground = require('../models/campground');
const {cloudinary} = require('../cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken});

module.exports.index = async(req,res,next) => {
	const campgrounds = await Campground.find({});
	res.render('campgrounds/index', {campgrounds});
}; 

module.exports.newForm = (req,res) => {
	res.render('campgrounds/new');
};

module.exports.createCG = async (req,res,next) => {
	const geoData = await geocoder.forwardGeocode({
		query: req.body.campground.location,
		limit: 1
	}).send();
	const campground = new Campground(req.body.campground);
	campground.geometry = geoData.body.features[0].geometry;	
	campground.images = req.files.map(f =>({url: f.path, fileName: f.filename}));
	campground.author = req.user._id;
	await campground.save();
	console.log(campground);
	req.flash('success', 'Successfully made new campground!');
	res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.showCG = async(req,res,next) =>{
	//nested populate to access author of reviews (which is on the campground model)
	const campground = await Campground.findById(req.params.id).populate({
		path:'reviews',
		populate: {
			path: 'author'
		}
	}).populate('author');
	if(!campground){
		req.flash('error', 'Campground was not found!');
		return res.redirect('/campgrounds');
	}
	res.render('campgrounds/show', {campground});
};

module.exports.editCG = async(req, res,next) => {
	const campground = await Campground.findById(req.params.id);
	if(!campground){
		req.flash('error', 'Campground was not found!');
		return res.redirect('/campgrounds');
	}
	res.render('campgrounds/edit', {campground});	
};

module.exports.updateCG = async (req,res,next) => {
	const {id} = req.params;
	const campground =  await Campground.findByIdAndUpdate(id, {...req.body.campground});
	const imgs = req.files.map(f =>({url: f.path, fileName: f.filename}));
	campground.images.push(...imgs);
	await campground.save();
	if(req.body.deleteImages){
		for(let filename of req.body.deleteImages){
			await cloudinary.uploader.destroy(filename);
		}
		await campground.updateOne({$pull: {images: {fileName : {$in: req.body.deleteImages}}}})
		console.log(campground);
	}
	req.flash('success', 'Successfully updated campground!');
	res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCG = async (req,res,next) => {
	const {id} = req.params;
	await Campground.findByIdAndDelete(id);
	req.flash('success', 'Successfully deleted campground!');
	res.redirect('/campgrounds');
};
