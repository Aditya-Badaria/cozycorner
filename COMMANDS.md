# Cozy Corner - Installation & Startup Commands

## 📋 Quick Reference

### Initial Setup (One Time)

```bash
# 1. Install Server Dependencies
cd server
npm install

# 2. Install Client Dependencies
cd ../client
npm install

# 3. Start MongoDB (if using local)
brew services start mongodb-community

# 4. Verify environment files exist:
# - server/.env
# - client/.env
```

---

## 🚀 Running Development Environment

Open **3 separate terminals**:

### Terminal 1: MongoDB (if using local)
```bash
# Check if running
brew services list

# If not running, start it
brew services start mongodb-community

# Connect to verify (optional)
mongosh
# Type: exit
```

### Terminal 2: Backend Server
```bash
cd /Users/adityabadaria/Desktop/cozy\ corner/server
npm run dev
```

**Expected output:**
```
MongoDB Connected: localhost
Server running on port 5000
```

### Terminal 3: Frontend Server
```bash
cd /Users/adityabadaria/Desktop/cozy\ corner/client
npm run dev
```

**Expected output:**
```
VITE v8.0.4 ready in XXX ms

➜ Local:   http://localhost:5173/
```

---

## 📂 Complete Directory Setup

Your workspace now has:

```
/Users/adityabadaria/Desktop/cozy corner/
│
├── README.md                           ← Main documentation
├── SETUP_GUIDE.md                      ← This setup guide
├── DEVELOPER_GUIDE.md                  ← Code patterns & examples
│
├── client/                             ← React + Vite Frontend
│   ├── src/
│   │   ├── components/
│   │   │   └── Home.jsx               ← Main home page with server status
│   │   ├── services/
│   │   │   └── api.js                 ← Axios API client
│   │   ├── App.jsx                    ← App component
│   │   ├── main.jsx                   ← React entry point
│   │   ├── index.css                  ← Tailwind CSS included
│   │   └── App.css                    ← App styles
│   ├── public/                        ← Static assets
│   ├── index.html                     ← HTML template
│   ├── vite.config.js                 ← Vite configuration
│   ├── tailwind.config.js             ← Tailwind CSS config
│   ├── postcss.config.js              ← PostCSS config
│   ├── eslint.config.js               ← ESLint config
│   ├── .env                           ← Environment variables
│   ├── .env.example                   ← Template
│   └── package.json                   ← Dependencies
│
└── server/                             ← Express + MongoDB Backend
    ├── src/
    │   ├── config/
    │   │   └── database.js            ← MongoDB connection
    │   ├── models/
    │   │   └── User.js                ← Sample User model
    │   ├── routes/
    │   │   └── users.js               ← User API routes
    │   ├── controllers/               ← (Ready for controllers)
    │   ├── middleware/
    │   │   └── errorHandler.js        ← Error handling middleware
    │   └── index.js                   ← Main server file
    ├── .env                           ← Environment variables
    ├── .env.example                   ← Template
    ├── .gitignore                     ← Git ignore rules
    └── package.json                   ← Dependencies
```

---

## 📦 Installed Dependencies

### Client (Frontend)
```json
{
  "react": "^19.2.4",
  "react-dom": "^19.2.4",
  "axios": "^1.6.2",
  "tailwindcss": "^3.3.6",
  "autoprefixer": "^10.4.18",
  "postcss": "^8.4.39",
  "vite": "^8.0.4"
}
```

### Server (Backend)
```json
{
  "express": "^4.18.2",
  "mongoose": "^7.5.0",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1",
  "express-async-errors": "^3.1.1",
  "nodemon": "^3.0.1"
}
```

---

## 🔌 API Endpoints

All endpoints ready to use:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server health check |
| GET | `/api/users` | Get all users |
| GET | `/api/users/:id` | Get user by ID |
| POST | `/api/users` | Create new user |
| PUT | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user |

---

## 🌐 Frontend - Backend Connection

✅ **CORS Enabled**: Frontend (`http://localhost:5173`) can call Backend (`http://localhost:5000`)

**In browser:**
- Frontend URL: `http://localhost:5173`
- API calls go to: `http://localhost:5000/api/*`

---

## 🛠 Common Tasks

