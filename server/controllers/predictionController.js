const Prediction = require('../models/Prediction');
const axios = require('axios');

// @desc    Get predictions for a stock
// @route   GET /api/predictions/:symbol
// @access  Public
exports.getPredictions = async (req, res) => {
  try {
    const { symbol } = req.params;
    
    let predictions;
    try {
      predictions = await Prediction.find({ symbol: symbol.toUpperCase() })
        .sort('-createdAt')
        .limit(10)
        .maxTimeMS(3000);
    } catch (dbError) {
      console.log('⚠️  Database unavailable, returning empty predictions');
      predictions = [];
    }

    res.json({
      success: true,
      data: predictions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Generate new prediction
// @route   POST /api/predictions/:symbol
// @access  Private
exports.generatePrediction = async (req, res) => {
  try {
    const { symbol } = req.params;
    const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';

    let predictionData;
    let fromAI = false;

    // Try to call AI service for prediction
    try {
      const response = await axios.post(`${aiServiceUrl}/predict`, {
        symbol: symbol.toUpperCase()
      }, { timeout: 5000 });

      predictionData = response.data;
      fromAI = true;
    } catch (aiError) {
      console.log('⚠️  AI service unavailable, using mock prediction');
      
      // Generate mock prediction
      const currentPrice = Math.random() * 500 + 50;
      const change = (Math.random() - 0.5) * 50;
      const predictedPrice = currentPrice + change;
      
      predictionData = {
        symbol: symbol.toUpperCase(),
        currentPrice: parseFloat(currentPrice.toFixed(2)),
        predictedPrice: parseFloat(predictedPrice.toFixed(2)),
        confidence: Math.floor(Math.random() * 30) + 60,
        trend: predictedPrice > currentPrice ? 'bullish' : predictedPrice < currentPrice ? 'bearish' : 'neutral',
        model: 'LSTM',
        features: {
          volatility: parseFloat((Math.random() * 0.05).toFixed(4)),
          momentum: parseFloat((Math.random() - 0.5).toFixed(4)),
          volume: Math.floor(Math.random() * 10000000) + 1000000
        },
        priceChange: parseFloat((predictedPrice - currentPrice).toFixed(2)),
        priceChangePercent: parseFloat(((predictedPrice - currentPrice) / currentPrice * 100).toFixed(2))
      };
    }

    // Try to save to database with timeout
    let savedPrediction;
    try {
      savedPrediction = await Prediction.create({
        symbol: symbol.toUpperCase(),
        currentPrice: predictionData.currentPrice,
        predictedPrice: predictionData.predictedPrice,
        predictionDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        confidence: predictionData.confidence,
        trend: predictionData.trend,
        model: predictionData.model,
        features: predictionData.features
      }).maxTimeMS(3000);
    } catch (dbError) {
      console.log('⚠️  Database unavailable, returning prediction without saving');
      
      // Return prediction without saving to database
      savedPrediction = {
        _id: 'temp-' + Date.now(),
        symbol: symbol.toUpperCase(),
        currentPrice: predictionData.currentPrice,
        predictedPrice: predictionData.predictedPrice,
        predictionDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        confidence: predictionData.confidence,
        trend: predictionData.trend,
        model: predictionData.model,
        features: predictionData.features,
        priceChange: predictionData.priceChange || (predictionData.predictedPrice - predictionData.currentPrice),
        priceChangePercent: predictionData.priceChangePercent || ((predictionData.predictedPrice - predictionData.currentPrice) / predictionData.currentPrice * 100),
        createdAt: new Date()
      };
    }

    res.json({
      success: true,
      data: savedPrediction,
      source: fromAI ? 'AI Service' : 'Mock Data',
      note: fromAI ? undefined : 'Using mock prediction - AI service unavailable'
    });
  } catch (error) {
    console.error('Prediction error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to generate prediction: ' + error.message
    });
  }
};

// @desc    Get latest prediction
// @route   GET /api/predictions/:symbol/latest
// @access  Public
exports.getLatestPrediction = async (req, res) => {
  try {
    const { symbol } = req.params;
    
    let prediction;
    try {
      prediction = await Prediction.findOne({ symbol: symbol.toUpperCase() })
        .sort('-createdAt')
        .maxTimeMS(3000);
    } catch (dbError) {
      console.log('⚠️  Database unavailable');
      prediction = null;
    }

    if (!prediction) {
      return res.status(404).json({
        success: false,
        message: 'No predictions found for this stock. Generate a new prediction first.'
      });
    }

    res.json({
      success: true,
      data: prediction
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
