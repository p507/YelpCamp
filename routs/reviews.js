const express = require('express');                                 //  Robust Server
const router = express.Router({ mergeParams: true });
const reviewController = require('../controller/reviews');
const catchAsync = require('../utilities/catchAsync');
const { valiateReview, isLoggedIn, isReviewAuthor } = require('../middleware');             //  Handling async errors


router.post('/', isLoggedIn, valiateReview, catchAsync(reviewController.createReview))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviewController.deleteReview))

module.exports = router;