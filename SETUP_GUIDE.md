# Cozy Corner - Quick Setup Guide

## Step-by-Step Commands

### Prerequisites
- Node.js v16+
- MongoDB (local or MongoDB Atlas)

---

## 1️⃣ Server Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file (already created, verify settings)
cat .env

# .env should contain:
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/cozy-corner
# CLIENT_URL=http://localhost:5173
# NODE_ENV=development
```

---

## 2️⃣ Client Setup

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Verify .env file
cat .env

# .env should contain:
# VITE_API_URL=http://localhost:5000/api
```

---

## 3️⃣ MongoDB Setup (Choose One)

### Option A: Local MongoDB
```bash
# Install MongoDB Community Edition
# macOS (using Homebrew):
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community

# Verify MongoDB is running
mongosh
# Type: exit
```

### Option B: MongoDB Atlas (Cloud)
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create a cluster
4. Get connection string
5. Update `MONGODB_URI` in `server/.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cozy-corner
   ```

---

## 4️⃣ Running Development Servers

### Terminal 1: Start Backend
```bash
cd server
npm run dev

# Expected output:
# MongoDB Connected: localhost
# Server running on port 5000
```

### Terminal 2: Start Frontend
```bash
cd client
npm run dev

# Expected output:
# VITE v8.0.4 ready in XXX ms
# 
# ➜ Local: http://localhost:5173/
```

---

## 5️⃣ Verify Setup

1. Open browser: `http://localhost:5173`
2. Should see "Cozy Corner" homepage
3. Check "Server Status" - should show "Server is running"
4. Verify no errors in browser console

---

## 📁 Project Structure Created

```
cozy-corner/
├── client/
│   ├── src/
│   │   ├── components/Home.jsx       ← Main page
│   │   ├── services/api.js           ← API client
│   │   ├── App.jsx                   ← App component
│   │   └── index.css                 ← Tailwind included
│   ├── tailwind.config.js            ← Tailwind setup
│   ├── postcss.config.js             ← PostCSS setup
│   ├── .env                          ← Frontend config
│   └── package.json
│
└── server/
    ├── src/
    │   ├── config/database.js        ← MongoDB connection
    │   ├── models/User.js            ← Sample model
    │   ├── routes/users.js           ← Sample routes
    │   ├── middleware/errorHandler.js ← Error handling
    │   └── index.js                  ← Main server file
    ├── .env                          ← Backend config
    └── package.json
```

---

## 🚀 What's Already Set Up

### Backend (Server)
- ✅ Express server with CORS enabled
- ✅ MongoDB connection with Mongoose
- ✅ Sample User model
- ✅ User CRUD routes
- ✅ Health check endpoint
- ✅ Error handling middleware
- ✅ Environment configuration

### Frontend (Client)
- ✅ React 19 with Vite
- ✅ Tailwind CSS configured
- ✅ Axios API client
- ✅ Service layer (`api.js`)
- ✅ Home component with server status check
- ✅ Custom color palette
- ✅ Responsive design

### CORS & Connection
- ✅ CORS enabled: `http://localhost:5173` ↔ `http://localhost:5000`
- ✅ API base URL: `http://localhost:5000/api`
- ✅ Frontend configured to call backend

---

## 📝 Next: Creating Your Features

### Add a New API Endpoint

**server/src/routes/products.js:**
```javascript
import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ products: [] });
});

export default router;
```

**server/src/index.js** - Add route:
```javascript
import productsRouter from "./routes/products.js";
app.use("/api/products", productsRouter);
```

### Create Frontend Component

**client/src/components/ProductList.jsx:**
```javascript
import { useState, useEffect } from 'react';
import apiClient from '../services/api';

export default function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiClient.get('/products');
        setProducts(response.data.products);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-cozy-900">Products</h1>
      {/* Render products here */}
    </div>
  );
}
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| **"Cannot GET /api/health"** | Backend not running. Run `cd server && npm run dev` |
| **"Server Status: offline"** | Check backend URL in `client/.env` - should be `http://localhost:5000/api` |
| **MongoDB connection error** | Verify MongoDB is running: `brew services list` or check Atlas credentials |
| **Port 5000/5173 in use** | Kill process: `lsof -i :5000` then `kill -9 <PID>` |
| **CORS error** | Ensure `CLIENT_URL` in `server/.env` matches frontend URL |

---

## 📚 Useful Commands

```bash
# Install new npm package (frontend)
cd client && npm install package-name

# Install new npm package (backend)
cd server && npm install package-name

# Check if ports are in use
lsof -i :5000      # Backend
lsof -i :5173      # Frontend

# Kill process on port
kill -9 <PID>

# Reset node_modules
rm -rf node_modules package-lock.json && npm install

# View MongoDB collections
mongosh
> use cozy-corner
> db.users.find()
> exit
```

---

## ✅ Complete Checklist

- [ ] Node.js and npm installed
- [ ] MongoDB installed or Atlas account created
- [ ] Server dependencies installed: `cd server && npm install`
- [ ] Client dependencies installed: `cd client && npm install`
- [ ] `.env` files configured for both client and server
- [ ] MongoDB running
- [ ] Backend running: `cd server && npm run dev`
- [ ] Frontend running: `cd client && npm run dev`
- [ ] Browser shows "Cozy Corner" at `http://localhost:5173`
- [ ] Server Status shows green/running

---

## 🎉 You're Ready!

Your MERN stack is now ready for development. Start building features!

### Recommended Next Steps:
1. Create more models (Post, Comment, etc.)
2. Add authentication (JWT)
3. Create more API routes and components
4. Add form validation
5. Deploy to production

Happy coding! 🚀