### Add New NPM Package (Frontend)
```bash
cd client
npm install package-name
```

### Add New NPM Package (Backend)
```bash
cd server
npm install package-name
```

### Build Frontend for Production
```bash
cd client
npm run build
# Output: dist/ folder
```

### Kill Process on Port
```bash
# Kill port 5000 (backend)
lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Kill port 5173 (frontend)
lsof -i :5173 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

### Check Running Processes
```bash
# MongoDB
brew services list

# Node processes
ps aux | grep node
```

---

## 🗄 Database Setup

### Option 1: Local MongoDB

```bash
# Install (if not done)
brew tap mongodb/brew
brew install mongodb-community

# Start service
brew services start mongodb-community

# Stop service
brew services stop mongodb-community

# Check status
brew services list

# Connect and test
mongosh
> use cozy-corner
> db.users.find()
> exit
```

### Option 2: MongoDB Atlas (Cloud)

1. Visit: https://www.mongodb.com/cloud/atlas
2. Create account → Create cluster → Generate connection string
3. Update `server/.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cozy-corner
   ```

---

## ✅ Verification Checklist

Run these to verify everything works:

```bash
# 1. Check Node version (should be v16+)
node --version

# 2. Check npm version
npm --version

# 3. Check MongoDB (if local)
mongosh --version

# 4. Backend responds to health check
curl http://localhost:5000/api/health

# 5. Frontend loads
curl http://localhost:5173
```

---

## 🧪 Test API Calls

### Using curl

```bash
# Health check
curl http://localhost:5000/api/health

# Get all users
curl http://localhost:5000/api/users

# Create user
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"123"}'

# Update user
curl -X PUT http://localhost:5000/api/users/USER_ID \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane"}'

# Delete user
curl -X DELETE http://localhost:5000/api/users/USER_ID
```

### Using Frontend Console

Open browser DevTools (F12) and run:

```javascript
// Import the API client
import { checkHealth, userAPI } from '../services/api';

// Health check
await checkHealth();

// Get all users
await userAPI.getAll();

// Create user
await userAPI.create({ name: 'Test', email: 'test@example.com', password: 'pass' });
```

---

## 🐛 Troubleshooting

### Problem: "Cannot GET /api/health"
**Solution:** Backend not running
```bash
cd server
npm run dev
```

### Problem: "Server Status: offline"
**Solution:** Check frontend `.env` API URL
```bash
cat client/.env
# Should show: VITE_API_URL=http://localhost:5000/api
```

### Problem: MongoDB connection error
**Solution:** MongoDB not running
```bash
# Check if running
brew services list

# Start if needed
brew services start mongodb-community
```

### Problem: Port already in use
**Solution:** Kill the process
```bash
# For port 5000
kill -9 $(lsof -t -i:5000)

# For port 5173
kill -9 $(lsof -t -i:5173)
```

### Problem: Dependencies issues
**Solution:** Clean reinstall
```bash
# For client
cd client
rm -rf node_modules package-lock.json
npm install

# For server
cd ../server
rm -rf node_modules package-lock.json
npm install
```

---

## 📝 Environment Files

### server/.env
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cozy-corner
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### client/.env
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🚀 Next Steps After Setup

1. **Add more models** - Create Product, Post, Comment models
2. **Add authentication** - Implement JWT-based auth
3. **Create more components** - Build ProductList, UserProfile, etc.
4. **Add validation** - Input validation and error handling
5. **Style customization** - Modify Tailwind colors and themes
6. **Deploy** - Deploy to Vercel (frontend) and Heroku/Railway (backend)

---

## 📚 Documentation Files

- **README.md** - Full project overview
- **SETUP_GUIDE.md** - Detailed setup instructions
- **DEVELOPER_GUIDE.md** - Code patterns and examples
- **This file** - Commands reference

---

## 💡 Tips

- Always keep 3 terminals open: MongoDB, Backend, Frontend
- Use `npm run dev` for development (auto-reload)
- Check `.env` files if APIs don't connect
- Backend must start before frontend for API to work
- Use browser DevTools to debug API calls
- MongoDB data persists between server restarts

---

Happy coding! 🎉

Questions? Check the other documentation files or the code comments.
