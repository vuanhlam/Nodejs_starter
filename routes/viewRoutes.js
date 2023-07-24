const express = require('express');
const { getOverview, getTour } = require('../controllers/viewsController');

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).render('base');
});

router.get('/', getOverview);

router.get('/tour', getTour);

module.exports = router;
