# 📊 Cozy Corner - Visual Architecture & Flow Guide

## 🏗 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      COZY CORNER APPLICATION                     │
└─────────────────────────────────────────────────────────────────┘

                    CLIENT (React + Vite)
                    http://localhost:5173
                    ├─ Home.jsx
                    ├─ ProductList.jsx (example)
                    ├─ services/api.js
                    └─ Tailwind CSS Styling
                           ↓
                      HTTP Requests (Axios)
                      CORS Enabled ✓
                           ↓
    ┌──────────────────────────────────────────────────────────┐
    │          SERVER (Express + Node.js)                       │
    │          http://localhost:5000                            │
    │          ├─ routes/users.js                               │
    │          ├─ models/User.js                                │
    │          ├─ middleware/errorHandler.js                    │
    │          └─ config/database.js                            │
    │                    ↓                                       │
    │         MongoDB Connection Pool                           │
    │                    ↓                                       │
    │      DATABASE (MongoDB)                                   │
    │      mongodb://localhost:27017                            │
    │      ├─ users collection                                  │
    │      ├─ products collection (future)                      │
    │      └─ posts collection (future)                         │
    └──────────────────────────────────────────────────────────┘
```

---

## 🔄 Request/Response Flow

```
┌─────────────────────────────────────────────────────────────┐
│ USER INTERACTION (Browser)                                  │
│ Click Button / Submit Form                                  │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ REACT COMPONENT                                             │
│ - Handle click event                                        │
│ - Prepare data                                              │
│ - Show loading state                                        │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ API SERVICE (Axios)                                         │
│ userAPI.create(userData)                                    │
│ → POST http://localhost:5000/api/users                      │
└─────────────────────────────────────────────────────────────┘
                         ↓ HTTP
┌─────────────────────────────────────────────────────────────┐
│ EXPRESS SERVER                                              │
│ - CORS middleware validates origin                          │
│ - Route handler processes request                           │
│ - Extract body data                                         │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ MONGOOSE MODEL                                              │
│ - Validate data                                             │
│ - Apply default values                                      │
│ - Prepare for database                                      │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ MONGODB DATABASE                                            │
│ - Save document to collection                               │
│ - Generate _id                                              │
│ - Return saved document                                     │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ RESPONSE SENT BACK                                          │
│ {                                                           │
│   "success": true,                                          │
│   "user": { _id, name, email, createdAt }                   │
│ }                                                           │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ REACT UPDATES                                               │
│ - Parse response                                            │
│ - Update component state                                    │
│ - Hide loading state                                        │
│ - Show success message / update UI                          │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ USER SEES RESULT                                            │
│ Item added to list / Form cleared / Success notification   │
└─────────────────────────────────────────────────────────────┘
```

---

## 📂 File Organization

```
FRONTEND LAYER
│
├── services/
│   └── api.js ──────────────→ Axios instance + API methods
│
├── components/
│   ├── Home.jsx ────────────→ Main page
│   ├── ProductList.jsx ────→ Displays products
│   ├── ProductForm.jsx ────→ Create/edit form
│   └── UserProfile.jsx ────→ User information
│
├── App.jsx ─────────────────→ Main app component
├── main.jsx ────────────────→ React entry point
├── index.css ───────────────→ Tailwind + global styles
│
├── tailwind.config.js ──────→ Tailwind configuration
├── postcss.config.js ───────→ PostCSS setup
├── vite.config.js ─────────→ Vite bundler config
│
└── .env ────────────────────→ Frontend configuration
                    
                ↓↓ HTTP REQUESTS ↓↓
                
