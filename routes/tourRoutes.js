const express = require('express');
const {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  checkID
} = require('./../controllers/tourController');

const router = express.Router();

/**
 *! Params Middleware is Middleware only run for certain parameter,
 *! basically when we have a certain parameter in the url like: /api/tours/:parameter
 */

/**
 *! in the param middleware function we acutally access to the fourth argument
 *! that one is the value of parameter  
*/
router.param('id', checkID);

router.route('/').get(getAllTours).post(createTour);

router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
