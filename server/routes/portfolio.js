const express = require('express');
const router = express.Router();
const {
  getPortfolio,
  addToPortfolio,
  removeFromPortfolio
} = require('../controllers/portfolioController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getPortfolio)
  .post(addToPortfolio);

router.delete('/:id', removeFromPortfolio);

module.exports = router;
