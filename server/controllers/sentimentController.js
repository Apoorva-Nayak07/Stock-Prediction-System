const Sentiment = require('../models/Sentiment');
const axios = require('axios');

// @desc    Get sentiment for a stock
// @route   GET /api/sentiment/:symbol
// @access  Public
exports.getSentiment = async (req, res) => {
  try {
    const { symbol } = req.params;
    const sentiment = await Sentiment.findOne({ symbol: symbol.toUpperCase() })
      .sort('-createdAt');

    if (!sentiment) {
      return res.status(404).json({
        success: false,
        message: 'No sentiment data found for this stock'
      });
    }

    res.json({
      success: true,
      data: sentiment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Analyze sentiment for a stock
// @route   POST /api/sentiment/:symbol
// @access  Private
exports.analyzeSentiment = async (req, res) => {
  try {
    const { symbol } = req.params;
    const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';

    let sentimentData;
    let fromAI = false;

    // Try to call AI service for sentiment analysis
    try {
      const response = await axios.post(`${aiServiceUrl}/sentiment`, {
        symbol: symbol.toUpperCase()
      }, { timeout: 5000 });

      sentimentData = response.data;
      fromAI = true;
    } catch (aiError) {
      console.log('⚠️  AI service unavailable, using mock sentiment');
      
      // Generate mock sentiment
      const score = (Math.random() - 0.5) * 2;
      const sentiment = score > 0.3 ? 'positive' : score < -0.3 ? 'negative' : 'neutral';
      
      sentimentData = {
        symbol: symbol.toUpperCase(),
        score: parseFloat(score.toFixed(3)),
        sentiment: sentiment,
        sources: [
          {
            type: 'news',
            title: `${symbol} Shows Strong Market Performance`,
            content: `Analysts are ${sentiment} about ${symbol}'s future prospects.`,
            score: parseFloat((Math.random() - 0.5).toFixed(3)),
            publishedAt: new Date()
          },
          {
            type: 'financial',
            title: `Market Analysis: ${symbol}`,
            content: `Recent trends indicate ${sentiment} momentum for ${symbol}.`,
            score: parseFloat((Math.random() - 0.5).toFixed(3)),
            publishedAt: new Date()
          }
        ],
        summary: `Overall sentiment for ${symbol} is ${sentiment} with a score of ${score.toFixed(2)}.`,
        confidence: Math.floor(Math.random() * 20) + 70
      };
    }

    // Try to save to database with timeout
    let savedSentiment;
    try {
      savedSentiment = await Sentiment.create({
        symbol: symbol.toUpperCase(),
        score: sentimentData.score,
        sentiment: sentimentData.sentiment,
        sources: sentimentData.sources,
        summary: sentimentData.summary
      }).maxTimeMS(3000);
    } catch (dbError) {
      console.log('⚠️  Database unavailable, returning sentiment without saving');
      
      savedSentiment = {
        _id: 'temp-' + Date.now(),
        symbol: symbol.toUpperCase(),
        score: sentimentData.score,
        sentiment: sentimentData.sentiment,
        sources: sentimentData.sources,
        summary: sentimentData.summary,
        confidence: sentimentData.confidence,
        createdAt: new Date()
      };
    }

    res.json({
      success: true,
      data: savedSentiment,
      source: fromAI ? 'AI Service' : 'Mock Data',
      note: fromAI ? undefined : 'Using mock sentiment - AI service unavailable'
    });
  } catch (error) {
    console.error('Sentiment error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze sentiment: ' + error.message
    });
  }
};

// @desc    Get sentiment history
// @route   GET /api/sentiment/:symbol/history
// @access  Public
exports.getSentimentHistory = async (req, res) => {
  try {
    const { symbol } = req.params;
    const sentiments = await Sentiment.find({ symbol: symbol.toUpperCase() })
      .sort('-createdAt')
      .limit(30);

    res.json({
      success: true,
      data: sentiments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
