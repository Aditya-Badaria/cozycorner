# Cozy Corner - MERN Stack Application

A full-stack MERN (MongoDB, Express, React, Node.js) application with React + Vite frontend and Express backend, styled with Tailwind CSS.

## Project Structure

```
cozy-corner/
├── client/                    # React + Vite frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── services/         # API service layer
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── index.css
│   │   └── App.css
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── .env                  # Client environment variables
│   └── index.html
│
└── server/                    # Node.js + Express backend
    ├── src/
    │   ├── config/           # Database configuration
    │   ├── models/           # Mongoose schemas
    │   ├── routes/           # API routes
    │   ├── controllers/       # Route controllers
    │   ├── middleware/        # Express middleware
    │   └── index.js          # Server entry point
    ├── package.json
    ├── .env                  # Server environment variables
    └── .gitignore
```

## Prerequisites

- Node.js (v16+)
- npm or yarn
- MongoDB (local or Atlas)

## Installation & Setup

### 1. Install Server Dependencies

```bash
cd server
npm install
```

### 2. Install Client Dependencies

```bash
cd ../client
npm install
```

### 3. Configure Environment Variables

**Server (.env):**
```bash
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cozy-corner
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

**Client (.env):**
```bash
VITE_API_URL=http://localhost:5000/api
```

## Running the Application

### Development Mode

**Terminal 1 - Start MongoDB** (if using local MongoDB):
```bash
mongod
```

**Terminal 2 - Start Backend Server:**
```bash
cd server
npm run dev
```

The server will run on `http://localhost:5000`

**Terminal 3 - Start Frontend Dev Server:**
```bash
cd client
npm run dev
```

The frontend will run on `http://localhost:5173`

### Production Build

**Frontend:**
```bash
cd client
npm run build
npm run preview
```

**Backend:**
```bash
cd server
npm start
```

## Features Implemented

### Backend (Express)
- ✅ RESTful API structure with Express
- ✅ MongoDB connection with Mongoose
- ✅ CORS enabled for cross-origin requests
- ✅ Error handling middleware
- ✅ Environment variable configuration
- ✅ Sample User model and routes
- ✅ Health check endpoint

### Frontend (React + Vite)
- ✅ React 19 with Vite bundler
- ✅ Tailwind CSS for styling
- ✅ Axios for API requests
- ✅ API service layer
- ✅ Server status checker
- ✅ Custom Cozy color palette
- ✅ Responsive design

## API Endpoints

### Health Check
- `GET /api/health` - Server status

### Users (Sample Routes)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## Usage Examples

### Making API Calls from Frontend

```javascript
import { userAPI } from '../services/api';

// Get all users
const users = await userAPI.getAll();

// Create a user
const newUser = await userAPI.create({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123'
});

// Update a user
const updated = await userAPI.update(userId, {
  name: 'Jane Doe'
});

// Delete a user
await userAPI.delete(userId);
```

### Creating New Components

```javascript
import { useState, useEffect } from 'react';
import { userAPI } from '../services/api';

export function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await userAPI.getAll();
        setUsers(response.data.users);
      } catch (error) {
        console.error('Failed to fetch users', error);
      }
    };
    
    fetchUsers();
  }, []);

  return (
    <div className="container mx-auto p-4">
      {users.map(user => (
        <div key={user._id} className="bg-white p-4 mb-4 rounded">
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>
      ))}
    </div>
  );
}
```

## Database Setup

### Using Local MongoDB
1. Install MongoDB from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Start MongoDB service
3. Update `MONGODB_URI` in `.env`

### Using MongoDB Atlas (Cloud)
1. Create account at [mongodb.com/cloud](https://www.mongodb.com/cloud/atlas)
2. Create cluster and connection string
3. Update `MONGODB_URI` in `.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cozy-corner
   ```

## Styling with Tailwind CSS

Custom color palette (`cozy-*`) is available in `tailwind.config.js`:

```jsx
<div className="bg-cozy-50 text-cozy-900 border-cozy-500">
  Cozy content
</div>
```

## Troubleshooting

### Frontend can't connect to backend
- Ensure backend is running on port 5000
- Check `VITE_API_URL` in client `.env`
- Verify CORS is enabled in `server/src/index.js`

### MongoDB connection fails
- Verify MongoDB is running
- Check connection string in `.env`
- For local: ensure `mongod` service is active
- For Atlas: verify IP whitelist and credentials

### Port already in use
- Frontend default: 5173
- Backend default: 5000
- Change ports in `.env` or `vite.config.js`

## Next Steps

1. **Create authentication** - Add JWT-based auth
2. **Add validation** - Implement data validation middleware
3. **Expand models** - Add more Mongoose schemas (Posts, Comments, etc.)
4. **Add state management** - Implement Redux or Context API
5. **Deploy** - Deploy to Heroku, Vercel, or Netlify

## Scripts Reference

**Client:**
- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

**Server:**
- `npm run dev` - Start with nodemon (auto-reload)
- `npm start` - Start production server

## License

MIT

## Support

For issues or questions, please refer to the documentation of:
- [React](https://react.dev)
- [Vite](https://vite.dev)
- [Express](https://expressjs.com)
- [Mongoose](https://mongoosejs.com)
- [Tailwind CSS](https://tailwindcss.com)
