const { promisify } = require("util");

const jwt = require("jsonwebtoken");

const catchAsync = require("../utils/catchAsync");
const User = require("./../models/userModel");

const AppError = require("./../utils/appError");
const sendEmail = require("./../utils/email");

const bcrypt = require("bcryptjs");

const crypto = require("crypto");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

//Function to create and send tokens
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    // secure: true,
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  //Store jwt into cookie
  res.cookie("jwt", token, cookieOptions);

  user.password = undefined; //Password don't show in response
  res.status(200).json({
    status: "success",
    token,
    data: { user },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
  });

  createSendToken(newUser, 201, res);
  // const token = signToken(newUser._id);

  // res.status(201).json({
  //   status: "success",
  //   token,
  //   data: {
  //     User: newUser,
  //   },
  // });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //1 Check if email and passsword exist
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  //2 Check if user exists && password is correct

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password"), 401);
  }

  //3 Everything ok. Send JWT

  createSendToken(user, 201, res);
  // const token = signToken(user._id);

  // console.log(user);
  // console.log(token);

  // res.status(200).json({
  //   status: "success",
  //   token,
  //   user,
  // });
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1 Getting the token and check if it's there

  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.toLowerCase().startsWith("bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    console.log(token);
  } else {
    console.log(req.headers);
    console.log("Invalid token");
  }

  // console.log(token);

  if (!token) {
    return next(
      new AppError("You are not logged in! Please login to access", 401)
    );
  }
  //2 Validate the token

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //3 Check if user still exists

  const freshUser = await User.findById(decoded.id);

  if (!freshUser) {
    return next(new AppError("The user does not exist", 401));
  }

  //4 Check if user changed passwords after the JWT issued

  if (!freshUser.changedPassword(decoded.iat)) {
    return next(new AppError("The password updated. Invalid token", 401));
  }

  //Grant access
  req.user = freshUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    //Roles is an array
    if (!roles.includes(req.user.role)) {
      return next(new AppError("Forbidden", 403));
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  //Get user based on POSTed Email
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError("No user found", 404));
  }

  //Generate random reset token

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  // send it to users email

  const resetURL = `${req.protocol}://${req.get(`host`)}/api/v1/users/resetPassword/${resetToken}`;

  const message = "Submit request with a new password";

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Token sent to email",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError("Problem occured", 500));
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  //1 Get User based token

  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  //2 If token has not expired, there is a user, set new password

  if (!user) {
    return next(new AppError("Token is invalid or expired", 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  //3 updated changedPasswordAt property for new user

  //4 Login the user Send JWT

  createSendToken(newUser, 201, res);
  // const token = signToken(user._id);

  // res.status(200).json({
  //   status: "success",
  //   token,
  // });
});
