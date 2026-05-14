const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Stock = require('../models/Stock');
const { protect } = require('../middleware/auth');

// Get watchlist
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const watchlist = await Promise.all(
      user.watchlist.map(async (item) => {
        const stock = await Stock.findOne({ symbol: item.symbol });
        return {
          ...item.toObject(),
          stockData: stock
        };
      })
    );

    res.json({
      success: true,
      data: watchlist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Add to watchlist
router.post('/', protect, async (req, res) => {
  try {
    const { symbol } = req.body;
    const user = await User.findById(req.user.id);

    // Check if already in watchlist
    const exists = user.watchlist.find(item => item.symbol === symbol.toUpperCase());
    if (exists) {
      return res.status(400).json({
        success: false,
        message: 'Stock already in watchlist'
      });
    }

    user.watchlist.push({ symbol: symbol.toUpperCase() });
    await user.save();

    res.json({
      success: true,
      data: user.watchlist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Remove from watchlist
router.delete('/:symbol', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.watchlist = user.watchlist.filter(
      item => item.symbol !== req.params.symbol.toUpperCase()
    );

    await user.save();

    res.json({
      success: true,
      data: user.watchlist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
