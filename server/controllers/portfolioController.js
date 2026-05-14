const User = require('../models/User');
const Stock = require('../models/Stock');

// @desc    Get user portfolio
// @route   GET /api/portfolio
// @access  Private
exports.getPortfolio = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const portfolio = user.portfolio;

    // Enrich portfolio with current stock data
    const enrichedPortfolio = await Promise.all(
      portfolio.map(async (item) => {
        const stock = await Stock.findOne({ symbol: item.symbol });
        const currentValue = stock ? stock.price * item.quantity : 0;
        const investedValue = item.buyPrice * item.quantity;
        const profitLoss = currentValue - investedValue;
        const profitLossPercent = (profitLoss / investedValue) * 100;

        return {
          ...item.toObject(),
          currentPrice: stock ? stock.price : 0,
          currentValue,
          investedValue,
          profitLoss,
          profitLossPercent
        };
      })
    );

    const totalInvested = enrichedPortfolio.reduce((sum, item) => sum + item.investedValue, 0);
    const totalCurrent = enrichedPortfolio.reduce((sum, item) => sum + item.currentValue, 0);
    const totalProfitLoss = totalCurrent - totalInvested;
    const totalProfitLossPercent = (totalProfitLoss / totalInvested) * 100;

    res.json({
      success: true,
      data: {
        portfolio: enrichedPortfolio,
        summary: {
          totalInvested,
          totalCurrent,
          totalProfitLoss,
          totalProfitLossPercent
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add stock to portfolio
// @route   POST /api/portfolio
// @access  Private
exports.addToPortfolio = async (req, res) => {
  try {
    const { symbol, quantity, buyPrice } = req.body;

    const user = await User.findById(req.user.id);
    user.portfolio.push({
      symbol: symbol.toUpperCase(),
      quantity,
      buyPrice,
      buyDate: new Date()
    });

    await user.save();

    res.json({
      success: true,
      data: user.portfolio
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Remove stock from portfolio
// @route   DELETE /api/portfolio/:id
// @access  Private
exports.removeFromPortfolio = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.portfolio = user.portfolio.filter(
      item => item._id.toString() !== req.params.id
    );

    await user.save();

    res.json({
      success: true,
      data: user.portfolio
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
