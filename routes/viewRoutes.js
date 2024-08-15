const express = require("express");
const router = express.Router();

const viewsController = require("./../controllers/viewController");

router.get("/", viewsController.getOverview);
router.get("/overview", viewsController.getOverview);
//router.get("/tour", viewsController.getTour);
router.get("/tour/:slug", viewsController.getTour);

router.get("/signup", viewsController.getSignup);
router.get("/login", viewsController.getLogin);

module.exports = router;
