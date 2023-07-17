/* eslint-disable import/no-useless-path-segments */
const User = require('./../models/userModal');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((item) => {
    if (allowedFields.includes(item)) {
      newObj[item] = obj[item];
    }
  });
  return newObj;
};

exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();

  // ---- SEND RESPONSE ----
  res.status(200).json({
    status: 'success',
    requestAt: req.requestTime,
    results: users.length,
    data: {
      users: users,
    },
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

exports.getAllUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

/**
 *! only have permission update name and email
 */
exports.updateMe = catchAsync(async (req, res, next) => { 
  //TODO (1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This route is not for password update.', 400));
  }

  //TODO (2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredObject = filterObj(req.body, 'name', 'email');

  //TODO (2) Update user document
  /**
   *! Since we not dealing with password, just only non-sensitive data like name or email
   *! we can now using findByIdAndUpdate
   */
  // const user = await User.findById(req.user.id);
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    filteredObject,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: 'success',
    data: {
      updatedUser,
    },
  });
});

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};
