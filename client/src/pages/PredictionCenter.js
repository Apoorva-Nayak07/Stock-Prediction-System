import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaBrain, FaSearch, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { predictionAPI, stockAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const PredictionCenter = () => {
  const [symbol, setSymbol] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const handlePredict = async (e) => {
    e.preventDefault();
    if (!symbol) return;

    setLoading(true);
    try {
      const [predRes, histRes] = await Promise.all([
        predictionAPI.generatePrediction(symbol.toUpperCase()),
        stockAPI.getStockHistory(symbol.toUpperCase(), '1M')
      ]);

      setPrediction(predRes.data.data);
      setHistory(histRes.data.data);
      toast.success('Prediction generated successfully!');
    } catch (error) {
      toast.error('Failed to generate prediction');
    } finally {
      setLoading(false);
    }
  };

  const chartData = history.length > 0 ? {
    labels: history.map(d => new Date(d.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Historical Price',
        data: history.map(d => d.close),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      },
      prediction && {
        label: 'Predicted Price',
        data: [...Array(history.length - 1).fill(null), history[history.length - 1].close, prediction.predictedPrice],
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        borderDash: [5, 5],
        fill: false,
        tension: 0.4
      }
    ].filter(Boolean)
  } : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: '#fff'
        }
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

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold mb-2 flex items-center">
          <FaBrain className="mr-3 text-purple-500" />
          AI Prediction Center
        </h1>
        <p className="text-gray-400">Advanced ML-powered stock price predictions</p>
      </motion.div>

      {/* Search Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass p-6 rounded-xl mb-8"
      >
        <form onSubmit={handlePredict} className="flex gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              placeholder="Enter stock symbol (e.g., AAPL, GOOGL)"
              className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 transition text-lg"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !symbol}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition disabled:opacity-50"
          >
            {loading ? 'Analyzing...' : 'Predict'}
          </button>
        </form>
      </motion.div>

      {prediction && (
        <>
          {/* Prediction Results */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <div className="glass p-6 rounded-xl">
              <p className="text-gray-400 text-sm mb-2">Current Price</p>
              <p className="text-3xl font-bold">${prediction.currentPrice}</p>
            </div>
            <div className="glass p-6 rounded-xl">
              <p className="text-gray-400 text-sm mb-2">Predicted Price</p>
              <p className="text-3xl font-bold text-purple-500">${prediction.predictedPrice}</p>
            </div>
            <div className="glass p-6 rounded-xl">
              <p className="text-gray-400 text-sm mb-2">Expected Change</p>
              <p className={`text-3xl font-bold flex items-center ${
                prediction.priceChangePercent >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {prediction.priceChangePercent >= 0 ? <FaArrowUp className="mr-2" /> : <FaArrowDown className="mr-2" />}
                {Math.abs(prediction.priceChangePercent).toFixed(2)}%
              </p>
            </div>
            <div className="glass p-6 rounded-xl">
              <p className="text-gray-400 text-sm mb-2">Confidence</p>
              <p className="text-3xl font-bold text-blue-500">{prediction.confidence}%</p>
            </div>
          </motion.div>

          {/* Trend Analysis */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass p-6 rounded-xl mb-8"
          >
            <h2 className="text-2xl font-bold mb-4">Trend Analysis</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <p className="text-gray-400 mb-2">Trend</p>
                <p className={`text-2xl font-bold uppercase ${
                  prediction.trend === 'bullish' ? 'text-green-500' :
                  prediction.trend === 'bearish' ? 'text-red-500' : 'text-yellow-500'
                }`}>
                  {prediction.trend}
                </p>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <p className="text-gray-400 mb-2">Model Used</p>
                <p className="text-2xl font-bold">{prediction.model}</p>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <p className="text-gray-400 mb-2">Prediction Date</p>
                <p className="text-lg font-bold">
                  {new Date(prediction.predictionDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Chart */}
          {chartData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass p-6 rounded-xl"
            >
              <h2 className="text-2xl font-bold mb-4">Price Prediction Chart</h2>
              <div className="h-96">
                <Line data={chartData} options={chartOptions} />
              </div>
            </motion.div>
          )}
        </>
      )}

      {!prediction && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass p-12 rounded-xl text-center"
        >
          <FaBrain className="text-6xl text-purple-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">Enter a stock symbol to get started</h3>
          <p className="text-gray-400">
            Our AI will analyze historical data and generate price predictions
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default PredictionCenter;
