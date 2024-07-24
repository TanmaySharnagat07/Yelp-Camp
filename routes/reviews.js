const express = require("express");
const router = express.Router({mergeParams: true});
const CampGround = require("../models/campground");
const Review = require("../models/review");
const catchAsync = require("../utils/catchAsync");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware")
const reviews = require("../controllers/reviews")
// To add new reviews to the campground
router.post(
  "/",
  validateReview,
  isLoggedIn,
  catchAsync(reviews.createReview)
);

// to delete reviews of a campground
router.delete(
  "/:reviewId",
  isReviewAuthor,
  catchAsync(reviews.deleteReview)
);

module.exports = router;
