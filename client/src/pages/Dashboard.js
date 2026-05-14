import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { stockAPI } from '../services/api';
import StockCard from '../components/StockCard';
import MarketOverview from '../components/MarketOverview';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [stocks, setStocks] = useState([]);
  const [marketMovers, setMarketMovers] = useState({ gainers: [], losers: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [stocksRes, moversRes] = await Promise.all([
        stockAPI.getStocks(),
        stockAPI.getMarketMovers()
      ]);

      setStocks(stocksRes.data.data);
      setMarketMovers(moversRes.data.data);
    } catch (error) {
      toast.error('Failed to fetch market data');
    } finally {
      setLoading(false);
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
        className="mb-8"
      >
        <h1 className="text-4xl font-bold mb-2">Market Dashboard</h1>
        <p className="text-gray-400">Real-time stock market overview and analytics</p>
      </motion.div>

      <MarketOverview data={marketMovers} />

      {/* Top Gainers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <span className="w-1 h-8 bg-green-500 mr-3"></span>
          Top Gainers
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {marketMovers.gainers.slice(0, 5).map((stock) => (
            <StockCard key={stock.symbol} stock={stock} />
          ))}
        </div>
      </motion.div>

      {/* Top Losers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <span className="w-1 h-8 bg-red-500 mr-3"></span>
          Top Losers
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {marketMovers.losers.slice(0, 5).map((stock) => (
            <StockCard key={stock.symbol} stock={stock} />
          ))}
        </div>
      </motion.div>

      {/* All Stocks */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <span className="w-1 h-8 bg-blue-500 mr-3"></span>
          All Stocks
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {stocks.map((stock) => (
            <StockCard key={stock.symbol} stock={stock} />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
