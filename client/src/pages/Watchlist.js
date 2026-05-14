import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaPlus, FaTrash } from 'react-icons/fa';
import { watchlistAPI } from '../services/api';
import StockCard from '../components/StockCard';
import toast from 'react-hot-toast';

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [symbol, setSymbol] = useState('');

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const fetchWatchlist = async () => {
    try {
      const response = await watchlistAPI.getWatchlist();
      setWatchlist(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch watchlist');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStock = async (e) => {
    e.preventDefault();
    try {
      await watchlistAPI.addToWatchlist(symbol.toUpperCase());
      toast.success('Stock added to watchlist!');
      setShowAddModal(false);
      setSymbol('');
      fetchWatchlist();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add stock');
    }
  };

  const handleRemoveStock = async (stockSymbol) => {
    if (!window.confirm('Remove this stock from watchlist?')) return;
    
    try {
      await watchlistAPI.removeFromWatchlist(stockSymbol);
      toast.success('Stock removed from watchlist');
      fetchWatchlist();
    } catch (error) {
      toast.error('Failed to remove stock');
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
            <FaHeart className="mr-3 text-red-500" />
            Watchlist
          </h1>
          <p className="text-gray-400">Track your favorite stocks</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition flex items-center space-x-2"
        >
          <FaPlus />
          <span>Add Stock</span>
        </button>
      </motion.div>

      {watchlist.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {watchlist.map((item) => (
            <div key={item.symbol} className="relative">
              <StockCard stock={item.stockData} />
              <button
                onClick={() => handleRemoveStock(item.symbol)}
                className="absolute top-4 right-4 p-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass p-12 rounded-xl text-center"
        >
          <FaHeart className="text-6xl text-red-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">Your watchlist is empty</h3>
          <p className="text-gray-400 mb-6">Add stocks to keep track of their performance</p>
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
            <h2 className="text-2xl font-bold mb-6">Add to Watchlist</h2>
            <form onSubmit={handleAddStock} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Stock Symbol</label>
                <input
                  type="text"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 transition"
                  placeholder="e.g., AAPL, GOOGL, TSLA"
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

export default Watchlist;
