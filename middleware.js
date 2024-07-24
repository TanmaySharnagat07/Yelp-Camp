const {campgroundSchema, reviewSchema} = require("./schemaJoi")
const ExpressError = require("./utils/ExpressError");
const CampGround = require("./models/campground");
const Review = require("./models/review");
module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.isLoggedIn = function(req, res, next){
    if(!req.isAuthenticated()){
        // console.log(req.originalUrl);
        req.session.returnTo = req.originalUrl;  // saves the URL before login page
        req.flash('error', 'You must be logged in to do that!');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateCG = (req, res, next) => {
  // server side validation using joi

  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await CampGround.findById(id);
  if (!campground.author.equals(req.user._id)) {
    req.flash("error", "You don't have permission to do that");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You don't have permission to do that");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
}

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

