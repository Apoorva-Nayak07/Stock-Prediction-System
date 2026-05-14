const axios = require('axios');
const Stock = require('../models/Stock');

// Popular stocks for demo
const POPULAR_STOCKS = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corporation' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.' },
  { symbol: 'TSLA', name: 'Tesla Inc.' },
  { symbol: 'META', name: 'Meta Platforms Inc.' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation' },
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.' },
  { symbol: 'V', name: 'Visa Inc.' },
  { symbol: 'WMT', name: 'Walmart Inc.' }
];

// Simulate stock data (for MVP without external API)
const generateMockStockData = (symbol, name) => {
  const basePrice = Math.random() * 500 + 50;
  const change = (Math.random() - 0.5) * 20;
  const changePercent = (change / basePrice) * 100;

  return {
    symbol,
    name,
    price: parseFloat(basePrice.toFixed(2)),
    change: parseFloat(change.toFixed(2)),
    changePercent: parseFloat(changePercent.toFixed(2)),
    volume: Math.floor(Math.random() * 10000000) + 1000000,
    marketCap: Math.floor(Math.random() * 1000000000000) + 100000000000,
    high: parseFloat((basePrice + Math.random() * 10).toFixed(2)),
    low: parseFloat((basePrice - Math.random() * 10).toFixed(2)),
    open: parseFloat((basePrice + (Math.random() - 0.5) * 5).toFixed(2)),
    previousClose: parseFloat((basePrice - change).toFixed(2)),
    lastUpdated: new Date()
  };
};

// Fetch stock data
exports.fetchStockData = async (symbol) => {
  try {
    // Check if stock exists in database
    let stock = await Stock.findOne({ symbol: symbol.toUpperCase() });

    if (stock) {
      // Update if data is older than 5 minutes
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      if (stock.lastUpdated < fiveMinutesAgo) {
        const stockInfo = POPULAR_STOCKS.find(s => s.symbol === symbol.toUpperCase());
        const mockData = generateMockStockData(
          symbol.toUpperCase(),
          stockInfo ? stockInfo.name : `${symbol.toUpperCase()} Company`
        );
        stock = await Stock.findOneAndUpdate(
          { symbol: symbol.toUpperCase() },
          mockData,
          { new: true }
        );
      }
    } else {
      // Create new stock entry
      const stockInfo = POPULAR_STOCKS.find(s => s.symbol === symbol.toUpperCase());
      const mockData = generateMockStockData(
        symbol.toUpperCase(),
        stockInfo ? stockInfo.name : `${symbol.toUpperCase()} Company`
      );
      stock = await Stock.create(mockData);
    }

    return stock;
  } catch (error) {
    throw new Error(`Error fetching stock data: ${error.message}`);
  }
};

// Get stock history
exports.getStockHistory = async (symbol, period = '1M') => {
  try {
    // Generate mock historical data
    const days = period === '1D' ? 1 : period === '1W' ? 7 : period === '1M' ? 30 : period === '3M' ? 90 : 365;
    const history = [];
    const basePrice = Math.random() * 500 + 50;

    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const variance = (Math.random() - 0.5) * 20;
      const price = basePrice + variance;

      history.push({
        date: date.toISOString(),
        open: parseFloat((price + (Math.random() - 0.5) * 5).toFixed(2)),
        high: parseFloat((price + Math.random() * 10).toFixed(2)),
        low: parseFloat((price - Math.random() * 10).toFixed(2)),
        close: parseFloat(price.toFixed(2)),
        volume: Math.floor(Math.random() * 10000000) + 1000000
      });
    }

    return history;
  } catch (error) {
    throw new Error(`Error fetching stock history: ${error.message}`);
  }
};

// Get market movers
exports.getMarketMovers = async () => {
  try {
    const stocks = await Stock.find().sort('-changePercent').limit(10);

    if (stocks.length === 0) {
      // Initialize with popular stocks
      for (const stockInfo of POPULAR_STOCKS) {
        await this.fetchStockData(stockInfo.symbol);
      }
      return await Stock.find().sort('-changePercent').limit(10);
    }

    return {
      gainers: stocks.filter(s => s.changePercent > 0).slice(0, 5),
      losers: stocks.filter(s => s.changePercent < 0).slice(0, 5)
    };
  } catch (error) {
    throw new Error(`Error fetching market movers: ${error.message}`);
  }
};

// Get market updates for real-time broadcasting
exports.getMarketUpdates = async () => {
  try {
    const stocks = await Stock.find().limit(20);
    const updates = stocks.map(stock => ({
      symbol: stock.symbol,
      price: stock.price + (Math.random() - 0.5) * 2,
      change: (Math.random() - 0.5) * 2,
      timestamp: new Date()
    }));

    return updates;
  } catch (error) {
    return [];
  }
};
