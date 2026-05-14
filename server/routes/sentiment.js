const express = require('express');
const router = express.Router();
const {
  getSentiment,
  analyzeSentiment,
  getSentimentHistory
} = require('../controllers/sentimentController');
const { protect } = require('../middleware/auth');

router.get('/:symbol', getSentiment);
router.get('/:symbol/history', getSentimentHistory);
router.post('/:symbol', protect, analyzeSentiment);

module.exports = router;
