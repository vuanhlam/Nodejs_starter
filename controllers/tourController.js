/* eslint-disable node/no-unsupported-features/es-syntax */
/* eslint-disable no-unused-expressions */
/* eslint-disable import/no-useless-path-segments */
const Tour = require('./../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name, price, ratingsAverage, summary, difficulty';
  next();
};

exports.getAllTours = factory.getAll(Tour);

exports.getTour = factory.getOne(Tour, 'reviews');

exports.createTour = factory.createOne(Tour);

exports.updateTour = factory.updateOne(Tour);

exports.deleteTour = factory.deleteOne(Tour);

/**
 *! Mongoose DB aggregation pipeline for data aggregation
 ** the idea is that we will define the pipeline that all the documents from a certain
 ** collection go through where they are process step by step in order to tranform them in to aggregated results
 *! ex: min, max, average ...
 */

exports.getTourStats = catchAsync(async (req, res, next) => {
  /**
   *! aggregation pipeline is a mongoose features
   *! using the a aggregation pipeline is just a bit like doing a regular query
   ** the different here is that the aggregation can manipulate data in a couple of different step
   ** define the step by pass an Array call as stages
   ** in that stages have a lot of stages then the documents pass through this stages one by one, step by step, in defined sequences as we defined in the Array. ⬇️
   ** => each element in the Array will be one of the stage
   */
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' }, // group result for different field
        //_id: '$ratingsAverage',
        numTours: { $sum: 1 }, //for each of documents that go through the pipeline 1 will be added to this numTours counter
        numRatings: { $sum: '$ratingsQuantity' },
        avgrating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: {
        avgPrice: 1,
      },
    },
    // repeat stage
    // {
    //   $match: { _id: { $ne: 'EASY' } },
    // },
  ]);

  res.status(200).json({
    status: 'success',
    data: stats,
  });
});

// count how many tour they are for each of the month in a given year
exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;

  const plan = await Tour.aggregate([
    {
      //! Deconstructs an array field from the input documents to output a document for each element.
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        //! $month Returns the month for a date as a number between 1 and 12
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      /**
       *! simply give each of the field name a 0 or 1
       */
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numTourStarts: -1 },
    },

    {
      //! only 6 documents will be return
      $limit: 6,
    },
  ]);

  res.status(200).json({
    status: 'success',
    total: plan.length,
    data: {
      plan,
    },
  });
});
