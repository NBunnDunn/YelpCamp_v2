# YelpCamp v2

## Description
YelpCamp v2 is a web application that allows users to view, create, and review campground locations. 

## Features
- View a list of all campgrounds
- Create a new campground with details like description, image, and location
- Leave reviews and ratings for campgrounds
- User authentication for managing campgrounds and reviews

## Installation
To get YelpCamp v2 up and running locally, follow these steps:

1. Clone the repository:
`git clone https://github.com/NBunnDunn/YelpCamp_v2.git`
2. Navigate to the project directory:
`cd YelpCamp_v2`
3. Install the required dependencies:
`npm install`
4. Set up .env file and these environment variables
- NODE_ENV=
    - ex. dev
- PORT=
    - 3000 is always a good choice
- DB_SECRET=
    - *Requires MongoDB account
- DB_URL=
    - *Requires MongoDB account
**All cloudinary variables are optional, h/e you'll have to provide photos with a different online provider or locally**
- CLOUDINARY_CLOUD_NAME=
    - *Requires MapboxGL account
- CLOUDINARY_KEY=
    - *Requires MapboxGL account
- CLOUDINARY_SECRET=
    - *Requires MapboxGL account
- CLOUDINARY_SEED_PHOTOS=
    - This would be a comma-separated list of URL values for photos (ex. photoURL,nextPhotoURL)
    - This is unnecessary, however if you don't include this you'll have to edit the seeds/index.js file (as it is set up to use this to random select a photo url when populating DB)
- MAPBOX_TOKEN=
    - *Requires MapboxGL account 

## Usage
To start the server, run the following command in your terminal:
`npm run start`

Once the server is running, open `http://localhost:3000` (or your configured port) in your browser to view the application.