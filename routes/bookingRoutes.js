/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get(
  '/checkout-session/:tourId',
  authController.protect,
  bookingController.getCheckoutSession
);

router.route('/createNew').post(bookingController.createBookingCheckout)

module.exports = router;
