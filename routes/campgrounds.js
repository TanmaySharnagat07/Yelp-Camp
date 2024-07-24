const express = require("express");
const router = express.Router();
const CampGround = require("../models/campground");
const catchAsync = require("../utils/catchAsync");
const { campgroundSchema } = require("../schemaJoi");
const { isLoggedIn, isAuthor, validateCG } = require("../middleware");
const campgrounds = require("../controllers/campgrounds");
const { storage } = require("../cloudinary/index");
const multer = require("multer");
const upload = multer({ storage });

router
  .route("/")
  .get(catchAsync(campgrounds.index))
  .post(
    isLoggedIn,
    upload.array("image"),
    validateCG,
    catchAsync(campgrounds.createCampground)
  );

router.get("/new", isLoggedIn, catchAsync(campgrounds.renderNewForm));

router
  .route("/:id")
  .get(catchAsync(campgrounds.showCampground))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validateCG,
    catchAsync(campgrounds.updateCampground)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.renderEditForm)
);

module.exports = router;
