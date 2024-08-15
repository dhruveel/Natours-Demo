const fs = require("fs");

const Review = require("./../models/reviewModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

// exports.getReview = catchAsync(async (req, res, next) => {
//   let filter = { tour: req.params.id };
//   //  if (req.params.tourId) filter = { tour: req.params.tourId };

//   const review = await Review.find({ tour: req.params.id });

//   //const review = await Review.findById(req.params.id);

//   console.log(Review);
//   console.log(filter);
//   console.log(req.params.id);
//   console.log(review);
//   if (!review) {
//     return next(new AppError("No review Found with the id", 404));
//   }

//   res.status(200).json({
//     status: "success",
//     results: review.length,
//     data: {
//       review,
//     },
//   });
// });

exports.getReview = catchAsync(async (req, res, next) => {
  const reviews = await Review.find({ tour: req.params.id }).populate({
    path: "tour",
    select: "name description",
  });

  console.log(Review);
  console.log(req.params.id);
  console.log(reviews);

  if (!reviews || reviews.length === 0) {
    return next(new AppError("No reviews found for this tour", 404));
  }

  res.status(200).json({
    status: "success",
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };

  const review = await Review.find(filter);

  if (!review) {
    return next(new AppError("No review Found", 404));
  }

  res.status(200).json({
    status: "success",
    results: review.length,
    data: {
      review,
    },
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  //Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  const review = await Review.create(req.body);

  res.status(201).json({
    status: "success",
    results: review.length,
    data: {
      review,
    },
  });
});
