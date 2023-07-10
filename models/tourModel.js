/* eslint-disable prefer-arrow-callback */
const mongoose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator');

// create Schema
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, 'A tour must have a name'], 
      unique: true,
      maxLength: [40, 'A tour name must have less or equal than 40 characters'], // maxLength and minLength only work for String value
      minLength: [10, 'A tour name must have more or equal than 10 characters'],
      //validate: [validator.isAlpha, 'Tour name must only contain characters'], // this is a validator package, we can use it to validate the data
    },
    slug: String,
    duration: {
      type: Number,
      require: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      require: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      require: [true, 'A tour must have a difficulty'],
      enum: {
        // enum only work for String value
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'], // min, max only work for Number and Date value
      max: [5, 'Rating must be below 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 4.5,
    },
    price: {
      type: Number,
      require: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // this must use function
          // this only point to current doc on NEW document creation
          // so this function not gonna work on update
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price',
      },
    },
    summary: {
      type: String,
      // trim only work for String value
      trim: true,
      require: [true, 'A tour must have a description'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      require: [true, 'A tour must have a cover image'],
    },
    // because we have multiple images and we want to save this images as an Array of String, just define like this [String]
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    // the tour can be start in diffent date
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/**
 *! Virtual Property is a property that not gonna be persisted or saved into the database
 *! because it's only calculated using some other value
 *! for example we have a duration in days, but we also want to have a duration in weeks
 *! so we can calculate the duration in weeks using the duration in days
 *! but we don't want to save the duration in weeks to the database
 *! because we can always calculate it from the duration in days
 *! so we can use virtual property to create a new property that not gonna be saved to the database
 ** Note: we can't use virtual property in query because it not part of the database
 */
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

/**
 *! just like Express, mongoose also have a concept of Middleware
 ** just like Express we can use mongoose's Middleware to make something happen between two events
 ** for example each time a new Document is saved to the database, we can run a function between the save command and actual saving of the document
 ** that why mongoose Middleware is also called pre and post hook
 *  TODO: because we can defined a function to run before or after a certain event like saving a document to the database
 ** so Middleware is the fundamental concept in mongoose just like Express
 *! There are four type of Middleware in mongoose
 *!  + Document  -> act on currently process document
 *!  + Query
 *!  + Aggregate
 *!  + Model
 */

// Define Middleware on the schema
/**
 *! this is pre Middleware, which is gonna run before an actual event
 *! callback function will be called before an actual document is saved to the database
 */
//* DOCUMENT MIDDLEWARE: runs before .save() and .create() and not work with .insertMany() and update()
//* just like in Express we also have next() func in mongoose Middleware basically to call the next Middleware in the stack
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

//* we can have multiple middleware pre or post Middleware for the same hook
// eslint-disable-next-line prefer-arrow-callback
// tourSchema.pre('save', function (next) {
//   console.log('Will save document');
//   next()
// })

//* post Middleware has access not only to next but also to the document that was just saved to the database
//* post Middleware function are executed after all the pre Middleware function have completed
// eslint-disable-next-line prefer-arrow-callback
// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next()
// })

/**
 *! Query Middleware allow us to run function before or after a certain "query" is executed
 */

//* pre find Hook basically a Middleware gonna run before any find() query
//* 'find' will point to the current query, not to the current document
// tourSchema.pre('find', function(next) { // pre find hook will not work for findOne
tourSchema.pre(/^find/, function (next) {
  // we will using regex to apply to all the event that start with name find
  //* this key word point to the query, so that we can chain another find() method
  this.find({ secretTour: { $ne: true } }); // filter the secretTour is false, mean hide the secretTour
  this.start = Date.now();
  next();
});

//* this Midleware only run after the Qeury have already executed
tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  // console.log(docs);
  next();
});

/**
 *! Aggregation Middleware allow us to run function before or after an aggregation happens
 */
tourSchema.pre('aggregate', function (next) {
  //* this key word point to the current aggregation object
  //* unshift() will add an element to the beginning of the array
  // console.log(this.pipeline());
  //* add new state to the beginning of the array of the pipeline
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

//create Modal
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
