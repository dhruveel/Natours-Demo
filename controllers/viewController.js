const Tour = require("./../models/tourModel");
const catchAsync = require("../utils/catchAsync");

exports.getOverview = catchAsync(async (req, res) => {
  //1 Get data from collection
  const tours = await Tour.find();
  //2 Build template

  //3Render template using tour data id

  //Send Response
  res.status(200).render("overview", {
    title: "All Tours",
    tours,
  });
});

exports.getTour = catchAsync(async (req, res) => {
  //1 get the data for tour including reviews and guides

  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: "reviews",
    fields: "review rating user",
  });

  //2 build template

  //3 render template using data from id

  res.status(200).render("tour", {
    title: "All Tours",
    tour,
  });
});

exports.getLogin = (req, res) => {
  res.status(200).render("loginView", {
    title: " Log in into your account",
  });
};

exports.getSignup = catchAsync(async (req, res) => {});
