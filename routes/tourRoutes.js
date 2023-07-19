const express = require('express');
const {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
} = require('../controllers/tourController');
const { protect, reStrictTo } = require('../controllers/authController');
const { createReview } = require('../controllers/reviewController');

const router = express.Router();

router.route('/tour-stats').get(getTourStats);

router.route('/monthly-plan/:year').get(getMonthlyPlan);

router.route('/top-5-cheap').get(aliasTopTours, getAllTours);

router.route('/').get(protect, getAllTours).post(createTour);

router
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(protect, reStrictTo('admin', 'lead-guide'), deleteTour);

// POST -> /tour/1213323/reviews
// GET -> /tour/121sd32/reviews
// GET -> /tour/323m23mm/reviews/1dwkw232

router.route('/:tourId/reviews').post(protect, reStrictTo('user'), createReview)

module.exports = router;
