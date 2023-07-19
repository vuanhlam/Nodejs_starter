/* eslint-disable import/no-useless-path-segments */
const Review = require('./../models/reviewModal');
const catchAsync = require('./../utils/catchAsync');

exports.createReview = catchAsync(async (req, res, next) => {
  const newReview = await Review.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      review: newReview,
    },
  });
});

exports.getAllReviews = catchAsync(async (req, res, next) => {
    const reviews = await Review.find();

    res.status(200).json({
        status: 'success',
        data: {
            total: reviews.length,
            reviews
        }
    })
});
