const Campground = require('../models/campgrounds');
const Review = require('../models/review');

module.exports.createReview = async (req,res) => {
    try {
        const { id } = req.params;
	const campground = await Campground.findById(id);
	const review = new Review(req.body.review);
	review.author = req.user._id;
	campground.reviews.push(review);
	await review.save();
	await campground.save();
	res.redirect(`/campgrounds/${campground._id}`);
    } catch(err) {
        next(err)
    }		
}

module.exports.deleteReview = async (req,res) => {
    try{
        const {id,reviewId} = req.params;
	await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
	await Review.findByIdAndDelete(reviewId)
	res.redirect(`/campgrounds/${id}`);
    } catch(err) {
        next(err)
    }
	
}