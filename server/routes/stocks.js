const express = require('express');
const router = express.Router();
const {
  getStocks,
  getStock,
  getStockHistory,
  getMarketMovers,
  searchStocks
} = require('../controllers/stockController');

router.get('/', getStocks);
router.get('/market/movers', getMarketMovers);
router.get('/search/:query', searchStocks);
router.get('/:symbol', getStock);
router.get('/:symbol/history', getStockHistory);

module.exports = router;
