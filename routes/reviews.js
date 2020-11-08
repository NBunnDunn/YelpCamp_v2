const express = require('express');
const router = express.Router({mergeParams: true}); //merging params allows access of id from query, which is made separate by default when using express.Router
const reviews = require('../controllers/reviews');
const catchAsync = require('../utils/catchAsync');
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware');


//Routes ======
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createRV));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteRV));

module.exports = router;