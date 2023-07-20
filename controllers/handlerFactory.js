const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

//* JavaScript Closure
exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const document = await Model.findByIdAndDelete(req.params.id);

    if (!document) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    // whenever we use findByIdAnUpdate all the save Middleware is not run
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      //* with this option the function will return the new object that currently updated
      new: true,
      //* each time we update a certain document
      //* then the validator that we specify in the schema will run again
      runValidators: true,
    });

    if (!document) {
      //* return immediately and not move on to the next line
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: document,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    // ---create tour old way---
    // const newTour = new Tour({});
    // newTour.save()  // this version call method save() from the document

    // ---create tour new way---
    const document = await Model.create(req.body); // this version call directly Model, and return a Promise

    // response to client
    res.status(201).json({
      status: 'success',
      data: {
        data: document,
      },
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    /**
     *! - findById is just a shorthand or a helper function,
     *! - we don't need to write like this => { _id: req.params.id }
     *! - but behind the sence it's gonna do exactly this  Tour.findOne({ _id: req.params.id })
     *! - but mongoose simply want to make our life esier
     */
    let query = Model.findById(req.params.id);

    if (popOptions) query = query.populate(popOptions);

    const document = await query;
    // Tour.findOne({ _id: req.params.id })  // -- this method is the same as above function

    if (!document) {
      //* return immediately and not move on to the next line
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: document,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // To allow for nested GET reviews on tour (hack)
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId }; // get all document depend on the id

    // ---- EXECUTE QUERY ----
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const document = await features.mongooseQuery.explain();

    // ---- SEND RESPONSE ----
    res.status(200).json({
      status: 'success',
      requestAt: req.requestTime,
      results: document.length,
      data: {
        data: document,
      },
    });
  });
