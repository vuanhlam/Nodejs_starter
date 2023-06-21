const Tour = require('./../models/tourModel');

exports.getAllTours = (req, res) => {
  // res.status(200).json({
  //   status: 'success',
  //   requestAt: req.requestTime,
  //   results: tours.length,
  //   data: {
  //     tours: tours,
  //   },
  // });
};

exports.createTour = async (req, res) => {
  try {

    // ---create tour old way---
    // const newTour = new Tour({});
    // newTour.save()  // this version call method save() from the document 

    // ---create tour new way---
    const newTour = await Tour.create(req.body);  // this version call directly Model, and return a Promise

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
        message: 'Invalid data sent',
    });
  }
};

exports.getTour = (req, res) => {
  // const id = req.params.id * 1;
  // const tour = tours.find((item) => item.id === id);
  // res.status(200).json({
  //   status: 'success',
  //   data: {
  //     tours: tour,
  //   },
  // });
};

exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here....>',
    },
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
