const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
    uppercase: true
  },
  currentPrice: {
    type: Number,
    required: true
  },
  predictedPrice: {
    type: Number,
    required: true
  },
  predictionDate: {
    type: Date,
    required: true
  },
  confidence: {
    type: Number,
    min: 0,
    max: 100
  },
  trend: {
    type: String,
    enum: ['bullish', 'bearish', 'neutral']
  },
  model: {
    type: String,
    default: 'LSTM'
  },
  features: {
    volatility: Number,
    momentum: Number,
    volume: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Prediction', predictionSchema);
