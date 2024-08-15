const express = require("express");
const fs = require("fs");

const tourController = require("./../controllers/tourController");
const authController = require("./../controllers/authController");
//const reviewController = require("./../controllers/reviewController");

const reviewRouter = require("./../routes/reviewRoutes");

const router = express.Router();

// router.param("id", (req, res, next, val) => {
//   console.log(`Tour id is : ${val}`);
//   next();
// });

router.use("/:tourId/reviews", reviewRouter);

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../starter/dev-data/data/tours-simple.json`)
);

router.route("/tour-stats").get(tourController.getTourStats);

router.route("/monthly-plan/:year").get(tourController.getMonthlyPlan);

router
  .route("/top-5-cheap")
  .get(tourController.aliasTopTours, tourController.getAllTours);

router
  .route("/")
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    tourController.createTour
  );

router
  .route("/:id")
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    tourController.deleteTour
  );

module.exports = router;
