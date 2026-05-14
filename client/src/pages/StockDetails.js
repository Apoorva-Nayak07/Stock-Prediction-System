import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaArrowUp, FaArrowDown, FaHeart, FaPlus } from 'react-icons/fa';
import { stockAPI, predictionAPI, sentimentAPI } from '../services/api';
import { Line } from 'react-chartjs-2';
import toast from 'react-hot-toast';

const StockDetails = () => {
  const { symbol } = useParams();
  const [stock, setStock] = useState(null);
  const [history, setHistory] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [sentiment, setSentiment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('1M');

  useEffect(() => {
    fetchStockData();
  }, [symbol, period]);

  const fetchStockData = async () => {
    try {
      const [stockRes, historyRes] = await Promise.all([
        stockAPI.getStock(symbol),
        stockAPI.getStockHistory(symbol, period)
      ]);

      setStock(stockRes.data.data);
      setHistory(historyRes.data.data);

      // Fetch prediction and sentiment (optional)
      try {
        const predRes = await predictionAPI.getLatestPrediction(symbol);
        setPrediction(predRes.data.data);
      } catch (err) {
        console.log('No prediction available');
      }

      try {
        const sentRes = await sentimentAPI.getSentiment(symbol);
        setSentiment(sentRes.data.data);
      } catch (err) {
        console.log('No sentiment available');
      }
    } catch (error) {
      toast.error('Failed to fetch stock data');
    } finally {
      setLoading(false);
    }
  };

  const chartData = history.length > 0 ? {
    labels: history.map(d => new Date(d.date).toLocaleDateString()),
    datasets: [{
      label: 'Price',
      data: history.map(d => d.close),
      borderColor: stock?.changePercent >= 0 ? 'rgb(16, 185, 129)' : 'rgb(239, 68, 68)',
      backgroundColor: stock?.changePercent >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
      fill: true,
      tension: 0.4
    }]
  } : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#9ca3af'
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#9ca3af'
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!stock) {
    return (
      <div className="glass p-12 rounded-xl text-center">
        <h3 className="text-2xl font-bold mb-2">Stock not found</h3>
        <Link to="/dashboard" className="text-blue-500 hover:text-blue-400">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const isPositive = stock.changePercent >= 0;

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Link to="/dashboard" className="inline-flex items-center text-gray-400 hover:text-white mb-4 transition">
          <FaArrowLeft className="mr-2" />
          Back to Dashboard
        </Link>
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold mb-2">{stock.symbol}</h1>
            <p className="text-xl text-gray-400">{stock.name}</p>
          </div>
          <div className="flex space-x-3">
            <button className="px-4 py-2 glass rounded-lg hover:bg-white/10 transition">
              <FaHeart className="text-red-500" />
            </button>
            <button className="px-4 py-2 glass rounded-lg hover:bg-white/10 transition">
              <FaPlus />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Price Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass p-6 rounded-xl mb-8"
      >
        <div className="flex items-end justify-between">
          <div>
            <p className="text-5xl font-bold mb-2">${stock.price.toFixed(2)}</p>
            <div className={`flex items-center space-x-2 text-xl ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {isPositive ? <FaArrowUp /> : <FaArrowDown />}
              <span>{isPositive ? '+' : ''}{stock.change.toFixed(2)}</span>
              <span>({isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%)</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6 text-right">
            <div>
              <p className="text-gray-400 text-sm">High</p>
              <p className="text-xl font-semibold">${stock.high?.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Low</p>
              <p className="text-xl font-semibold">${stock.low?.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Volume</p>
              <p className="text-xl font-semibold">{(stock.volume / 1000000).toFixed(2)}M</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Market Cap</p>
              <p className="text-xl font-semibold">${(stock.marketCap / 1000000000).toFixed(2)}B</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass p-6 rounded-xl mb-8"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Price Chart</h2>
          <div className="flex space-x-2">
            {['1D', '1W', '1M', '3M', '1Y'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-2 rounded-lg transition ${
                  period === p
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600'
                    : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        {chartData && (
          <div className="h-96">
            <Line data={chartData} options={chartOptions} />
          </div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* AI Prediction */}
        {prediction && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass p-6 rounded-xl"
          >
            <h2 className="text-2xl font-bold mb-4">AI Prediction</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Predicted Price</span>
                <span className="text-xl font-bold text-purple-500">${prediction.predictedPrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Expected Change</span>
                <span className={`text-xl font-bold ${
                  prediction.priceChangePercent >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {prediction.priceChangePercent >= 0 ? '+' : ''}{prediction.priceChangePercent.toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Trend</span>
                <span className={`text-xl font-bold uppercase ${
                  prediction.trend === 'bullish' ? 'text-green-500' :
                  prediction.trend === 'bearish' ? 'text-red-500' : 'text-yellow-500'
                }`}>
                  {prediction.trend}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Confidence</span>
                <span className="text-xl font-bold text-blue-500">{prediction.confidence}%</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Sentiment */}
        {sentiment && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass p-6 rounded-xl"
          >
            <h2 className="text-2xl font-bold mb-4">Market Sentiment</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Overall Sentiment</span>
                <span className={`text-xl font-bold uppercase ${
                  sentiment.sentiment === 'positive' ? 'text-green-500' :
                  sentiment.sentiment === 'negative' ? 'text-red-500' : 'text-yellow-500'
                }`}>
                  {sentiment.sentiment}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Sentiment Score</span>
                <span className="text-xl font-bold">{sentiment.score.toFixed(3)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Sources Analyzed</span>
                <span className="text-xl font-bold">{sentiment.sources.length}</span>
              </div>
              <div className="pt-4">
                <p className="text-sm text-gray-400">{sentiment.summary}</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default StockDetails;
