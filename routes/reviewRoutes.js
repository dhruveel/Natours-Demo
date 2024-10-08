const express = require("express");

const router = express.Router({ mergeParams: true });

const reviewController = require("./../controllers/reviewController");
const authController = require("./../controllers/authController");

router
  .route("/")
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo("User"),
    reviewController.createReview
  );

router.route("/:id").get(reviewController.getReview);

router
  .route("/:tourId/reviews")
  .post(
    authController.protect,
    authController.restrictTo("users"),
    reviewController.createReview
  );

module.exports = router;
