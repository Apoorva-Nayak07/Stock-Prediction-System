import React from 'react';
import { motion } from 'framer-motion';
import { FaArrowUp, FaArrowDown, FaChartLine } from 'react-icons/fa';

const MarketOverview = ({ data }) => {
  const metrics = [
    {
      label: 'Market Cap',
      value: '$2.5T',
      change: '+2.3%',
      isPositive: true,
      icon: <FaChartLine />
    },
    {
      label: 'Volume',
      value: '125.4M',
      change: '+5.1%',
      isPositive: true,
      icon: <FaChartLine />
    },
    {
      label: 'Gainers',
      value: data?.gainers?.length || 0,
      change: 'Today',
      isPositive: true,
      icon: <FaArrowUp />
    },
    {
      label: 'Losers',
      value: data?.losers?.length || 0,
      change: 'Today',
      isPositive: false,
      icon: <FaArrowDown />
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metrics.map((metric, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="glass p-6 rounded-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400 text-sm">{metric.label}</span>
            <div className={`p-2 rounded-lg ${
              metric.isPositive ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
            }`}>
              {metric.icon}
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold">{metric.value}</p>
              <p className={`text-sm ${metric.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {metric.change}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default MarketOverview;
