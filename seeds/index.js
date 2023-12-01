if(process.env.NODE_ENV !== 'production') {
	const dotEnvResult = require('dotenv').config();
}
const mongoose = require('mongoose');
const cities = require('./cities');
const Campground = require('../models/campground');
const {places, descriptors} = require('./seedHelpers');
const dbUrl = process.env.DB_URL;
const seedPhotosString = process.env.CLOUDINARY_SEED_PHOTOS;
const seedPhotoURLArray = seedPhotosString.split(',');
const getRandomDate = require('../utils/getRandomDate')

// Connect to DB
mongoose.connect(dbUrl, {
	useNewUrlParser: true, useCreateIndex: true, 
	useUnifiedTopology: true, useFindAndModify: false
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', ()=> {
	console.log('DB Connected!');
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
	await Campground.deleteMany({});
	for (let i =0; i < 300; i++) {
		const random1000 = Math.floor(Math.random() * 1000);
		const price = Math.floor(Math.random() * 20) +10;
		const randomPhotoURL = seedPhotoURLArray[Math.floor(Math.random() * seedPhotoURLArray.length)]; // https://cloudinary/cloudName/image/upload/id/folderName/fileName.ext
		const randomPhotoFilename = randomPhotoURL.slice(randomPhotoURL.lastIndexOf('/') + 1);
		const camp = new Campground({
			author: '656a11d0fb36a67ed264fd17', // default user user.id
			location: `${cities[random1000].city}, ${cities[random1000].state}`,
			title: `${sample(descriptors)} ${sample(places)}`,
			images: [
				{
					url: randomPhotoURL,
       				fileName: randomPhotoFilename
				}
			],
			description: 'Spicy jalapeno bacon ipsum dolor amet hamburger ham frankfurter strip steak capicola prosciutto pork loin sirloin short loin beef filet mignon tail jerky kevin burgdoggen. Meatball t-bone pastrami, tenderloin spare ribs capicola tail beef ribs salami drumstick striLp steak. Pig ground round chislic hamburger, shank pork beef ribs fatback ham hock landjaeger meatball corned beef swine porchetta. Jowl leberkas shankle picanha.',
			price,
			postDate: getRandomDate(),
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
