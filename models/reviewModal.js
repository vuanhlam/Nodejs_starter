/* eslint-disable prefer-arrow-callback */
// review : rating, createdAt, ref to Tour, ref to User,

const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      require: [true, 'Review can not be empty'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      require: [true, 'Review must belong to a tour.'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      require: [true, 'Review must belong to a user.'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//* This Middleware will extract the Object Id to the corresponding data with that ID
//TODO: this one will going to add some extra query, in this case acually two query
//TODO: behind the sence mongoose will have to query both the tour and user to find the matching document ID
reviewSchema.pre(/^find/, function (next) {
  // this.populate({
  //     path: 'tour',
  //     select: 'name'
  // }).populate({
  //     path: 'user',
  //     select: 'name photo'
  // })

  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

// storing a summary of a related datasets on the main datasets is actually a very popular technique in data modaling
// that i have not mention yet, this technique can actually be really helpful in order to prevent constent query
// => so our application is a great example of this technique is to store the average rating and the number of rating on each tour
// => so we don't have to query the review and calculate that average each time that we query for all the tour

reviewSchema.statics.calcAverageratings = async function (tourId) {
  //* So in the statics method like this, keyword this points to the current model
  //* because we need to always call aggregate on the Model directly like Review.aggregate
  //* that is why we using a statics method here
  const stats = await this.aggregate([
    // select all the review that belong to the current tour
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: 'tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  await Tour.findByIdAndUpdate(tourId, {
    ratingsQuantity: stats[0].nRating,
    ratingsAverage: stats[0].avgRating
  })
};

//TODO: post Middleware does not access to next
// Why do not use pre save Middleware, because we can not query the document that have not yet persited in the database
// and so that we dont have data to aggregate 
reviewSchema.post('save', function () {
  //* in this function, the this keyword points to the current document will be save => review
  /**
   ** this -> is a current document
   ** constructor is the model who created that document
   ** this.constructor -> Review model
   */
  this.constructor.calcAverageratings(this.tour);
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
