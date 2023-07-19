const express = require('express');
const { protect, reStrictTo } = require('../controllers/authController');
const {
  getAllReviews,
  createReview,
} = require('../controllers/reviewController');

const router = express.Router();

router.route('/').get(protect, getAllReviews).post(protect, reStrictTo('user'), createReview);

module.exports = router;
