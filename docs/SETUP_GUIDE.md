# Complete Setup Guide

This guide will walk you through setting up the AI Stock Market Platform from scratch.

---

## Table of Contents
1. [System Requirements](#system-requirements)
2. [Installation Steps](#installation-steps)
3. [Database Setup](#database-setup)
4. [Running the Application](#running-the-application)
5. [Testing](#testing)
6. [Troubleshooting](#troubleshooting)

---

## System Requirements

### Minimum Requirements
- **OS**: Windows 10/11, macOS 10.15+, or Linux (Ubuntu 20.04+)
- **RAM**: 8GB
- **Storage**: 5GB free space
- **CPU**: Dual-core processor

### Recommended Requirements
- **RAM**: 16GB
- **Storage**: 10GB free space
- **CPU**: Quad-core processor

### Software Requirements
- **Node.js**: v18.0.0 or higher
- **Python**: v3.11.0 or higher
- **MongoDB**: v7.0 or higher
- **npm**: v9.0.0 or higher
- **pip**: v23.0.0 or higher
- **Git**: v2.30.0 or higher

---

## Installation Steps

### Step 1: Install Node.js

**Windows:**
1. Download from [nodejs.org](https://nodejs.org/)
2. Run installer
3. Verify installation:
```bash
node --version
npm --version
```

**macOS:**
```bash
brew install node
```

**Linux:**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Step 2: Install Python

**Windows:**
1. Download from [python.org](https://www.python.org/)
2. Run installer (check "Add Python to PATH")
3. Verify installation:
```bash
python --version
pip --version
```

**macOS:**
```bash
brew install python@3.11
```

**Linux:**
```bash
sudo apt-get update
sudo apt-get install python3.11 python3-pip
```

### Step 3: Install MongoDB

**Windows:**
1. Download from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Run installer
3. Start MongoDB service

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community@7.0
brew services start mongodb-community@7.0
```

**Linux:**
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

### Step 4: Clone Repository

```bash
git clone <repository-url>
cd ai-stock-platform
```

### Step 5: Install Dependencies

**Install all dependencies at once:**
```bash
npm run install-all
```

**Or install individually:**

Backend:
```bash
cd server
npm install
cd ..
```

Frontend:
```bash
cd client
npm install
cd ..
```

AI Service:
```bash
cd ai-service
pip install -r requirements.txt
cd ..
```

---

## Database Setup

### Option 1: Local MongoDB

1. **Start MongoDB**
```bash
# Windows
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

2. **Verify MongoDB is running**
```bash
mongosh
# Should connect successfully
```

3. **Create Database**
```bash
use ai-stock-platform
```

### Option 2: MongoDB Atlas (Cloud)

1. **Create Account**
   - Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for free tier

2. **Create Cluster**
   - Click "Build a Database"
   - Choose "Free" tier
   - Select region closest to you
   - Click "Create Cluster"

3. **Create Database User**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Set username and password
   - Grant "Read and write to any database"

4. **Whitelist IP Address**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)

5. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<password>` with your password

---

## Environment Configuration

### 1. Create Environment Files

**Root `.env`:**
```bash
cp .env.example .env
```

Edit `.env`:
```env
JWT_SECRET=your_super_secret_jwt_key_change_this_min_32_chars
MONGODB_URI=mongodb://localhost:27017/ai-stock-platform
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-stock-platform
```

**Server `.env`:**
```bash
cd server
cp ../.env.example .env
```

Edit `server/.env`:
```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/ai-stock-platform
JWT_SECRET=your_super_secret_jwt_key_change_this_min_32_chars
JWT_EXPIRE=7d
AI_SERVICE_URL=http://localhost:8000
```

**Client `.env`:**
```bash
cd client
cp .env.example .env
```

Edit `client/.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

**AI Service `.env`:**
```bash
cd ai-service
cp .env.example .env
```

Edit `ai-service/.env`:
```env
PORT=8000
HOST=0.0.0.0
```

---

## Running the Application

### Option 1: Run All Services Together (Recommended)

From the root directory:
```bash
npm run dev
```

This will start:
- Backend API on http://localhost:5000
- Frontend on http://localhost:3000
- AI Service on http://localhost:8000

### Option 2: Run Services Individually

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm start
```

**Terminal 3 - AI Service:**
```bash
cd ai-service
python main.py
```

### Verify Services are Running

1. **Backend API**: http://localhost:5000/health
   - Should return: `{"status":"OK","message":"Server is running"}`

2. **Frontend**: http://localhost:3000
   - Should show landing page

3. **AI Service**: http://localhost:8000
   - Should return: `{"message":"AI Stock Market Service","status":"running"}`

4. **AI Service Docs**: http://localhost:8000/docs
   - Should show FastAPI documentation

---

## First Time Setup

### 1. Create Admin Account

1. Open http://localhost:3000
2. Click "Get Started" or "Register"
3. Fill in registration form:
   - Name: Your Name
   - Email: your@email.com
   - Password: (min 6 characters)
4. Click "Create Account"

### 2. Explore the Platform

1. **Dashboard**: View market overview and stock prices
2. **AI Predictions**: Generate price predictions for stocks
3. **Sentiment Analysis**: Analyze market sentiment
4. **Portfolio**: Add and track your investments
5. **Watchlist**: Save stocks to monitor

---

## Testing

### Backend Tests
```bash
cd server
npm test
```

### Frontend Tests
```bash
cd client
npm test
```

### AI Service Tests
```bash
cd ai-service
pytest
```

### Manual Testing Checklist

- [ ] User registration works
- [ ] User login works
- [ ] Dashboard loads stock data
- [ ] Stock details page works
- [ ] AI prediction generates successfully
- [ ] Sentiment analysis works
- [ ] Portfolio add/remove works
- [ ] Watchlist add/remove works
- [ ] Real-time updates work

---

## Troubleshooting

### MongoDB Connection Issues

**Error: "MongoServerError: Authentication failed"**
- Check username and password in connection string
- Verify user has correct permissions

**Error: "MongooseServerSelectionError: connect ECONNREFUSED"**
- Ensure MongoDB is running
- Check if port 27017 is available
- Verify connection string

### Port Already in Use

**Error: "Port 3000 is already in use"**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

### Python Package Installation Issues

**Error: "No module named 'fastapi'"**
```bash
cd ai-service
pip install -r requirements.txt --upgrade
```

**Error: "Microsoft Visual C++ 14.0 is required" (Windows)**
- Install Visual Studio Build Tools
- Or use pre-built wheels: `pip install --only-binary :all: <package>`

### Node Module Issues

**Error: "Cannot find module"**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### CORS Errors

**Error: "Access-Control-Allow-Origin"**
- Check CLIENT_URL in server/.env
- Verify REACT_APP_API_URL in client/.env
- Restart backend server

### AI Service Not Starting

**Error: "Address already in use"**
```bash
# Change PORT in ai-service/.env
PORT=8001
```

**Error: "ModuleNotFoundError"**
```bash
cd ai-service
pip install -r requirements.txt
```

---

## Performance Optimization

### Development Mode

For faster development:
```bash
# Use nodemon for auto-restart
cd server
npm run dev

# Use React Fast Refresh (automatic)
cd client
npm start
```

### Production Mode

```bash
# Build frontend
cd client
npm run build

# Start backend in production
cd server
NODE_ENV=production node server.js
```

---

## Next Steps

1. **Customize the Platform**
   - Modify colors in `client/tailwind.config.js`
   - Update branding in components
   - Add custom features

2. **Add Real Data Sources**
   - Get API keys for Alpha Vantage, News API
   - Configure in environment variables
   - Update services to use real APIs

3. **Deploy to Production**
   - Follow [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
   - Set up monitoring
   - Configure backups

4. **Enhance AI Models**
   - Train custom ML models
   - Add more prediction algorithms
   - Improve sentiment analysis

---

## Getting Help

- **Documentation**: Check `/docs` folder
- **API Docs**: http://localhost:8000/docs
- **Issues**: Create GitHub issue
- **Community**: Join Discord/Slack

---

## Useful Commands

```bash
# Install all dependencies
npm run install-all

# Start all services
npm run dev

# Build frontend
npm run build

# Start with Docker
docker-compose up -d

# View Docker logs
docker-compose logs -f

# Stop Docker services
docker-compose down

# Clean install
rm -rf node_modules package-lock.json
npm install
```

---

**Congratulations! Your AI Stock Market Platform is now running! 🎉**
