const mongoose = require("mongoose");
const CampGround = require("../models/campground");
const { places, descriptors } = require("./seedHelpers");
const cities = require("./cities");

mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await CampGround.deleteMany({});
  for (let i = 0; i < 190; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new CampGround({
      author: "669b6e09e7863559fd4e1534",
      title: `${sample(descriptors)} ${sample(places)}`,
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      price: price,
      description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut turpis nec velit sagittis vulputate. Donec ultricies libero sed `,
      images: [
        {
          filename: "YelpCamp/yhco7m3iv8fk6hueldr8",
          url: "https://res.cloudinary.com/myproject1camp/image/upload/v1721665536/YelpCamp/yhco7m3iv8fk6hueldr8.jpg",
        },
        {
          filename: "YelpCamp/ihv4s8mtpxnxcljg9rft",
          url: "https://res.cloudinary.com/myproject1camp/image/upload/v1721665540/YelpCamp/ihv4s8mtpxnxcljg9rft.png",
        },
      ],
      geometry: {
        type: "Point",
        coordinates: [cities[random1000].longitude, cities[random1000].latitude],
      },
    });
    await camp.save();
  }
};

seedDB();
