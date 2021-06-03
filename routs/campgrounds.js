const express = require('express');
const router = express.Router();
const campController = require('../controller/campgrounds')
const catchAsync = require('../utilities/catchAsync');          //  Handling async errors
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware')
const { storage } = require('../cloudinary');
const multer = require('multer');
const upload = multer({ storage });

router.route('/')
    .get(catchAsync(campController.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campController.newCampground));

router.get('/new', isLoggedIn, campController.newCampForm)

router.route('/:id')
    .get(catchAsync(campController.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campController.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campController.deleteCampground))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campController.editCampground))

module.exports = router;