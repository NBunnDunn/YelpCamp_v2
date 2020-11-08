if(process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const MongoDBStore = require('connect-mongo')(session);
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const cgRoutes = require('./routes/campgrounds');
const rvRoutes = require('./routes/reviews');
const userRoutes = require('./routes/user');
const User = require('./models/user');
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/yelp-camp";
const app = express(); 

mongoose.connect(dbUrl, {
	useNewUrlParser: true, useCreateIndex: true, 
	useUnifiedTopology: true, useFindAndModify: false
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', ()=> {
	console.log('DB Connected!');
});
const secret = process.env.SECRET || 'simpleSecret';
const store = new MongoDBStore({
	url : dbUrl,
	secret,
	//resaves data on a certain time interval vs every time page is reloaded
	touchAfter: 24 * 3600
});
store.on('error', function(e){
	console.log('Session-store error : ', e)
})

const sessionConfig = {
	store,
	name: 'session',
	secret,
	resave: false,
	saveUninitialized: true,
	cookie: {
		expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
		maxAge: 1000 * 60 * 60 * 24 * 7,
		//line prevents scripts from reading cookies, only http requests
		httpOnly: true,
		// secure: true
	}
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


//Line to use EJS Mate
app.engine('ejs', ejsMate);
//Line to parse body
app.use(express.urlencoded({extended: true}));
//Line to use Method Override
app.use(methodOverride('_method'));
//Line to serve public directory
app.use(express.static(path.join(__dirname, 'public')));
//Line to set up express.Session
app.use(session(sessionConfig));
//Line to use flash
app.use(flash());
//Lines for passport config
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//Express Mongo Sanitize config -- look at pckg for more options 
app.use(mongoSanitize());
//Helmet config (automatically enables all 11 middleware helmet has)
app.use(helmet({contentSecurityPolicy : false }));


//Middleware to for flash to be available on every route
app.use((req,res,next) => {
	res.locals.success = req.flash('success');
	res.locals.error = req.flash('error');
	res.locals.currentUser = req.user;
	next();
});


//Router Config
app.use('/campgrounds', cgRoutes);
app.use('/campgrounds/:id/reviews', rvRoutes);
app.use('/', userRoutes);

//================ Routes ================
app.get('/', (req,res) => {
	res.render('home');
});

app.all('*', (req,res,next) => {
	next(new ExpressError('404 -- Page does not exist!', 404))
});

app.use((err, req, res, next) => {
	const {statusCode = 500} = err;
	if(!err.message) err.message = 'There was an error! Abandon all ships!'
	res.status(statusCode).render('error', {err});
});
//================ End of routes ================

//Server config
const port = process.env.PORT || 3000
app.listen(port, ()=> {
	console.log('Server started!');
});