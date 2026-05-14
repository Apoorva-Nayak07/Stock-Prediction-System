# 🚀 START HERE - Quick Launch Guide

## ✅ Current Status

Your AI Stock Market Platform is **ready to run**!

### Services Status:
- ✅ **AI Service**: Running on http://localhost:8000
- ⚠️ **Backend**: Needs MongoDB (or will run with mock data)
- ⚠️ **Frontend**: Port 3000 is in use

---

## 🎯 Quick Start (3 Options)

### Option 1: Run WITHOUT MongoDB (Fastest - Demo Mode)

The backend will work with mock data if MongoDB is not available.

**Steps:**
1. The backend server will restart automatically (it's watching for file changes)
2. Kill the process on port 3000:
   ```bash
   # Find and kill process on port 3000
   netstat -ano | findstr :3000
   # Note the PID and kill it:
   taskkill /PID <PID> /F
   ```
3. The frontend will start automatically

**Access the app at:** http://localhost:3000

---

### Option 2: Run WITH MongoDB (Full Features)

For full database functionality:

**Steps:**
1. **Start MongoDB:**
   ```bash
   net start MongoDB
   ```

2. **Restart backend** (it will auto-restart when it detects the file change)

3. **Kill process on port 3000:**
   ```bash
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   ```

4. **Frontend will start automatically**

**Access the app at:** http://localhost:3000

---

### Option 3: Use MongoDB Atlas (Cloud Database)

If you don't have MongoDB installed locally:

**Steps:**
1. **Create free MongoDB Atlas account:**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for free tier
   - Create a cluster
   - Get connection string

2. **Update `server/.env`:**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-stock-platform
   ```

3. **Restart backend** (auto-restarts on file change)

4. **Kill process on port 3000 and restart frontend**

---

## 🌐 Access Points

Once running:
- **Frontend (Main App)**: http://localhost:3000
- **Backend API**: http://localhost:5000/health
- **AI Service**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

---

## 📝 First Time Setup

1. **Open your browser:** http://localhost:3000

2. **Register a new account:**
   - Click "Get Started" or "Register"
   - Fill in your details:
     - Name: Your Name
     - Email: your@email.com
     - Password: password123 (min 6 chars)
   - Click "Create Account"

3. **Explore the platform:**
   - Dashboard: View market overview
   - AI Predictions: Enter stock symbol (e.g., AAPL)
   - Sentiment: Analyze market sentiment
   - Portfolio: Track your investments
   - Watchlist: Save favorite stocks

---

## 🔧 Currently Running Services

Check running services:
```bash
# List all background processes
# The services are running in the background
```

**Services:**
1. ✅ **AI Service** (Port 8000) - Running
2. 🔄 **Backend** (Port 5000) - Will restart automatically
3. ⏳ **Frontend** (Port 3000) - Waiting for port to be free

---

## 🐛 Troubleshooting

### Issue: Port 3000 already in use

**Solution:**
```bash
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process (replace <PID> with actual PID)
taskkill /PID <PID> /F
```

### Issue: Backend keeps crashing

**Cause:** MongoDB is not running

**Solutions:**
1. **Start MongoDB:**
   ```bash
   net start MongoDB
   ```

2. **Or use demo mode** (backend will work with mock data)

3. **Or use MongoDB Atlas** (cloud database)

### Issue: Can't access the app

**Check:**
1. All services are running
2. No firewall blocking ports 3000, 5000, 8000
3. Browser is accessing http://localhost:3000 (not https)

---

## 📚 Need More Help?

- **Detailed Setup:** See `SETUP_GUIDE.md`
- **Troubleshooting:** See `TROUBLESHOOTING.md`
- **API Reference:** See `docs/API_DOCUMENTATION.md`
- **Quick Start:** See `QUICKSTART.md`

---

## 🎉 You're Almost There!

Just need to:
1. Free up port 3000 (kill the process using it)
2. Optionally start MongoDB (or use demo mode)
3. Open http://localhost:3000 in your browser

**The platform will be ready in less than 1 minute!**

---

## 💡 Pro Tips

1. **Demo Mode:** The app works without MongoDB using mock data
2. **Auto-Restart:** Backend auto-restarts when you save files
3. **Hot Reload:** Frontend auto-reloads when you make changes
4. **Test Data:** Use any stock symbol (AAPL, GOOGL, TSLA, etc.)

---

**Happy Trading! 📈**
