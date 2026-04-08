# 🏠 Cozy Corner - Complete MERN Stack Project

Welcome to your fully configured MERN application! This is your complete reference for the entire project.

---

## 📖 Documentation Index

### For Getting Started
1. **[SUMMARY.md](./SUMMARY.md)** ⭐ **START HERE** - Project overview and quick overview
2. **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Detailed step-by-step setup instructions
3. **[COMMANDS.md](./COMMANDS.md)** - Quick command reference

### For Development
4. **[DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)** - Code patterns and examples
5. **[README.md](./README.md)** - Full project documentation
6. **[PROJECT_CHECKLIST.md](./PROJECT_CHECKLIST.md)** - Verification checklist

### Helper Scripts
- **setup.sh** - Automated setup script
- **verify.sh** - Project verification script

---

## 🚀 Quick Start (60 seconds)

```bash
# 1. Install dependencies
cd server && npm install
cd ../client && npm install

# 2. Start MongoDB (Terminal 1)
brew services start mongodb-community

# 3. Start Backend (Terminal 2)
cd server && npm run dev

# 4. Start Frontend (Terminal 3)
cd client && npm run dev

# 5. Open browser
http://localhost:5173
```

---

## 📁 Project Structure

```
cozy-corner/
├── 📄 Documentation
│   ├── INDEX.md                ← You are here
│   ├── SUMMARY.md              ← Start here!
│   ├── README.md               ← Full guide
│   ├── SETUP_GUIDE.md          ← Setup steps
│   ├── DEVELOPER_GUIDE.md      ← Code patterns
│   ├── COMMANDS.md             ← Command reference
│   └── PROJECT_CHECKLIST.md    ← Verification
│
├── 🛠 Scripts
│   ├── setup.sh                ← Auto setup
│   └── verify.sh               ← Verify setup
│
├── 📦 Backend (Express + MongoDB)
│   ├── server/
│   │   ├── src/
│   │   │   ├── config/
│   │   │   │   └── database.js
│   │   │   ├── models/
│   │   │   │   └── User.js
│   │   │   ├── routes/
│   │   │   │   └── users.js
│   │   │   ├── middleware/
│   │   │   │   └── errorHandler.js
│   │   │   └── index.js
│   │   ├── .env
│   │   ├── .gitignore
│   │   └── package.json
│
└── 🎨 Frontend (React + Vite + Tailwind)
    ├── client/
    │   ├── src/
    │   │   ├── components/
    │   │   │   └── Home.jsx
    │   │   ├── services/
    │   │   │   └── api.js
    │   │   ├── App.jsx
    │   │   ├── main.jsx
    │   │   ├── index.css
    │   │   └── App.css
    │   ├── public/
    │   ├── .env
    │   ├── tailwind.config.js
    │   ├── postcss.config.js
    │   ├── vite.config.js
    │   ├── eslint.config.js
    │   ├── index.html
    │   └── package.json
```

---

## ✨ What's Included

### Backend Features ✅
- Express.js server with CORS
- MongoDB with Mongoose ORM
- Environment configuration (dotenv)
- Error handling middleware
- Sample User model
- Sample CRUD routes
- Health check endpoint
- Auto-reload with nodemon

### Frontend Features ✅
- React 19 with Vite bundler
- Tailwind CSS with custom palette
- Axios HTTP client
- API service layer
- Server status checker
- Responsive design
- Hot module replacement (HMR)
- ESLint configured

### Connection Features ✅
- CORS enabled (localhost:5173 ↔ localhost:5000)
- API base URL configured
- Environment variables for both client and server

---

## 🎯 Common Tasks

### View Project Overview
```bash
cat SUMMARY.md
```

### Install All Dependencies
```bash
./setup.sh
```

### Verify Project Setup
```bash
./verify.sh
```

### Start Development (3 terminals)
```bash
# Terminal 1
brew services start mongodb-community

# Terminal 2
cd server && npm run dev

# Terminal 3
cd client && npm run dev
```

### Test API Endpoint
```bash
curl http://localhost:5000/api/health
```

### Build for Production
```bash
cd client && npm run build
```

---

## 📞 Need Help?

### Check These Files First
| Problem | Check |
|---------|-------|
| How do I start? | [SUMMARY.md](./SUMMARY.md) |
| Installation steps? | [SETUP_GUIDE.md](./SETUP_GUIDE.md) |
| Can't remember commands? | [COMMANDS.md](./COMMANDS.md) |
| How to add features? | [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) |
| Is setup correct? | [PROJECT_CHECKLIST.md](./PROJECT_CHECKLIST.md) |

