const mongoose = require('mongoose');
const slugify = require('slugify');

// create Schema
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, 'A tour must have a name'],
      unique: true,
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
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
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
    priceDiscount: Number,
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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

/**
 *! just like Express mongoose also have a concept of Middleware
 *! the first type of Middleware is called Document Middleware
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
//* DOCUMENT MIDDLEWARE: runs before .save() and .create() not .insertMany()
//* just like in Express we also have next() func in mongoose Middleware basically to call the next Middleware in the stack 
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

//* we can have multiple middleware pre or post Middleware for the same hook
// eslint-disable-next-line prefer-arrow-callback
tourSchema.pre('save', function (next) {
  console.log('Will save document');
  next()
})

//* post Middleware has access not only to next but also to the document that was just saved to the database 
//* post Middleware function are executed after all the pre Middleware function have completed
// eslint-disable-next-line prefer-arrow-callback
tourSchema.post('save', function (doc, next) {
  console.log(doc);
  next()
})

//create Modal
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
