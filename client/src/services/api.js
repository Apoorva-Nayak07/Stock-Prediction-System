import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// Stock API
export const stockAPI = {
  getStocks: () => api.get('/stocks'),
  getStock: (symbol) => api.get(`/stocks/${symbol}`),
  getStockHistory: (symbol, period) => api.get(`/stocks/${symbol}/history?period=${period}`),
  getMarketMovers: () => api.get('/stocks/market/movers'),
  searchStocks: (query) => api.get(`/stocks/search/${query}`),
};

// Prediction API
export const predictionAPI = {
  getPredictions: (symbol) => api.get(`/predictions/${symbol}`),
  getLatestPrediction: (symbol) => api.get(`/predictions/${symbol}/latest`),
  generatePrediction: (symbol) => api.post(`/predictions/${symbol}`),
};

// Sentiment API
export const sentimentAPI = {
  getSentiment: (symbol) => api.get(`/sentiment/${symbol}`),
  getSentimentHistory: (symbol) => api.get(`/sentiment/${symbol}/history`),
  analyzeSentiment: (symbol) => api.post(`/sentiment/${symbol}`),
};

// Portfolio API
export const portfolioAPI = {
  getPortfolio: () => api.get('/portfolio'),
  addToPortfolio: (data) => api.post('/portfolio', data),
  removeFromPortfolio: (id) => api.delete(`/portfolio/${id}`),
};

// Watchlist API
export const watchlistAPI = {
  getWatchlist: () => api.get('/watchlist'),
  addToWatchlist: (symbol) => api.post('/watchlist', { symbol }),
  removeFromWatchlist: (symbol) => api.delete(`/watchlist/${symbol}`),
};

// User API
export const userAPI = {
  updateProfile: (data) => api.put('/user/profile', data),
  updatePreferences: (data) => api.put('/user/preferences', data),
};

export default api;
