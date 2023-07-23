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
  getTourWithin,
} = require('../controllers/tourController');
const authController = require('../controllers/authController');
const reviewRouter = require('./reviewRoute');

const router = express.Router();

// POST /tour/as12121s/reviews
// GET /tour/32323k233/reviews => get all review about this tour
// POST /reviews

// router.route('/:tourId/reviews').post(protect, reStrictTo('user'), createReview)

//* whenever find the url like this => /:tourId/reviews then just use reviewRouter
//* this URL will be redirected to the reviewRoute also with the param :tourId
router.use('/:tourId/reviews', reviewRouter);

router.route('/tour-stats').get(getTourStats);

router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.reStrictTo('admin', 'lead-guide', 'guide'),
    getMonthlyPlan
  );

router.route('/tours-distance/:distance/center/:latlng/unit/:unit').get(getTourWithin)
// we also can use query String to specify the url like: /tour-distance?distance=233&center=-40,45&unit=mi

router.route('/top-5-cheap').get(aliasTopTours, getAllTours);

router
  .route('/')
  .get(getAllTours)
  .post(
    authController.protect,
    authController.reStrictTo('admin', 'lead-guide'),
    createTour
  );

router
  .route('/:id')
  .get(getTour)
  .patch(
    authController.protect,
    authController.reStrictTo('admin', 'lead-guide'),
    updateTour
  )
  .delete(
    authController.protect,
    authController.reStrictTo('admin', 'lead-guide'),
    deleteTour
  );

// POST -> /tour/1213323/reviews
// GET -> /tour/121sd32/reviews
// GET -> /tour/323m23mm/reviews/1dwkw232

module.exports = router;
