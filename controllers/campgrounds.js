const CampGround = require("../models/campground");
const { cloudinary } = require("../cloudinary");
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY; 

module.exports.index = async function (req, res) {
  const campgrounds = await CampGround.find({});
  res.render("campgrounds/index", { campgrounds });
};

module.exports.renderNewForm = function (req, res) {
  res.render("campgrounds/new");
};

module.exports.createCampground = async function (req, res, next) {
  const geoData = await maptilerClient.geocoding.forward(
    req.body.campground.location,
    { limit: 1 }
  );
  console.log(geoData.features[0].geometry);
  const camp = new CampGround(req.body.campground);
  camp.geometry = geoData.features[0].geometry;
  camp.author = req.user._id;
  camp.images = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  await camp.save();
  console.log(camp);
  req.flash("success", "Campground created successfully");
  res.redirect(`/campgrounds/${camp._id}`);
};

module.exports.showCampground = async function (req, res) {
  const { id } = req.params;
  const campground = await CampGround.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  // console.log(campground);
  if (!campground) {
    req.flash("error", "Campground not found");
    return res.redirect("/campgrounds");
  }
  // console.log(campground);
  res.render("campgrounds/show", { campground });
};

module.exports.renderEditForm = async function (req, res) {
  const { id } = req.params;
  const campground = await CampGround.findById(id);
  if (!campground) {
    req.flash("error", "Campground not found");
    return res.redirect("/campgrounds");
  }

  res.render("campgrounds/edit", { campground });
};

module.exports.updateCampground = async function (req, res) {
  const { id } = req.params;
  const updatedCamp = await CampGround.findByIdAndUpdate(
    id,
    { ...req.body.campground },
    { new: true }
  );
  const geoData = await maptilerClient.geocoding.forward(
    req.body.campground.location,
    { limit: 1 }
  );
  updatedCamp.geometry = geoData.features[0].geometry;
  const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  updatedCamp.images.push(...imgs);
  await updatedCamp.save();
  // to delete images from the mongoDB
  if (req.body.deleteImages) {
    for(let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await updatedCamp.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  //
  req.flash("success", "Campground updated successfully");
  res.redirect(`/campgrounds/${updatedCamp._id}`);
};

module.exports.deleteCampground = async function (req, res) {
  const { id } = req.params;
  await CampGround.findByIdAndDelete(id);
  res.redirect("/campgrounds");
};
