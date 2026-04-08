# 🧪 Cozy Corner - Testing & Troubleshooting Guide

## 🧪 Testing Your Setup

### 1. Verify Installation

```bash
# Check Node.js
node --version
# Expected: v16+

# Check npm
npm --version
# Expected: 8+

# Check MongoDB
mongosh --version
# Expected: version number (or skip if using Atlas)
```

### 2. Test Backend Connection

```bash
# Start backend
cd server
npm run dev

# In another terminal, test endpoint
curl http://localhost:5000/api/health

# Expected response:
# {"status":"Server is running","timestamp":"2026-04-07T..."}
```

### 3. Test Frontend Loading

```bash
# Start frontend
cd client
npm run dev

# Open browser
# http://localhost:5173

# Expected: See "Cozy Corner" homepage
# Expected: Server status shows green checkmark
```

### 4. Test Frontend-Backend Connection

Open browser DevTools (F12) → Console and run:

```javascript
// Test API connection
fetch('http://localhost:5000/api/health')
  .then(response => response.json())
  .then(data => console.log('✓ API works:', data))
  .catch(error => console.log('✗ API error:', error));

// Test user API
fetch('http://localhost:5000/api/users')
  .then(response => response.json())
  .then(data => console.log('✓ Users API works:', data))
  .catch(error => console.log('✗ Users API error:', error));
```

---

## 🐛 Troubleshooting Guide

### Problem: "Cannot GET /api/health"

**Cause:** Backend server is not running

**Solution:**
```bash
cd server
npm run dev

# Should show:
# MongoDB Connected: localhost
# Server running on port 5000
```

---

### Problem: "Server Status: offline" (in Frontend)

**Cause:** Frontend can't reach backend API

**Possible Issues:**
1. Backend not running
2. Wrong API URL in frontend
3. CORS issue

**Solutions:**
```bash
# 1. Verify backend is running
curl http://localhost:5000/api/health

# 2. Check frontend .env file
cat client/.env
# Should show: VITE_API_URL=http://localhost:5000/api

# 3. Restart frontend
cd client && npm run dev
```

---

### Problem: "MongoDB connection failed"

**Cause:** MongoDB is not running or not accessible

**Solutions:**

For Local MongoDB:
```bash
# Check if running
brew services list
# Look for mongodb-community: started

# Start if not running
brew services start mongodb-community

# Verify connection
mongosh
> exit
```

For MongoDB Atlas:
```bash
# Verify credentials in server/.env
cat server/.env

# MONGODB_URI should be:
# mongodb+srv://username:password@cluster.mongodb.net/cozy-corner

# Check:
# 1. Username and password correct
# 2. Cluster name correct
# 3. IP whitelist includes your IP
# 4. Network access enabled
```

---

### Problem: "Port 5000 already in use"

**Cause:** Another process is using port 5000

**Solution:**
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process (replace PID with actual number)
kill -9 <PID>

# Or use shortcut
kill -9 $(lsof -t -i:5000)

# Try starting backend again
cd server && npm run dev
```

---

### Problem: "Port 5173 already in use"

**Cause:** Another process is using port 5173

**Solution:**
```bash
# Kill process
kill -9 $(lsof -t -i:5173)

# Or change port in vite.config.js
# Then restart: cd client && npm run dev
```

---

### Problem: "npm dependencies missing"

**Cause:** node_modules directory doesn't exist or corrupted

**Solution:**
```bash
# For backend
cd server
rm -rf node_modules package-lock.json
npm install

# For frontend
cd ../client
rm -rf node_modules package-lock.json
npm install
```

---

### Problem: "CORS error in console"

**Cause:** Frontend can't call backend API due to CORS

**Solution:**
```bash
# 1. Verify CORS is configured in server/src/index.js
cat server/src/index.js
# Should have: cors() middleware

# 2. Verify CLIENT_URL in server/.env
cat server/.env
# Should show: CLIENT_URL=http://localhost:5173

# 3. Restart backend
cd server && npm run dev
```

---

### Problem: "Module not found" error

**Cause:** Missing package or wrong import

**Solution:**
```bash
# For frontend
cd client
npm install missing-package-name

# For backend
cd ../server
npm install missing-package-name

# Clear cache and restart
rm -rf node_modules
npm install
npm run dev
```

---

### Problem: ".env file not found"

**Cause:** Environment configuration missing

**Solution:**
```bash
# Check if .env exists
ls -la server/.env
ls -la client/.env

# If missing, create from example
cp server/.env.example server/.env
cp client/.env.example client/.env

# Verify contents
cat server/.env
cat client/.env
```

---

### Problem: "Cannot find module 'dotenv'"

**Cause:** dotenv package not installed

**Solution:**
```bash
cd server
npm install dotenv
npm run dev
```

---

### Problem: "Tailwind CSS not working"

**Cause:** Tailwind configuration missing or not imported

**Solution:**
```bash
# 1. Verify tailwind.config.js exists
ls -la client/tailwind.config.js

# 2. Verify postcss.config.js exists
ls -la client/postcss.config.js

# 3. Verify @tailwind directives in index.css
head -5 client/src/index.css
# Should show: @tailwind base; @tailwind components; @tailwind utilities;

# 4. Reinstall dependencies
cd client
rm -rf node_modules
npm install

