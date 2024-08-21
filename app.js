const path = require("path");
const express = require("express");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xssClean = require("xss-clean");
const hpp = require("hpp");

const compression = require("compression");

const morgan = require("morgan");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const viewRouter = require("./routes/viewRoutes");

const app = express();

app.set("view engine", "pug"); //Sets view engine
app.set("views", path.join(__dirname, "views"));
//Global Middlewares

// Serving static files

//app.use(express.static(path.join(__dirname, "starter/public")));

//app.use(express.static(path.join(__dirname, "/public")));
app.use("/public", express.static(__dirname + "/public"));

//Set security http headers
app.use(helmet());

//Development mode
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Apply rate limiter for requests per minute
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: " Too many requests from IP, please try again in an hour",
});

app.use("/api", limiter);

//Body parser reading data

app.use(express.json({ limit: "10kb" }));

//Data sanitization against NOSQL

app.use(mongoSanitize());

//Data sanitzation against XSS

app.use(
  xssClean({
    whitelist: [
      "duration",
      "ratingsAverage",
      "ratingsQuantity",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);

//Sanitize Parameter pollution
app.use(hpp());

app.use(compression());

//Middleware ends

//Routes

app.use("/", viewRouter);
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);

//Routes end

app.all("*", (req, res, next) => {
  // const err = new Error(`Can't find ${req.originalUrl} on this server`);
  // err.status = "fail";
  // err.statusCode = 404;

  next(new AppError(`Can't find ${req.originalUrl} on this server`), 404);
});

app.use(globalErrorHandler);

//Start the server
module.exports = app;