BACKEND LAYER
│
├── src/
│   │
│   ├── index.js ────────────→ Main server file
│   │                         - Express setup
│   │                         - Middleware
│   │                         - Routes registration
│   │
│   ├── config/
│   │   └── database.js ─────→ MongoDB connection
│   │                         - Mongoose setup
│   │                         - Connection logic
│   │
│   ├── models/
│   │   ├── User.js ────────→ User schema
│   │   ├── Product.js ─────→ Product schema
│   │   └── Post.js ────────→ Post schema
│   │
│   ├── routes/
│   │   ├── users.js ───────→ User endpoints
│   │   ├── products.js ────→ Product endpoints
│   │   └── posts.js ───────→ Post endpoints
│   │
│   ├── controllers/ ───────→ Business logic
│   │   ├── userController.js
│   │   ├── productController.js
│   │   └── postController.js
│   │
│   └── middleware/
│       ├── errorHandler.js ─→ Error handling
│       ├── auth.js ────────→ Authentication
│       └── validation.js ──→ Data validation
│
├── package.json ──────────→ Dependencies + scripts
├── .env ──────────────────→ Backend configuration
└── .gitignore ────────────→ Git ignore rules

                ↓↓ DATABASE QUERIES ↓↓

DATABASE LAYER
│
└── MongoDB (cozy-corner)
    ├── users collection
    │   ├── { _id, name, email, password, createdAt }
    │   ├── { _id, name, email, password, createdAt }
    │   └── ...
    │
    ├── products collection
    │   ├── { _id, name, price, description, ... }
    │   ├── { _id, name, price, description, ... }
    │   └── ...
    │
    └── posts collection
        ├── { _id, title, content, author, ... }
        ├── { _id, title, content, author, ... }
        └── ...
```

---

## 🔀 Data Flow Patterns

### Pattern 1: Display List

```
Component Mount
    ↓
useEffect Hook
    ↓
Call API: userAPI.getAll()
    ↓
Axios GET /api/users
    ↓
Express Route Handler
    ↓
Mongoose Query: User.find()
    ↓
MongoDB Returns Array
    ↓
Express Sends Response
    ↓
Axios Receives Data
    ↓
useState Updates (setUsers)
    ↓
Component Re-renders
    ↓
UI Shows List
```

### Pattern 2: Create Item

```
User Submits Form
    ↓
Component Collects Data
    ↓
Validates Data
    ↓
Call API: userAPI.create(data)
    ↓
Axios POST /api/users
    ↓
Express Route Handler
    ↓
Mongoose: new User(data)
    ↓
User.save()
    ↓
MongoDB Stores Document
    ↓
Express Sends Response
    ↓
Component Updates State
    ↓
UI Shows Success
```

### Pattern 3: Update Item

```
User Edits Form
    ↓
Collect Changes
    ↓
Call API: userAPI.update(id, changes)
    ↓
Axios PUT /api/users/:id
    ↓
Express Route Handler
    ↓
Mongoose: User.findByIdAndUpdate()
    ↓
MongoDB Updates Document
    ↓
Returns Updated Document
    ↓
Express Sends Response
    ↓
Component Replaces Item
    ↓
UI Shows Updated Data
```

### Pattern 4: Delete Item

```
User Clicks Delete
    ↓
Confirm Action
    ↓
Call API: userAPI.delete(id)
    ↓
Axios DELETE /api/users/:id
    ↓
Express Route Handler
    ↓
Mongoose: User.findByIdAndDelete(id)
    ↓
MongoDB Deletes Document
    ↓
Express Sends Confirmation
    ↓
Component Removes Item
    ↓
UI Updates List
```

---

## 🛣 API Endpoint Structure

```
BASE URL: http://localhost:5000/api

HEALTH CHECK
  GET /health
  Response: { status: "Server is running", timestamp: "..." }

USERS ENDPOINTS
  GET    /users           → List all users
  GET    /users/:id       → Get one user
  POST   /users           → Create user
  PUT    /users/:id       → Update user
  DELETE /users/:id       → Delete user

PRODUCTS ENDPOINTS (future)
  GET    /products        → List all
  GET    /products/:id    → Get one
  POST   /products        → Create
  PUT    /products/:id    → Update
  DELETE /products/:id    → Delete

POSTS ENDPOINTS (future)
  GET    /posts           → List all
  GET    /posts/:id       → Get one
  POST   /posts           → Create
  PUT    /posts/:id       → Update
  DELETE /posts/:id       → Delete
