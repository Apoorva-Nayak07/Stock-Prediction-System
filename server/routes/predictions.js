const express = require('express');
const router = express.Router();
const {
  getPredictions,
  generatePrediction,
  getLatestPrediction
} = require('../controllers/predictionController');
const { protect } = require('../middleware/auth');

router.get('/:symbol', getPredictions);
router.get('/:symbol/latest', getLatestPrediction);
router.post('/:symbol', protect, generatePrediction);

module.exports = router;