# 5. Restart dev server
npm run dev
```

---

### Problem: "Hot Module Replacement (HMR) not working"

**Cause:** Vite HMR configuration issue

**Solution:**
```bash
# 1. Clear browser cache
# 2. Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

# 3. Restart dev server
cd client
npm run dev

# 4. If still not working, check vite.config.js
cat vite.config.js
```

---

### Problem: "React component not updating"

**Cause:** Component state or hook issue

**Solution:**
```javascript
// 1. Check if using hooks correctly
import { useState, useEffect } from 'react';

// 2. Check component is properly exported
export default function MyComponent() {
  // ...
}

// 3. Check dependencies in useEffect
useEffect(() => {
  // ...
}, [dependency]) // Add dependencies here

// 4. Clear browser cache and restart
```

---

### Problem: API request returns 404

**Cause:** Wrong endpoint or route not defined

**Solution:**
```bash
# 1. Check available routes
cat server/src/routes/users.js

# 2. Check route is registered in index.js
cat server/src/index.js
# Should have: app.use('/api/users', usersRouter);

# 3. Verify URL in frontend
cat client/src/services/api.js

# 4. Check console for exact URL being called
# Open DevTools → Network tab → make request
```

---

### Problem: Database query returns empty

**Cause:** No data in database or incorrect query

**Solution:**
```bash
# Connect to MongoDB
mongosh

# Use database
use cozy-corner

# Check collections
show collections

# Query data
db.users.find()

# If empty, insert test data
db.users.insertOne({
  name: "Test User",
  email: "test@example.com",
  password: "password"
})

# Exit
exit
```

---

### Problem: "Cannot read property of undefined"

**Cause:** Accessing property on undefined/null object

**Solution:**
```javascript
// Add null checks
if (data && data.user) {
  console.log(data.user.name);
}

// Or use optional chaining
console.log(data?.user?.name);

// Or provide defaults
const name = data?.user?.name || 'Unknown';
```

---

### Problem: Backend crash with "Error: connect ECONNREFUSED"

**Cause:** Can't connect to MongoDB

**Solution:**
```bash
# 1. Verify MongoDB is running
brew services list

# 2. Start MongoDB
brew services start mongodb-community

# 3. Verify connection
mongosh

# 4. Check MONGODB_URI in .env
cat server/.env

# 5. Restart backend
cd server && npm run dev
```

---

## ✅ Verification Checklist

Run through these to verify everything works:

```bash
# 1. Prerequisites
[ ] node --version
[ ] npm --version
[ ] mongosh --version

# 2. Directories
[ ] ls -la server/
[ ] ls -la client/

# 3. Files
[ ] ls -la server/.env
[ ] ls -la client/.env
[ ] ls -la server/package.json
[ ] ls -la client/package.json

# 4. Dependencies
[ ] ls -la server/node_modules
[ ] ls -la client/node_modules

# 5. Services
[ ] MongoDB running: brew services list
[ ] Backend responds: curl http://localhost:5000/api/health
[ ] Frontend loads: http://localhost:5173 in browser

# 6. Connection
[ ] Server status is "running"
[ ] No CORS errors in console
[ ] Network tab shows successful API calls
```

---

## 🚨 Emergency Reset

If everything breaks, do a complete reset:

```bash
# 1. Stop all servers (Ctrl+C in each terminal)

# 2. Clean directories
rm -rf server/node_modules client/node_modules
rm -f server/package-lock.json client/package-lock.json

# 3. Reinstall
cd server && npm install
cd ../client && npm install

# 4. Restart MongoDB
brew services stop mongodb-community
brew services start mongodb-community

# 5. Start servers
# Terminal 1: cd server && npm run dev
# Terminal 2: cd client && npm run dev
# Terminal 3: brew services start mongodb-community
```

---

## 📞 Getting Help

1. **Check this file** - Common issues above
2. **Read PROJECT_CHECKLIST.md** - Verify all files exist
3. **Run verify.sh** - Automated verification
4. **Check console/terminal** - Look for error messages
5. **Review documentation** - DEVELOPER_GUIDE.md has code examples

---

## 🎯 Quick Test Commands

```bash
# Test MongoDB connection
mongosh --eval "db.version()"

# Test backend health
curl http://localhost:5000/api/health

# Test backend is responding
curl -X GET http://localhost:5000/api/users

# Test creating user
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"pass"}'

# Check processes
ps aux | grep node
ps aux | grep mongod

# List all npm scripts
cd server && npm run
cd ../client && npm run
```

---

## 💡 Pro Tips

1. **Use multiple terminals** - One for each service
2. **Keep DevTools open** - Console shows real errors
3. **Check .env files** - Most issues are configuration
4. **Restart services** - Often solves connection issues
5. **Check ports** - Ensure 5000, 5173 are free
6. **View MongoDB data** - Use `mongosh` to inspect database
7. **Check network tab** - See actual API requests/responses
8. **Read error messages** - They usually tell you what's wrong

---

## ✨ Once Everything Works

```bash
# You should see:
# ✓ Backend running on http://localhost:5000
# ✓ Frontend running on http://localhost:5173
# ✓ MongoDB connected
# ✓ No console errors
# ✓ "Cozy Corner" homepage visible
# ✓ Server status showing "running"
```

Now you're ready to build features! 🚀

---

Last updated: April 7, 2026
