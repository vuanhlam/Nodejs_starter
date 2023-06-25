/* eslint-disable no-unused-expressions */
/* eslint-disable import/no-useless-path-segments */
const Tour = require('./../models/tourModel');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name, price, ratingsAverage, summary, difficulty';
  next();
};

exports.getAllTours = async (req, res) => {
  try {
    // ---- BUILD QUERY ----
    // 1.A) Filtering
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const queryObj = { ...req.query };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach((el) => delete queryObj[el]);

    // 1.A) Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // console.log(JSON.parse(queryStr));

    let query = Tour.find(JSON.parse(queryStr));

    // 2. Sorting
    if (req.query.sort) {
      console.log('in sort');
      const sortFields = req.query.sort.split(',').join(' ');
      // console.log(sortFields);
      query = query.sort(sortFields);
    } else {
      query = query.sort('-createdAt');
    }

    // 3. Limit Fields sent back to client
    if (req.query.fields) {
      console.log('in fields');
      const limitFields = req.query.fields.split(',').join(' ');
      query = query.select(limitFields);
    } else {
      query = query.select('-__v');
    }

    // 4. Pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const countTours = await Tour.countDocuments();
      if (skip >= countTours) throw new Error('This page is not exist');
    }

    // ---- EXECUTE QUERY ----
    const tours = await query;

    // ---- SEND RESPONSE ----
    res.status(200).json({
      status: 'success',
      requestAt: req.requestTime,
      results: tours.length,
      data: {
        tours: tours,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    // ---create tour old way---
    // const newTour = new Tour({});
    // newTour.save()  // this version call method save() from the document

    // ---create tour new way---
    const newTour = await Tour.create(req.body); // this version call directly Model, and return a Promise

    // response to client
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    /**
     *! - findById is just a shorthand or a helper function,
     *! - we don't need to write like this => { _id: req.params.id }
     *! - but behind the sence it's gonna do exactly this  Tour.findOne({ _id: req.params.id })
     *! - but mongoose simply want to male our life esier
     */
    const tour = await Tour.findById(req.params.id);
    // Tour.findOne({ _id: req.params.id })  // -- this method is the same as above function

    res.status(200).json({
      status: 'success',
      data: {
        tours: tour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      // with this option the function will return the new object that currently updated
      new: true,
      // each time we update a certain document
      //then the validator that we specify in the schema will run again
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        tour: tour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    res.status(204).json({
      status: 'success',
      message: 'delete fail',
    });
  }
};
