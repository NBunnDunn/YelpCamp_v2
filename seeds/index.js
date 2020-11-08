const mongoose = require('mongoose');
const cities = require('./cities');
const Campground = require('../models/campground');
const {places, descriptors} = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
	useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', ()=> {
	console.log('DB Connected!');
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
	await Campground.deleteMany({});
	for(let i =0; i < 300; i++){
		const random1000 = Math.floor(Math.random() * 1000);
		const price = Math.floor(Math.random() * 20) +10;
		const camp = new Campground({
			author: '5f8b8e688376700ccf98a2d8',
			location: `${cities[random1000].city}, ${cities[random1000].state}`,
			title: `${sample(descriptors)} ${sample(places)}`,
			images: [
				{
					url: 'https://res.cloudinary.com/thatcloudisbuff/image/upload/v1603136502/Yelpcamp/z3ekttaiw5nhremxxy9s.jpg',
       				fileName: 'Yelpcamp/z3ekttaiw5nhremxxy9s'
				}
			],
			description: 'Spicy jalapeno bacon ipsum dolor amet hamburger ham frankfurter strip steak capicola prosciutto pork loin sirloin short loin beef filet mignon tail jerky kevin burgdoggen. Meatball t-bone pastrami, tenderloin spare ribs capicola tail beef ribs salami drumstick striLp steak. Pig ground round chislic hamburger, shank pork beef ribs fatback ham hock landjaeger meatball corned beef swine porchetta. Jowl leberkas shankle picanha.',
			price,
			geometry: { 
				type: 'Point', 
				coordinates: [cities[random1000].longitude, cities[random1000].latitude] 
			}
		});
		await camp.save();
	}
}

seedDB().then(()=>{
	mongoose.connection.close();
	console.log('Connection closed!');
});
