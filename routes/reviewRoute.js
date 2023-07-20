const express = require('express');
const authController = require('../controllers/authController');
const {
  getAllReviews,
  createReview,
  deleteReview,
  updateReview,
  setTourUserIds,
  getReview,
} = require('../controllers/reviewController');

/**
 *! with the support of mergeParams we then can access to the tourId
 *! which actually come from the tourRoute  before.
 */
const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route('/')
  .get(getAllReviews)
  .post(authController.reStrictTo('user'), setTourUserIds, createReview);

router
  .route('/:id')
  .get(getReview)
  .patch(authController.reStrictTo('user', 'admin'), updateReview)
  .delete(authController.reStrictTo('user', 'admin'), deleteReview);

module.exports = router;
