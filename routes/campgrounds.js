const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
const catchAsync = require('../utils/catchAsync')
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const Campground = require('../models/campgrounds')
const {storage} = require('../cloudinary')
const multer  = require('multer')
const upload = multer({ storage })




//*******************making new route handlers*******************
router.route('/')
	.get(catchAsync(campgrounds.index))
	.post(isLoggedIn,upload.array('image'),validateCampground,catchAsync(campgrounds.createCampground))
	
router.get('/new',isLoggedIn, campgrounds.renderNewForm)

router.route('/:id')
	// .get(isLoggedIn,validateCampground,catchAsync(campgrounds.showCampground))
	.put(isLoggedIn,validateCampground,catchAsync(campgrounds.updateCampground))
	.delete(isLoggedIn,catchAsync(campgrounds.deleteCampground))

router.get('/:id/edit',isLoggedIn,catchAsync(campgrounds.renderEditForm))


// //******************Show page for specific Campground******************
router.get('/:id',catchAsync(async (req,res) => {
	const campground = await Campground.findById(req.params.id).populate({path:'reviews',populate:{path:'author'}}).populate('author');
	if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
	res.render('campgrounds/show',{campground})
}))



module.exports = router;