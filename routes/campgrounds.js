const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, validateCampground, isAuthor} = require('../middleware');
const multer = require('multer');
//dont need to require ../cloudinary/index bc node auto. looks for index file
const {storage} = require('../cloudinary');
const upload = multer({ storage });


//Routes =========
router.route('/')
	.get(catchAsync(campgrounds.index))
	.post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCG));

router.get('/new', isLoggedIn, campgrounds.newForm);

router.route('/:id')
	.get(catchAsync(campgrounds.showCG))
	.put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCG))
	.delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCG));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.editCG));


module.exports = router;