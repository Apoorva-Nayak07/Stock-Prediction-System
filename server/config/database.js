const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-stock-platform');

    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`MongoDB Connection Error: ${error.message}`);
    console.error(`⚠️  MongoDB not available: ${error.message}`);
    console.log(`⚠️  Running in demo mode with mock data`);
    console.log(`⚠️  To use full features, please start MongoDB:`);
    console.log(`   Windows: net start MongoDB`);
    console.log(`   macOS: brew services start mongodb-community`);
    console.log(`   Linux: sudo systemctl start mongod`);
    // Don't exit - continue with mock data
  }
};

module.exports = connectDB;
