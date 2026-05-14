const Stock = require('../models/Stock');
const stockService = require('../services/stockService');

// @desc    Get all stocks
// @route   GET /api/stocks
// @access  Public
exports.getStocks = async (req, res) => {
  try {
    const stocks = await Stock.find().sort('-lastUpdated').limit(50);
    res.json({
      success: true,
      count: stocks.length,
      data: stocks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single stock
// @route   GET /api/stocks/:symbol
// @access  Public
exports.getStock = async (req, res) => {
  try {
    const { symbol } = req.params;
    let stock = await Stock.findOne({ symbol: symbol.toUpperCase() });

    if (!stock) {
      // Fetch from external API
      stock = await stockService.fetchStockData(symbol);
    }

    res.json({
      success: true,
      data: stock
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get stock history
// @route   GET /api/stocks/:symbol/history
// @access  Public
exports.getStockHistory = async (req, res) => {
  try {
    const { symbol } = req.params;
    const { period = '1M' } = req.query;

    const history = await stockService.getStockHistory(symbol, period);

    res.json({
      success: true,
      data: history
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get market movers
// @route   GET /api/stocks/market/movers
// @access  Public
exports.getMarketMovers = async (req, res) => {
  try {
    const movers = await stockService.getMarketMovers();
    res.json({
      success: true,
      data: movers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Search stocks
// @route   GET /api/stocks/search/:query
// @access  Public
exports.searchStocks = async (req, res) => {
  try {
    const { query } = req.params;
    const stocks = await Stock.find({
      $or: [
        { symbol: { $regex: query, $options: 'i' } },
        { name: { $regex: query, $options: 'i' } }
      ]
    }).limit(10);

    res.json({
      success: true,
      data: stocks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
