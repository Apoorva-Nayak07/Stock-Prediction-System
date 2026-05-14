# Troubleshooting Guide - Login Page Issues

## Common Login Page Issues and Solutions

### Issue 1: "Login page not working" or "Cannot connect to server"

**Symptoms:**
- Login button does nothing
- Network error in console
- "Failed to fetch" error

**Solutions:**

#### Step 1: Check if Backend Server is Running
```bash
# Open a new terminal and check if server is running
curl http://localhost:5000/health

# Should return: {"status":"OK","message":"Server is running"}
```

If not running:
```bash
cd server
npm install
npm run dev
```

#### Step 2: Check if MongoDB is Running
```bash
# Test MongoDB connection
mongosh

# Or check if MongoDB service is running
# Windows:
net start MongoDB

# macOS:
brew services list | grep mongodb

# Linux:
sudo systemctl status mongod
```

If MongoDB is not running, start it:
```bash
# Windows
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

#### Step 3: Verify Environment Variables

**Check `client/.env`:**
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

**Check `server/.env`:**
```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/ai-stock-platform
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_min_32_characters
JWT_EXPIRE=7d
```

#### Step 4: Clear Browser Cache and Restart
```bash
# Stop all services (Ctrl+C in each terminal)

# Clear node_modules and reinstall
cd client
rm -rf node_modules package-lock.json
npm install

cd ../server
rm -rf node_modules package-lock.json
npm install

# Restart services
cd ..
npm run dev
```

#### Step 5: Check Browser Console for Errors

Open browser DevTools (F12) and check:
1. **Console tab** - Look for JavaScript errors
2. **Network tab** - Check if API calls are being made
3. **Application tab** - Clear localStorage and cookies

---

### Issue 2: CORS Error

**Symptoms:**
- "Access-Control-Allow-Origin" error in console
- "CORS policy" error

**Solution:**

Update `server/server.js` CORS configuration:
```javascript
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

Restart the backend server.

---

### Issue 3: "Invalid credentials" even with correct password

**Symptoms:**
- Login fails with correct email/password
- User not found error

**Solution:**

1. **Register a new account first:**
   - Go to http://localhost:3000/register
   - Create a new account
   - Then try logging in

2. **Check if user exists in database:**
```bash
mongosh
use ai-stock-platform
db.users.find()
```

3. **Reset database if needed:**
```bash
mongosh
use ai-stock-platform
db.users.deleteMany({})
```

Then register a new account.

---

### Issue 4: React App Not Starting

**Symptoms:**
- "Port 3000 is already in use"
- React app won't start

**Solution:**

```bash
# Kill process on port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -ti:3000 | xargs kill -9

# Or use a different port
# In client/.env:
PORT=3001
```

---

### Issue 5: Zustand Store Not Working

**Symptoms:**
- Login succeeds but redirects back to login
- User state not persisting

**Solution:**

The auth store has been updated to remove persist middleware. If you still have issues:

1. Clear browser localStorage:
```javascript
// In browser console (F12)
localStorage.clear()
```

2. Restart the React app:
```bash
cd client
npm start
```

---

## Complete Reset Procedure

If nothing works, do a complete reset:

```bash
# 1. Stop all services (Ctrl+C)

# 2. Kill all node processes
# Windows:
taskkill /F /IM node.exe

# macOS/Linux:
killall node

# 3. Clear all node_modules
rm -rf node_modules client/node_modules server/node_modules

# 4. Clear MongoDB database
mongosh
use ai-stock-platform
db.dropDatabase()
exit

# 5. Reinstall everything
npm run install-all

# 6. Copy environment files
cp .env.example .env
cp client/.env.example client/.env
cp server/.env.example server/.env

# 7. Start MongoDB
# Windows: net start MongoDB
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod

# 8. Start all services
npm run dev

# 9. Clear browser cache and localStorage
# Open browser DevTools (F12)
# Application tab → Clear storage → Clear site data

# 10. Register a new account at http://localhost:3000/register
```

---

## Testing the Login Flow

### Manual Test Steps:

1. **Start all services:**
```bash
npm run dev
```

2. **Verify services are running:**
   - Frontend: http://localhost:3000 (should show landing page)
   - Backend: http://localhost:5000/health (should return JSON)
   - MongoDB: `mongosh` (should connect)

3. **Register a new user:**
   - Go to http://localhost:3000/register
   - Fill in:
     - Name: Test User
     - Email: test@example.com
     - Password: password123
   - Click "Create Account"
   - Should redirect to dashboard

4. **Logout and Login:**
   - Click logout button
   - Go to http://localhost:3000/login
   - Enter:
     - Email: test@example.com
     - Password: password123
   - Click "Sign In"
   - Should redirect to dashboard

---

## Debug Mode

To see detailed error messages:

### Backend Debug:
```bash
cd server
DEBUG=* npm run dev
```

### Check Backend Logs:
```bash
# View logs in server/logs/
cat server/logs/combined.log
cat server/logs/error.log
```

### Frontend Debug:
Open browser DevTools (F12) and check:
- Console tab for errors
- Network tab for failed requests
- Application tab for localStorage

---

## Common Error Messages and Solutions

### "MongoServerError: Authentication failed"
- Check MongoDB connection string in `server/.env`
- Verify MongoDB is running
- Try connecting without authentication: `mongodb://localhost:27017/ai-stock-platform`

### "JsonWebTokenError: jwt malformed"
- Clear localStorage in browser
- Check JWT_SECRET in `server/.env` (must be at least 32 characters)
- Register a new account

### "Cannot POST /api/auth/login"
- Check if backend is running on port 5000
- Verify REACT_APP_API_URL in `client/.env`
- Check CORS configuration in `server/server.js`

### "Network Error" or "ERR_CONNECTION_REFUSED"
- Backend server is not running
- Wrong API URL in `client/.env`
- Firewall blocking connection

---

## Still Having Issues?

1. **Check all services are running:**
```bash
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend  
cd client && npm start

# Terminal 3 - MongoDB
mongod
```

2. **Verify ports are correct:**
   - Frontend: 3000
   - Backend: 5000
   - MongoDB: 27017

3. **Check firewall settings:**
   - Allow connections on ports 3000, 5000, 27017

4. **Try a different browser:**
   - Chrome, Firefox, or Edge
   - Use incognito/private mode

5. **Check Node.js and npm versions:**
```bash
node --version  # Should be 18+
npm --version   # Should be 9+
```

---

## Quick Fix Commands

```bash
# Fix 1: Restart everything
npm run dev

# Fix 2: Clear and reinstall
rm -rf node_modules && npm install && npm run dev

# Fix 3: Reset database
mongosh
use ai-stock-platform
db.dropDatabase()
exit

# Fix 4: Clear browser
# F12 → Application → Clear storage

# Fix 5: Check if ports are free
netstat -ano | findstr :3000
netstat -ano | findstr :5000
netstat -ano | findstr :27017
```

---

## Contact Support

If you're still experiencing issues:
- Check GitHub Issues
- Review documentation in `/docs` folder
- Email: support@aistockplatform.com

---

**Last Updated:** May 14, 2026
