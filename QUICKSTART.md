# 🚀 Quick Start Guide

Get the AI Stock Market Platform running in 5 minutes!

---

## Prerequisites

- Node.js 18+ installed
- Python 3.11+ installed
- MongoDB running (or use MongoDB Atlas)

---

## Installation

### 1. Clone & Install
```bash
# Clone repository
git clone <repository-url>
cd ai-stock-platform

# Install all dependencies
npm run install-all
```

### 2. Setup Environment
```bash
# Copy environment files
cp .env.example .env
cp client/.env.example client/.env
cp server/.env.example server/.env
cp ai-service/.env.example ai-service/.env
```

### 3. Configure MongoDB

**Option A: Local MongoDB**
```bash
# Start MongoDB
mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Create free account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env` and `server/.env`

### 4. Start Application
```bash
# Start all services
npm run dev
```

---

## Access the Platform

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **AI Service**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

---

## First Steps

1. **Register Account**
   - Go to http://localhost:3000
   - Click "Get Started"
   - Fill registration form

2. **Explore Dashboard**
   - View market overview
   - Check top gainers/losers
   - Browse stock cards

3. **Try AI Features**
   - **Predictions**: Enter stock symbol (e.g., AAPL) to get AI price prediction
   - **Sentiment**: Analyze market sentiment from news and social media
   - **Portfolio**: Add stocks to track your investments
   - **Watchlist**: Save favorite stocks

---

## Default Test Data

The platform includes mock data for testing:
- Popular stocks: AAPL, GOOGL, MSFT, AMZN, TSLA, META, NVDA
- Real-time price updates (simulated)
- AI predictions with confidence scores
- Sentiment analysis from multiple sources

---

## Troubleshooting

### MongoDB Connection Error
```bash
# Check if MongoDB is running
mongosh

# If not running, start it:
# Windows: net start MongoDB
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

### Port Already in Use
```bash
# Kill process on port 3000
# Windows: netstat -ano | findstr :3000
# macOS/Linux: lsof -ti:3000 | xargs kill -9
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

## Next Steps

- Read [SETUP_GUIDE.md](docs/SETUP_GUIDE.md) for detailed setup
- Check [API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md) for API reference
- See [DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md) for production deployment

---

## Need Help?

- 📖 Check `/docs` folder for detailed guides
- 🐛 Report issues on GitHub
- 💬 Join our community Discord
- 📧 Email: support@aistockplatform.com

---

**Happy Trading! 📈**
