const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  filename: String,
  url: String,
});

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});

// To include virtual properties in an instance of the model we need to do

const opts = { toJSON: { virtuals: true } };

const campGroundSchema = new Schema(
  {
    title: String,
    price: Number,
    description: String,
    location: String,
    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    images: [ImageSchema],
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  opts
);

campGroundSchema.virtual("properties.popUpMarkup").get(function () {
  return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
    <p>${this.description.substring(0, 20)}</p>
  `
});

campGroundSchema.post("findOneAndDelete", async function (campground) {
  if (campground.reviews.length) {
    const res = await Review.deleteMany({ _id: { $in: campground.reviews } });
    console.log(res);
  }
});

module.exports = mongoose.model("CampGround", campGroundSchema);
