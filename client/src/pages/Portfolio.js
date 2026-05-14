import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaBriefcase, FaPlus, FaTrash, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { portfolioAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    symbol: '',
    quantity: '',
    buyPrice: ''
  });

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const response = await portfolioAPI.getPortfolio();
      setPortfolio(response.data.data.portfolio);
      setSummary(response.data.data.summary);
    } catch (error) {
      toast.error('Failed to fetch portfolio');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStock = async (e) => {
    e.preventDefault();
    try {
      await portfolioAPI.addToPortfolio({
        symbol: formData.symbol.toUpperCase(),
        quantity: parseFloat(formData.quantity),
        buyPrice: parseFloat(formData.buyPrice)
      });
      toast.success('Stock added to portfolio!');
      setShowAddModal(false);
      setFormData({ symbol: '', quantity: '', buyPrice: '' });
      fetchPortfolio();
    } catch (error) {
      toast.error('Failed to add stock');
    }
  };

  const handleRemoveStock = async (id) => {
    if (!window.confirm('Are you sure you want to remove this stock?')) return;
    
    try {
      await portfolioAPI.removeFromPortfolio(id);
      toast.success('Stock removed from portfolio');
      fetchPortfolio();
    } catch (error) {
      toast.error('Failed to remove stock');
    }
  };

  const pieData = portfolio.length > 0 ? {
    labels: portfolio.map(item => item.symbol),
    datasets: [{
      data: portfolio.map(item => item.currentValue),
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(168, 85, 247, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(236, 72, 153, 0.8)',
      ],
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 2
    }]
  } : null;

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#fff',
          padding: 15
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

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex justify-between items-center"
      >
        <div>
          <h1 className="text-4xl font-bold mb-2 flex items-center">
            <FaBriefcase className="mr-3 text-blue-500" />
            Portfolio Analytics
          </h1>
          <p className="text-gray-400">Track and manage your investments</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition flex items-center space-x-2"
        >
          <FaPlus />
          <span>Add Stock</span>
        </button>
      </motion.div>

      {summary && (
        <>
          {/* Summary Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            <div className="glass p-6 rounded-xl">
              <p className="text-gray-400 text-sm mb-2">Total Invested</p>
              <p className="text-3xl font-bold">${summary.totalInvested.toFixed(2)}</p>
            </div>
            <div className="glass p-6 rounded-xl">
              <p className="text-gray-400 text-sm mb-2">Current Value</p>
              <p className="text-3xl font-bold text-blue-500">${summary.totalCurrent.toFixed(2)}</p>
            </div>
            <div className="glass p-6 rounded-xl">
              <p className="text-gray-400 text-sm mb-2">Total P&L</p>
              <p className={`text-3xl font-bold flex items-center ${
                summary.totalProfitLoss >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {summary.totalProfitLoss >= 0 ? <FaArrowUp className="mr-2" /> : <FaArrowDown className="mr-2" />}
                ${Math.abs(summary.totalProfitLoss).toFixed(2)}
              </p>
            </div>
            <div className="glass p-6 rounded-xl">
              <p className="text-gray-400 text-sm mb-2">Return %</p>
              <p className={`text-3xl font-bold ${
                summary.totalProfitLossPercent >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {summary.totalProfitLossPercent >= 0 ? '+' : ''}{summary.totalProfitLossPercent.toFixed(2)}%
              </p>
            </div>
          </motion.div>

          {/* Portfolio Allocation */}
          {pieData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass p-6 rounded-xl mb-8"
            >
              <h2 className="text-2xl font-bold mb-4">Portfolio Allocation</h2>
              <div className="h-80">
                <Pie data={pieData} options={pieOptions} />
              </div>
            </motion.div>
          )}

          {/* Holdings Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass p-6 rounded-xl"
          >
            <h2 className="text-2xl font-bold mb-4">Holdings</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4">Symbol</th>
                    <th className="text-right py-3 px-4">Quantity</th>
                    <th className="text-right py-3 px-4">Buy Price</th>
                    <th className="text-right py-3 px-4">Current Price</th>
                    <th className="text-right py-3 px-4">Invested</th>
                    <th className="text-right py-3 px-4">Current Value</th>
                    <th className="text-right py-3 px-4">P&L</th>
                    <th className="text-right py-3 px-4">P&L %</th>
                    <th className="text-right py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolio.map((item) => (
                    <tr key={item._id} className="border-b border-white/5 hover:bg-white/5 transition">
                      <td className="py-4 px-4 font-bold">{item.symbol}</td>
                      <td className="text-right py-4 px-4">{item.quantity}</td>
                      <td className="text-right py-4 px-4">${item.buyPrice.toFixed(2)}</td>
                      <td className="text-right py-4 px-4">${item.currentPrice.toFixed(2)}</td>
                      <td className="text-right py-4 px-4">${item.investedValue.toFixed(2)}</td>
                      <td className="text-right py-4 px-4">${item.currentValue.toFixed(2)}</td>
                      <td className={`text-right py-4 px-4 font-semibold ${
                        item.profitLoss >= 0 ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {item.profitLoss >= 0 ? '+' : ''}${item.profitLoss.toFixed(2)}
                      </td>
                      <td className={`text-right py-4 px-4 font-semibold ${
                        item.profitLossPercent >= 0 ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {item.profitLossPercent >= 0 ? '+' : ''}{item.profitLossPercent.toFixed(2)}%
                      </td>
                      <td className="text-right py-4 px-4">
                        <button
                          onClick={() => handleRemoveStock(item._id)}
                          className="text-red-500 hover:text-red-400 transition"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </>
      )}

      {portfolio.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass p-12 rounded-xl text-center"
        >
          <FaBriefcase className="text-6xl text-blue-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">Your portfolio is empty</h3>
          <p className="text-gray-400 mb-6">Start adding stocks to track your investments</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition"
          >
            Add Your First Stock
          </button>
        </motion.div>
      )}

      {/* Add Stock Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass p-8 rounded-2xl max-w-md w-full"
          >
            <h2 className="text-2xl font-bold mb-6">Add Stock to Portfolio</h2>
            <form onSubmit={handleAddStock} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Stock Symbol</label>
                <input
                  type="text"
                  value={formData.symbol}
                  onChange={(e) => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 transition"
                  placeholder="e.g., AAPL"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Quantity</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 transition"
                  placeholder="e.g., 10"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Buy Price</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.buyPrice}
                  onChange={(e) => setFormData({ ...formData, buyPrice: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 transition"
                  placeholder="e.g., 150.00"
                  required
                />
              </div>
              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-3 bg-white/5 rounded-lg hover:bg-white/10 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition"
                >
                  Add Stock
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;
