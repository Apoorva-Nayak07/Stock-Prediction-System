# 🚀 AI Stock Market Prediction & Trading Intelligence Platform

A production-grade, enterprise-level fintech platform powered by AI/ML for stock market prediction, sentiment analysis, portfolio management, and real-time trading intelligence.

![Platform Preview](https://img.shields.io/badge/Status-Production%20Ready-success)
![License](https://img.shields.io/badge/License-MIT-blue)
![Node](https://img.shields.io/badge/Node-18+-green)
![Python](https://img.shields.io/badge/Python-3.11+-blue)
![React](https://img.shields.io/badge/React-18+-61dafb)

## ✨ Features

### 🤖 AI-Powered Predictions
- **LSTM Neural Networks** for time-series forecasting
- **Random Forest & XGBoost** ensemble models
- **Prophet** for trend analysis
- Real-time price predictions with confidence scores
- Bullish/Bearish trend detection

### 📊 Sentiment Analysis
- Multi-source sentiment aggregation (News, Twitter, Financial Reports)
- **FinBERT** transformer models for financial text analysis
- Real-time sentiment scoring (-1 to +1 scale)
- Source-level sentiment breakdown
- AI-generated market summaries

### 💼 Portfolio Management
- Real-time portfolio tracking
- Profit/Loss analytics
- Asset allocation visualization
- Performance metrics
- AI-powered portfolio recommendations

### 📈 Market Intelligence
- Real-time stock price tracking
- Market movers (Top Gainers/Losers)
- Interactive price charts
- Volume and market cap analytics
- Historical data analysis

### 🎨 Enterprise UI/UX
- **Dark modern theme** with glassmorphism
- **Framer Motion** animations
- Responsive design (Mobile, Tablet, Desktop)
- TradingView-inspired charts
- Bloomberg Terminal aesthetics

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI Framework
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Recharts & Chart.js** - Data Visualization
- **Zustand** - State Management
- **Socket.IO Client** - Real-time Updates
- **Axios** - HTTP Client

### Backend
- **Node.js & Express** - REST API
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Socket.IO** - WebSocket Server
- **Winston** - Logging
- **Helmet** - Security

### AI/ML Service
- **Python FastAPI** - AI Service Framework
- **TensorFlow/PyTorch** - Deep Learning
- **Scikit-learn** - ML Models
- **Prophet** - Time Series Forecasting
- **yfinance** - Stock Data
- **Transformers** - NLP Models
- **Pandas & NumPy** - Data Processing

### DevOps
- **Docker & Docker Compose** - Containerization
- **MongoDB** - Database Container
- **Multi-stage Builds** - Optimization

## 📦 Installation

### Prerequisites
- Node.js 18+
- Python 3.11+
- MongoDB 7.0+
- Docker & Docker Compose (optional)

### Quick Start (Local Development)

1. **Clone the repository**
```bash
git clone <repository-url>
cd ai-stock-platform
```

2. **Install all dependencies**
```bash
npm run install-all
```

3. **Set up environment variables**

Create `.env` files in root, server, client, and ai-service directories:

**Root `.env`:**
```env
JWT_SECRET=your_super_secret_jwt_key
MONGODB_URI=mongodb://localhost:27017/ai-stock-platform
```

**Server `.env`:**
```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/ai-stock-platform
JWT_SECRET=your_super_secret_jwt_key
AI_SERVICE_URL=http://localhost:8000
```

**Client `.env`:**
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

**AI Service `.env`:**
```env
PORT=8000
HOST=0.0.0.0
```

4. **Start MongoDB**
```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:7.0

# Or use local MongoDB installation
mongod
```

5. **Start all services**

**Option A: Using npm scripts (Recommended for development)**
```bash
npm run dev
```

**Option B: Start services individually**

Terminal 1 - Backend:
```bash
cd server
npm run dev
```

Terminal 2 - Frontend:
```bash
cd client
npm start
```

Terminal 3 - AI Service:
```bash
cd ai-service
python main.py
```

6. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- AI Service: http://localhost:8000
- API Docs: http://localhost:8000/docs

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)

1. **Build and start all services**
```bash
docker-compose up -d
```

2. **View logs**
```bash
docker-compose logs -f
```

3. **Stop services**
```bash
docker-compose down
```

4. **Rebuild after changes**
```bash
docker-compose up -d --build
```

### Individual Docker Commands

**Build images:**
```bash
docker build -f docker/Dockerfile.server -t ai-stock-server .
docker build -f docker/Dockerfile.client -t ai-stock-client .
docker build -f docker/Dockerfile.ai -t ai-stock-ai .
```

**Run containers:**
```bash
docker run -d -p 5000:5000 --name server ai-stock-server
docker run -d -p 3000:3000 --name client ai-stock-client
docker run -d -p 8000:8000 --name ai-service ai-stock-ai
```

## 📁 Project Structure

```
ai-stock-platform/
├── client/                 # React Frontend
│   ├── public/
│   └── src/
│       ├── components/     # Reusable UI components
│       ├── pages/          # Page components
│       ├── services/       # API services
│       ├── store/          # State management
│       ├── layouts/        # Layout components
│       ├── charts/         # Chart components
│       └── utils/          # Utility functions
│
├── server/                 # Node.js Backend
│   ├── config/            # Configuration files
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Express middleware
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   └── utils/             # Utility functions
│
├── ai-service/            # Python AI Service
│   ├── models/            # ML models
│   ├── services/          # AI services
│   ├── utils/             # Helper functions
│   └── data/              # Data storage
│
├── docker/                # Docker configurations
│   ├── Dockerfile.server
│   ├── Dockerfile.client
│   └── Dockerfile.ai
│
├── docs/                  # Documentation
├── docker-compose.yml     # Docker Compose config
└── package.json           # Root package file
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Stocks
- `GET /api/stocks` - Get all stocks
- `GET /api/stocks/:symbol` - Get stock details
- `GET /api/stocks/:symbol/history` - Get stock history
- `GET /api/stocks/market/movers` - Get market movers
- `GET /api/stocks/search/:query` - Search stocks

### Predictions
- `GET /api/predictions/:symbol` - Get predictions
- `POST /api/predictions/:symbol` - Generate prediction
- `GET /api/predictions/:symbol/latest` - Get latest prediction

### Sentiment
- `GET /api/sentiment/:symbol` - Get sentiment
- `POST /api/sentiment/:symbol` - Analyze sentiment
- `GET /api/sentiment/:symbol/history` - Get sentiment history

### Portfolio
- `GET /api/portfolio` - Get user portfolio
- `POST /api/portfolio` - Add to portfolio
- `DELETE /api/portfolio/:id` - Remove from portfolio

### Watchlist
- `GET /api/watchlist` - Get watchlist
- `POST /api/watchlist` - Add to watchlist
- `DELETE /api/watchlist/:symbol` - Remove from watchlist

## 🧪 Testing

```bash
# Backend tests
cd server
npm test

# Frontend tests
cd client
npm test

# AI Service tests
cd ai-service
pytest
```

## 🚀 Deployment

### Deploy to Railway

1. Install Railway CLI
```bash
npm install -g @railway/cli
```

2. Login and deploy
```bash
railway login
railway init
railway up
```

### Deploy to Render

1. Connect your GitHub repository
2. Create new Web Services for:
   - Backend (Node.js)
   - AI Service (Python)
   - Frontend (Static Site)
3. Add environment variables
4. Deploy

### Deploy to AWS/Azure

1. Build Docker images
2. Push to container registry
3. Deploy using ECS/AKS
4. Configure load balancer
5. Set up auto-scaling

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Helmet.js security headers
- Rate limiting
- CORS protection
- Input validation
- SQL injection prevention
- XSS protection

## 📊 Performance Optimization

- Code splitting
- Lazy loading
- Image optimization
- Caching strategies
- Database indexing
- API response compression
- WebSocket for real-time data

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **AI Stock Platform Team**

## 🙏 Acknowledgments

- TradingView for UI inspiration
- Bloomberg Terminal for design patterns
- yfinance for stock data
- Hugging Face for NLP models
- The open-source community

## 📞 Support

For support, email support@aistockplatform.com or join our Slack channel.

## 🗺️ Roadmap

- [ ] Paper trading simulation
- [ ] Cryptocurrency support
- [ ] Options trading analytics
- [ ] AI chatbot assistant
- [ ] Voice commands
- [ ] Mobile app (React Native)
- [ ] Advanced portfolio optimization
- [ ] Social trading features
- [ ] News aggregation engine
- [ ] Multi-language support

---

**Built with ❤️ by the AI Stock Platform Team**

⭐ Star us on GitHub if you find this project useful!
