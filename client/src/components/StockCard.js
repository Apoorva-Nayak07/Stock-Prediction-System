import React from 'react';
import { motion } from 'framer-motion';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const StockCard = ({ stock }) => {
  const isPositive = stock.changePercent >= 0;

  return (
    <Link to={`/stock/${stock.symbol}`}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="glass p-6 rounded-xl card-hover cursor-pointer"
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold">{stock.symbol}</h3>
            <p className="text-sm text-gray-400">{stock.name}</p>
          </div>
          <div className={`flex items-center space-x-1 px-3 py-1 rounded-full ${
            isPositive ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
          }`}>
            {isPositive ? <FaArrowUp /> : <FaArrowDown />}
            <span className="text-sm font-semibold">
              {Math.abs(stock.changePercent).toFixed(2)}%
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-400">Price</span>
            <span className="text-2xl font-bold">${stock.price.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Change</span>
            <span className={isPositive ? 'text-green-500' : 'text-red-500'}>
              {isPositive ? '+' : ''}{stock.change.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Volume</span>
            <span>{(stock.volume / 1000000).toFixed(2)}M</span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default StockCard;
