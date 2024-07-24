const CampGround = require("../models/campground");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
  // res.send("You made it !!");
  const campground = await CampGround.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  req.flash("success", "New Review added successfully!");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  const campground = await CampGround.findByIdAndUpdate(id, {
    $pull: { reviews: reviewId },
  });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review deleted successfully!");
  res.redirect(`/campgrounds/${id}`);
};