```

---

## 🔌 Component Communication

```
PARENT COMPONENT
    │
    ├─→ Child Component 1
    │   └─→ Uses: import { userAPI } from '../services/api'
    │
    ├─→ Child Component 2
    │   └─→ Uses: import { productAPI } from '../services/api'
    │
    └─→ Child Component 3
        └─→ Uses: import apiClient from '../services/api'

All components share the same Axios instance
with pre-configured base URL and headers
```

---

## 📦 Environment Variables Map

```
CLIENT (http://localhost:5173)
├── VITE_API_URL
│   └─→ Used in: src/services/api.js
│       └─→ axios.create({ baseURL: VITE_API_URL })
│
└── Result: All API calls go to http://localhost:5000/api

SERVER (http://localhost:5000)
├── PORT
│   └─→ 5000 (server listening port)
│
├── MONGODB_URI
│   └─→ Used in: src/config/database.js
│       └─→ mongoose.connect(MONGODB_URI)
│
├── CLIENT_URL
│   └─→ Used in: src/index.js
│       └─→ cors({ origin: CLIENT_URL })
│       └─→ Allows http://localhost:5173
│
└── NODE_ENV
    └─→ development / production mode

DATABASE
└── MongoDB at MONGODB_URI
    └─→ Contains collections: users, products, posts, etc.
```

---

## 🔐 CORS Flow

```
Browser Request from http://localhost:5173
    ↓
Axios sends request with Origin header
    ↓
Express CORS Middleware checks
    ↓
Compares to: cors({ origin: "http://localhost:5173" })
    ↓
✓ MATCH: Allowed
    └─→ Add CORS headers
    └─→ Allow request to proceed
    
Or

✗ NO MATCH: Blocked
    └─→ Browser console: "CORS error"
    └─→ Request fails
    └─→ Check CLIENT_URL in server/.env
```

---

## 📊 Database Schema

```
MongoDB: cozy-corner

USERS COLLECTION
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String,
  createdAt: Date,
  updatedAt: Date
}

PRODUCTS COLLECTION (future)
{
  _id: ObjectId,
  name: String,
  description: String,
  price: Number,
  category: String,
  image: String,
  inStock: Boolean,
  createdAt: Date,
  updatedAt: Date
}

POSTS COLLECTION (future)
{
  _id: ObjectId,
  title: String,
  content: String,
  author: ObjectId (ref: User),
  comments: [ObjectId] (ref: Comment),
  likes: Number,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🚀 Deployment Architecture (Future)

```
CLIENT DEPLOYMENT (Vercel/Netlify)
├── https://cozy-corner.vercel.app
├── Build: npm run build
├── Deploy: ./dist folder
└── Environment: VITE_API_URL=https://api.cozy-corner.com

SERVER DEPLOYMENT (Heroku/Railway/Render)
├── https://api.cozy-corner.com
├── Deploy: git push
├── Environment: NODE_ENV=production, MONGODB_URI=atlas-connection
└── Runs: npm start

DATABASE (MongoDB Atlas)
├── Cluster: cozy-corner-production
├── Database: cozy-corner
└── Connection: mongodb+srv://user:pass@cluster.mongodb.net/cozy-corner
```

---

## 🔍 Debugging Path

```
USER REPORTS BUG
    ↓
CHECK 1: Browser Console
    └─→ Any JavaScript errors?
    
CHECK 2: DevTools Network Tab
    └─→ Which requests are failing?
    
CHECK 3: Backend Terminal
    └─→ Any server errors?
    
CHECK 4: MongoDB Connection
    └─→ mongosh → use cozy-corner → db.users.find()
    
CHECK 5: Environment Variables
    └─→ cat server/.env
    └─→ cat client/.env
    
CHECK 6: API Endpoint Test
    └─→ curl http://localhost:5000/api/...
    
CHECK 7: Component State
    └─→ React DevTools inspect props/state
    
FIX: Update code
    ↓
VERIFY: Test again
    ↓
DEPLOY: Push to production
```

---

This visual guide helps you understand:
- How frontend and backend communicate
- Where data flows through the system
- How components are organized
- What environment variables control
- How CORS validation works
- Database structure
- Debugging approach

Use this as reference when:
- Adding new features
- Debugging issues
- Understanding code flow
- Planning architecture
- Explaining to team members
