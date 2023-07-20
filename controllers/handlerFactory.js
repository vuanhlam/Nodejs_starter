const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

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
