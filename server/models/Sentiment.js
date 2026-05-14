const mongoose = require('mongoose');

const sentimentSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
    uppercase: true
  },
  score: {
    type: Number,
    required: true,
    min: -1,
    max: 1
  },
  sentiment: {
    type: String,
    enum: ['positive', 'negative', 'neutral'],
    required: true
  },
  sources: [{
    type: {
      type: String,
      enum: ['news', 'twitter', 'reddit', 'financial']
    },
    title: String,
    content: String,
    url: String,
    score: Number,
    publishedAt: Date
  }],
  summary: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Sentiment', sentimentSchema);
