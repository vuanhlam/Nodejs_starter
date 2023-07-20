const express = require('express');
const { protect, reStrictTo } = require('../controllers/authController');
const {
  getAllReviews,
  createReview,
  deleteReview,
} = require('../controllers/reviewController');

/**
 *! with the support of mergeParams we then can access to the tourId
 *! which actually come from the orther router before.
 */
const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(protect, getAllReviews)
  .post(protect, reStrictTo('user'), createReview);

router.route('/:id').delete(deleteReview);

module.exports = router;
