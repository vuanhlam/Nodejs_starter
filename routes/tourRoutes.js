const express = require('express');
const {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  checkID,
  checkBody
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

/**
 *! Create  a checkBody  middleware 
 *! check if body contains the name  and price  property
 *! if not send back 400 (bad request) basically is invalid request from the client 
*/

router.route('/')
  .get(getAllTours)
  /**
   *! this is called chaining middleware  
   *! when we have a post request for route /
   *! it will then run middleware checkBody first and then createTour
   *! 
  */
  .post(checkBody, createTour);

router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
