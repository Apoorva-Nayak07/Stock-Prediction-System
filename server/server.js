const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const { errorHandler } = require('./middleware/errorHandler');
const logger = require('./utils/logger');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/stocks', require('./routes/stocks'));
app.use('/api/portfolio', require('./routes/portfolio'));
app.use('/api/predictions', require('./routes/predictions'));
app.use('/api/sentiment', require('./routes/sentiment'));
app.use('/api/watchlist', require('./routes/watchlist'));
app.use('/api/user', require('./routes/user'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error Handler Middleware
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  console.log(`🚀 Server running on port ${PORT}`);
});

// Socket.IO Setup
const io = require('socket.io')(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('subscribe', (symbol) => {
    socket.join(symbol);
    console.log(`Client ${socket.id} subscribed to ${symbol}`);
  });

  socket.on('unsubscribe', (symbol) => {
    socket.leave(symbol);
    console.log(`Client ${socket.id} unsubscribed from ${symbol}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Make io accessible to routes
app.set('io', io);

// Real-time stock updates (simulated)
const stockService = require('./services/stockService');
setInterval(async () => {
  try {
    const updates = await stockService.getMarketUpdates();
    io.emit('market-update', updates);
  } catch (error) {
    logger.error('Error broadcasting market updates:', error);
  }
}, 5000);

module.exports = { app, io };
