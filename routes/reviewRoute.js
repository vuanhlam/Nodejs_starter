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
 *! which actually come from the orther router before.
 */
const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(authController.protect, getAllReviews)
  .post(
    authController.protect,
    authController.reStrictTo('user'),
    setTourUserIds,
    createReview
  );

router.route('/:id').get(getReview).patch(updateReview).delete(deleteReview);

module.exports = router;
