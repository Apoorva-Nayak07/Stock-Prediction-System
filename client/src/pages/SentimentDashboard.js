import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaNewspaper, FaTwitter, FaChartBar } from 'react-icons/fa';
import { sentimentAPI } from '../services/api';
import toast from 'react-hot-toast';

const SentimentDashboard = () => {
  const [symbol, setSymbol] = useState('');
  const [sentiment, setSentiment] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!symbol) return;

    setLoading(true);
    try {
      const response = await sentimentAPI.analyzeSentiment(symbol.toUpperCase());
      setSentiment(response.data.data);
      toast.success('Sentiment analysis complete!');
    } catch (error) {
      toast.error('Failed to analyze sentiment');
    } finally {
      setLoading(false);
    }
  };

  const getSentimentColor = (score) => {
    if (score > 0.3) return 'text-green-500';
    if (score < -0.3) return 'text-red-500';
    return 'text-yellow-500';
  };

  const getSentimentBg = (score) => {
    if (score > 0.3) return 'bg-green-500/20';
    if (score < -0.3) return 'bg-red-500/20';
    return 'bg-yellow-500/20';
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold mb-2 flex items-center">
          <FaChartBar className="mr-3 text-blue-500" />
          Sentiment Analysis
        </h1>
        <p className="text-gray-400">AI-powered market sentiment from news and social media</p>
      </motion.div>

      {/* Search Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass p-6 rounded-xl mb-8"
      >
        <form onSubmit={handleAnalyze} className="flex gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              placeholder="Enter stock symbol (e.g., AAPL, TSLA)"
              className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 transition text-lg"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !symbol}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition disabled:opacity-50"
          >
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </form>
      </motion.div>

      {sentiment && (
        <>
          {/* Sentiment Score */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            <div className={`glass p-6 rounded-xl ${getSentimentBg(sentiment.score)}`}>
              <p className="text-gray-400 text-sm mb-2">Overall Sentiment</p>
              <p className={`text-3xl font-bold uppercase ${getSentimentColor(sentiment.score)}`}>
                {sentiment.sentiment}
              </p>
            </div>
            <div className="glass p-6 rounded-xl">
              <p className="text-gray-400 text-sm mb-2">Sentiment Score</p>
              <p className={`text-3xl font-bold ${getSentimentColor(sentiment.score)}`}>
                {sentiment.score.toFixed(3)}
              </p>
            </div>
            <div className="glass p-6 rounded-xl">
              <p className="text-gray-400 text-sm mb-2">Confidence</p>
              <p className="text-3xl font-bold text-blue-500">{sentiment.confidence}%</p>
            </div>
            <div className="glass p-6 rounded-xl">
              <p className="text-gray-400 text-sm mb-2">Sources Analyzed</p>
              <p className="text-3xl font-bold">{sentiment.metrics.newsCount}</p>
            </div>
          </motion.div>

          {/* Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass p-6 rounded-xl mb-8"
          >
            <h2 className="text-2xl font-bold mb-4">AI Summary</h2>
            <p className="text-gray-300 leading-relaxed">{sentiment.summary}</p>
          </motion.div>

          {/* Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass p-6 rounded-xl mb-8"
          >
            <h2 className="text-2xl font-bold mb-4">Sentiment Breakdown</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-green-500/10 rounded-lg">
                <p className="text-green-500 text-3xl font-bold">{sentiment.metrics.positiveCount}</p>
                <p className="text-gray-400 mt-2">Positive</p>
              </div>
              <div className="text-center p-4 bg-yellow-500/10 rounded-lg">
                <p className="text-yellow-500 text-3xl font-bold">{sentiment.metrics.neutralCount}</p>
                <p className="text-gray-400 mt-2">Neutral</p>
              </div>
              <div className="text-center p-4 bg-red-500/10 rounded-lg">
                <p className="text-red-500 text-3xl font-bold">{sentiment.metrics.negativeCount}</p>
                <p className="text-gray-400 mt-2">Negative</p>
              </div>
            </div>
          </motion.div>

          {/* News Sources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass p-6 rounded-xl"
          >
            <h2 className="text-2xl font-bold mb-4">Recent News & Sources</h2>
            <div className="space-y-4">
              {sentiment.sources.map((source, index) => (
                <div key={index} className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {source.type === 'news' && <FaNewspaper className="text-blue-500" />}
                      {source.type === 'twitter' && <FaTwitter className="text-blue-400" />}
                      <span className="text-sm text-gray-400 uppercase">{source.type}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      source.score > 0 ? 'bg-green-500/20 text-green-500' :
                      source.score < 0 ? 'bg-red-500/20 text-red-500' :
                      'bg-yellow-500/20 text-yellow-500'
                    }`}>
                      {source.score.toFixed(2)}
                    </span>
                  </div>
                  <h3 className="font-semibold mb-2">{source.title}</h3>
                  <p className="text-sm text-gray-400 mb-2">{source.content}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(source.publishedAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}

      {!sentiment && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass p-12 rounded-xl text-center"
        >
          <FaChartBar className="text-6xl text-blue-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">Enter a stock symbol to analyze sentiment</h3>
          <p className="text-gray-400">
            We'll analyze news, social media, and financial reports to gauge market sentiment
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default SentimentDashboard;
