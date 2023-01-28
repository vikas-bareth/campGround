const express = require('express');
const catchAsync = require('../utils/catchAsync')
const Campground = require('../models/campgrounds')
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const router = express.Router();


//******************All campground list Page******************
router.get('/',catchAsync(async (req,res) => {
	const camps = await Campground.find({})
	res.render('./campgrounds/index',{camps})
}))

//*******************Adding new Campground******************
router.get('/new',isLoggedIn,(req,res) => {
	res.render('./campgrounds/new')
})
	//**********submitting new campground form****************
router.post('/',isLoggedIn, validateCampground,catchAsync( async (req,res,next) => {
	const campground = new Campground(req.body.campground)
	campground.author = req.user._id
	await campground.save();
	req.flash('success','Successfully made a new campground')
	res.redirect(`/campgrounds/${campground._id}`)
}))

//******************Edit page******************
router.get('/:id/edit',isLoggedIn,catchAsync(async (req,res) => {
	const campground = await Campground.findById(req.params.id)
	if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
	res.render('./campgrounds/edit',{campground})
}))
	//******************submitting Edit page form******************
router.put('/:id',isLoggedIn,validateCampground,catchAsync(async (req,res) => {
	const { id } = req.params;
	const campground = await Campground.findById(id)
	if(!campground.author.equals(req.user._id)){
		req.flash('error','You do not have persmission to do that!');
		return res.redirect(`/campgrounds/${id}`);
	}
	const camp = await Campground.findByIdAndUpdate(id, {...req.body.campground})
	req.flash('success', 'Successfully updated campground!');
	res.redirect(`/campgrounds/${campground._id}`)
}))

//******************Show page for specific Campground******************
router.get('/:id',catchAsync(async (req,res) => {
	const campground = await Campground.findById(req.params.id).populate({path:'reviews',populate:{path:'author'}}).populate('author');
	console.log(campground)
	if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
	res.render('./campgrounds/show',{campground})
}))

//******************Delete Route for specific campground******************
router.delete('/:id',isLoggedIn,catchAsync(async (req,res) => {
	const { id } = req.params;
	await Campground.findByIdAndDelete(id);
	req.flash('success', 'Successfully deleted campground')
	res.redirect('/campgrounds');

}))

module.exports = router;