### Troubleshooting

**Backend won't start:**
```bash
# Check if port 5000 is in use
lsof -i :5000
# Kill the process
kill -9 <PID>
# Try again
cd server && npm run dev
```

**Frontend won't connect to backend:**
```bash
# Verify client/.env has correct API URL
cat client/.env
# Should show: VITE_API_URL=http://localhost:5000/api

# Restart frontend
cd client && npm run dev
```

**MongoDB connection error:**
```bash
# Start MongoDB
brew services start mongodb-community

# Verify it's running
brew services list
```

**Dependencies not found:**
```bash
# Reinstall
cd server && rm -rf node_modules && npm install
cd ../client && rm -rf node_modules && npm install
```

---

## 🚀 API Endpoints

All endpoints are live once backend is running:

```
GET    /api/health              Server status
GET    /api/users               Get all users
GET    /api/users/:id           Get user by ID
POST   /api/users               Create user
PUT    /api/users/:id           Update user
DELETE /api/users/:id           Delete user
```

**Test in browser console:**
```javascript
fetch('http://localhost:5000/api/health')
  .then(r => r.json())
  .then(d => console.log(d))
```

---

## 🎨 Customization

### Change Port (Backend)
Edit `server/.env`:
```env
PORT=3000
```

### Change Frontend Port
Edit `client/vite.config.js`:
```javascript
server: {
  port: 3000,
}
```

### Use Different Database
Edit `server/.env`:
```env
# Local MongoDB
MONGODB_URI=mongodb://localhost:27017/cozy-corner

# MongoDB Atlas (cloud)
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/cozy-corner
```

### Customize Tailwind Colors
Edit `client/tailwind.config.js` to add your colors

---

## 📊 Technology Stack

```
Frontend:
├── React 19              UI Framework
├── Vite 8              Bundler & Dev Server
├── Tailwind CSS 3      Styling
├── Axios               HTTP Client
└── ESLint              Linting

Backend:
├── Node.js             Runtime
├── Express 4           Web Framework
├── MongoDB 7           Database
├── Mongoose 7          ODM
├── CORS 2              Cross-origin
└── Nodemon 3           Dev Auto-reload

Utilities:
├── dotenv              Config
├── express-async-errors Error Handling
└── PostCSS             CSS Processing
```

---

## ✅ Verification Checklist

Before starting development:

- [ ] Node.js v16+ installed
- [ ] npm installed
- [ ] MongoDB installed or Atlas account
- [ ] Dependencies installed: `npm install` in both directories
- [ ] `.env` files exist in both server/ and client/
- [ ] `.env` variables are configured
- [ ] MongoDB is running or Atlas is accessible
- [ ] Backend starts: `npm run dev` in server/
- [ ] Frontend starts: `npm run dev` in client/
- [ ] Browser shows "Cozy Corner" at localhost:5173
- [ ] Server status shows "running"

---

## 🎓 Learning Resources

### Official Documentation
- [React.dev](https://react.dev) - React documentation
- [Vite.dev](https://vite.dev) - Vite documentation
- [Express.com](https://expressjs.com) - Express documentation
- [Mongoosejs.com](https://mongoosejs.com) - Mongoose documentation
- [Tailwindcss.com](https://tailwindcss.com) - Tailwind CSS documentation

### Tutorials in This Project
- See [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) for code examples
- See [README.md](./README.md) for API examples
- See component files in `client/src/components/` for React examples

---

## 📝 Next Steps

1. **Follow [SUMMARY.md](./SUMMARY.md)** - Get oriented
2. **Run setup.sh** - Install everything
3. **Start 3 terminals** - Run MongoDB, Backend, Frontend
4. **Open browser** - Visit http://localhost:5173
5. **Explore code** - Check out the boilerplate components
6. **Read [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)** - Learn patterns
7. **Start building** - Create your features!

---

## 🎉 You're Ready!

Your complete MERN stack is configured and ready for development.

Happy coding! 🚀

---

**Questions?** Check the documentation files above.

**Found an issue?** Review [PROJECT_CHECKLIST.md](./PROJECT_CHECKLIST.md) for verification steps.

**Want to learn more?** Read [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) for code examples.
