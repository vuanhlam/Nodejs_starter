/* eslint-disable import/no-useless-path-segments */
const Tour = require('./../models/tourModel');

exports.getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find();
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
      runValidators: true
    })

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
