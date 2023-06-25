const mongoose = require('mongoose');

// create Schema
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, 'A tour must have a name'],
    unique: true,
  },
  duration: {
    type: Number, 
    require: [true, 'A tour must have a duration']
  },
  maxGroupSize: {
    type: Number,
    require: [true, 'A tour must have a group size']
  },
  difficulty: {
    type: String,
    require: [true, 'A tour must have a difficulty']
  },
  ratingsAverage: {
    type: Number,
    default: 4.5
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    require: [true, 'A tour must have a price'],
  },
  priceDiscount: Number,
  summary: {
    type: String,
    // trim only work for String value
    trim: true,
    require: [true, 'A tour must have a description']
  },
  description: {
    type: String,
    trim: true
  },
  imageCover: {
    type: String,
    require: [true, 'A tour must have a cover image']
  },
  // because we have multiple images and we want to save this images as an Array of String, just define like this [String]
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  },
  // the tour can be start in diffent date 
  startDates: [Date]

});

//create Modal
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
