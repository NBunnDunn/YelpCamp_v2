const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
	url: String,
	fileName: String
});

ImageSchema.virtual('thumbnail').get(function(){
	return this.url.replace('/upload', '/upload/w_250')
});

const opts = { toJSON: {virtuals : true}};
const CampgroundSchema = new Schema({
	title: String,
	images: [ImageSchema],
	geometry: {
		type: {
			type: String,
			enum: ['Point'],
			required: true
		},
		coordinates: {
			type: [Number],
			required:true
		}
	},
	price: Number,
	description: String,
	location: String,
	postDate: Object,
	author: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	reviews: [
		{
			type: Schema.Types.ObjectId,
			ref: "Review" 
		}
	]
}, opts);

CampgroundSchema.virtual('properties.popUpMarkUp').get(function(){
	return `
		<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
		<p>${this.description.substring(0,26)}...</p>
	`	
});

CampgroundSchema.post('findOneAndDelete', async function(doc){
	if(doc){
		await Review.remove({
			//(Mongoose Middleware) remove id which is somewhere $in doc.reviews
			_id: {
				$in: doc.reviews
			}
		});
	}
});

module.exports = mongoose.model('Campground', CampgroundSchema); 