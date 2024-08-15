const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  //Send response
  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});

exports.getUser = async (req, res) => {
  res.status(500).json({
    status: "error",
    message: "Not defined yet",
  });
};

exports.createUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "Not defined yet",
  });
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "Not defined yet",
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "Not defined yet",
  });
};

exports.updateMe = catchAsync(async (req, res, next) => {
  //1 Create error if user posts password data
  //2 update user document
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  //1 Check login status
});
