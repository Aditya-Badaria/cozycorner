# Cozy Corner - Architect Profile Feature Documentation

## 📋 Project Overview

**Cozy Corner** is a MERN (MongoDB, Express, React, Node.js) stack application that connects clients with interior architects. The platform features user authentication, architect profile management, portfolio showcasing, and a complete marketplace for interior design services.

---

## 🏗️ Architecture

### **Tech Stack**
- **Frontend**: React 19, React Router v6, Axios, Tailwind CSS, Vite
- **Backend**: Express.js, Node.js
- **Database**: MongoDB (with in-memory server for development)
- **Authentication**: JWT (7-day expiration), bcryptjs password hashing
- **Image Handling**: Base64 encoding, client-side compression (800x600px, 75% quality)
- **Build**: Vite for frontend, Nodemon for backend auto-reload

---

## 👤 User Roles & Authentication

### **User Types**
1. **Regular User** - Can browse architects and view portfolios
2. **Interior Architect** - Can create profiles, manage portfolio, edit information

### **Authentication Flow**
- Sign up with email, password, and role selection
- Login generates JWT token (stored in localStorage, 7-day expiration)
- Token sent in Authorization header for protected endpoints
- Automatic logout on token expiration

---

## 🏠 Architect Profile Feature

### **Database Model (Mongoose)**

```javascript
ArchitectProfile {
  userId: ObjectId (reference to User),
  bio: String (required),
  experience: Number (years, required),
  pricing: Number (hourly rate, required),
  location: String (city, required),
  portfolioImages: [{
    url: String (base64 or external URL),
    title: String,
    description: String
  }],
  specializations: [String] (residential, commercial, hospitality, retail, mixed),
  rating: Number (default 0),
  reviewCount: Number (default 0),
  isAvailable: Boolean (default true),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔌 API Endpoints

### **Architect Routes** (`/api/architects`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/create` | Protected (Architect) | Create new architect profile |
| GET | `/all` | Public | Fetch all architects |
| GET | `/:id` | Public | Get architect by ID with full details |
| GET | `/my-profile` | Protected | Get current user's architect profile |
| PUT | `/:id` | Protected | Update architect profile (ownership check) |

### **Request/Response Examples**

**Create Profile Request:**
```json
{
  "bio": "Specializing in modern residential design",
  "experience": 5,
  "pricing": 150,
  "location": "New York",
  "portfolioImages": [
    {
      "url": "data:image/jpeg;base64,...",
      "title": "Living Room Design",
      "description": "Modern aesthetic"
    }
  ],
  "specializations": ["residential", "modern"]
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Architect profile created successfully",
  "profile": { ...profile data... }
}
```

---

## 🎨 Frontend Components

### **1. Home Page** (`src/components/Home.jsx`)
- Sticky navbar with logo and navigation
- User profile display with avatar
- Server status check
- Feature showcase cards
- Sticky footer on all pages

### **2. Architect Profile Form** (`src/pages/ArchitectProfileForm.jsx`)
- **Create Mode**: Form fields for new profile
- **Edit Mode**: Auto-fetches existing profile data on load
- Features:
  - File upload with image compression
  - URL-based image input
  - Portfolio image gallery with hover-based remove
  - Specialization checkboxes
  - Real-time form validation
  - Detailed console logging for debugging

### **3. My Profile Page** (`src/pages/MyProfilePage.jsx`)
- Display architect's saved profile
- Portfolio image gallery with thumbnails
- Professional info sidebar with stats
- Star rating and review count
- Quick action buttons (Edit, View All Architects)
- Responsive sticky sidebar

### **4. Architects Listing Page** (`src/pages/ArchitectsListingPage.jsx`)
- Grid layout of all architects
- Filter by location and specialization
- Sort by rating, price, experience
- Search functionality
- "View Profile" button for each architect
- Real-time filter updates

### **5. Architect Detail Page** (`src/pages/ArchitectDetailPage.jsx`)
- Full-screen portfolio image viewer
- Main image display with thumbnail gallery
- Professional information sidebar
- Rating and specializations
- Contact information

### **6. Footer Component** (`src/components/Footer.jsx`)
- Logo and brand description
- Quick navigation links
- Features list
- Contact information
- Social media links
- Legal links (Privacy, Terms)
- Copyright notice
- Responsive grid layout

---

## 📸 Image Handling

### **Image Compression Utility** (`src/utils/imageCompression.js`)
- Compresses images to 800x600px max
- JPEG quality: 75%
- Converts to base64 for transmission
- Handles compression errors gracefully

### **Upload Flow**
1. User selects file or provides URL
2. File type validation (image only)
3. File size check (max 5MB)
4. Client-side compression
5. Converted to base64
6. Sent in JSON payload

### **Size Limits**
- Single image: 5MB max (before compression)
- Total portfolio: 10MB max (after compression)
- Server payload: 50MB (configured in Express)

---

## 🛣️ Routing Structure

### **Public Routes**
- `/login` - Login page
- `/signup` - Registration page
- `/architects` - Browse all architects
- `/architects/:id` - View architect profile

### **Protected Routes**
- `/` - Home page (authenticated users)
- `/architect/my-profile` - View own profile
- `/architect/create-profile` - Create/Edit profile

---

## 🔐 Security Features

1. **Password Hashing**: bcryptjs with salt rounds
2. **JWT Tokens**: 7-day expiration, stored in localStorage
3. **Protected Routes**: Only authenticated users can access
4. **Ownership Verification**: Can only update own profile
5. **Role-Based Access**: Different access for users vs architects
6. **Input Validation**: Server-side validation on all endpoints
7. **CORS**: Configured for development ports (5173-5176)

---

## 🎯 Form Validation

### **Client-Side**
- Required fields check
- Email format validation
- Number validation (experience, pricing ≥ 0)
- Image file type validation
- URL format validation for images
- Specialization array handling

### **Server-Side**
- Required fields validation
- Data type checking
- Portfolio size validation (10MB limit)
- User role verification
- Duplicate profile check (for create)
- Ownership check (for update)

---

## 📊 State Management

### **Authentication Context** (`src/context/AuthContext.jsx`)
- User data (name, email, role)
- Auth token management
- Login/Logout functions
- Protected route wrapping

### **Component State** (React Hooks)
- Form data with dynamic fields
- Portfolio images array
- Loading/Error/Success states
- Edit mode detection
- Image preview state

---

## 🌐 API Service Layer** (`src/services/architectService.js`)

```javascript
{
  createProfile(bio, experience, pricing, location, portfolioImages, specializations),
  getAllArchitects(),
  getArchitectById(id),
  getMyProfile(),
  updateProfile(id, updates)
}
```

All methods:
- Use centralized Axios instance
- Include JWT token in headers
- Comprehensive error handling
- Detailed console logging

---

## 🎨 UI/UX Design

### **Color Scheme** (Tailwind CSS)
- Primary: Amber/Cozy colors (#B45309)
- Secondary: Orange shades
- Accent: Gray-900 for footer
- Backgrounds: Gradient from amber-50 to orange-100

### **Components**
- Sticky navbar with logo
- Responsive grid layouts
- Card-based design for architect listings
- Modal-like profile detail view
- Sticky sidebar on profile page
- Dark footer for contrast
- Smooth transitions and hover effects

### **Responsive Design**
- Mobile-first approach
- Breakpoints: sm, md, lg, xl
- Flexible grid layouts
- Adaptive image galleries

---

## 🚀 Development Features

### **Logging**
- Comprehensive console.log throughout
- Error stack traces captured
- API request/response logging
- Form submission tracking
- Server-side detailed logs

### **Error Handling**
- Try-catch blocks on all async operations
- User-friendly error messages
- Fallback image handling
- Graceful degradation

### **Performance**
- Image compression before upload
- Lazy loading of architect listings
- Memoization where applicable
- Efficient state updates

---

## 📝 Recent Additions

### **My Profile Page** (New)
- Auto-fetch user's profile
- Portfolio gallery with thumbnails
- Professional stats sidebar
- Edit and browse options

### **Edit Profile Mode** (New)
- Detects existing profile
- Pre-populates all fields
- Updates instead of create
- Button text changes dynamically

### **Footer Component** (New)
- Added to all pages for consistency
- Logo with emoji
- Quick navigation links
- Social media placeholders
- Responsive grid layout

### **Route Ordering Fix** (Backend)
- Moved specific routes before generic ones
- Prevents `/my-profile` being treated as ID

---

## 🔄 Complete User Flow

### **For New Architect**
1. Sign up as "Interior Architect"
2. Click "Create Profile" in navbar
3. Fill form with bio, experience, pricing, location
4. Upload portfolio images or add via URL
5. Select specializations
6. Submit → Redirect to My Profile
7. View saved profile with all details

### **For Existing Architect**
1. Login
2. Click "Edit Profile"
3. Form auto-loads with existing data
4. Modify any fields
5. Add/remove portfolio images
6. Submit → Profile updates
7. View updated "My Profile"

### **For Regular User**
1. Sign up as "Regular User"
2. Click "Find Architects"
3. Browse architect grid
4. Filter/Sort as needed
5. Click architect card to view full profile
6. View portfolio gallery and details

---

## 🐛 Debugging Tips

### **Check These Logs:**
- **Browser Console**: Form submission data, API responses
- **Server Terminal**: Request logs, profile creation/update logs
- **Network Tab**: API call status and payloads

### **Common Issues & Fixes:**
- **Images not showing**: Check base64 encoding in form
- **Profile not fetching**: Verify JWT token in localStorage
- **Edit mode not working**: Ensure user is logged in as architect
- **Images not uploading**: Check 10MB portfolio limit

---

## 📦 Dependencies

### **Frontend**
```json
{
  "react": "^19.0.0",
  "react-router-dom": "^6.x",
  "axios": "latest",
  "tailwindcss": "latest"
}
```

### **Backend**
```json
{
  "express": "^4.18.0",
  "mongoose": "^7.0.0",
  "jsonwebtoken": "latest",
  "bcryptjs": "latest",
  "mongodb-memory-server": "dev"
}
```

---

## 🎯 Next Steps / Future Features

1. **Reviews & Ratings**: Allow users to review architects
2. **Messaging System**: Direct communication between users and architects
3. **Booking System**: Schedule appointments with architects
4. **Payment Integration**: Stripe/PayPal for paid services
5. **Advanced Search**: Full-text search and filters
6. **Image Optimization**: AWS S3 or Cloudinary for image storage
7. **Real-time Notifications**: WebSocket for messages/updates
8. **Admin Dashboard**: Manage users and content moderation

---

## 📞 API Documentation Links

- **Backend Server**: http://localhost:5001
- **Frontend Client**: http://localhost:5173
- **API Base URL**: http://localhost:5001/api

---

## ✅ Feature Checklist

- ✅ User Authentication (Sign up, Login)
- ✅ Architect Role Assignment
- ✅ Create Architect Profile
- ✅ Edit Existing Profile
- ✅ Portfolio Image Upload
- ✅ Image URL Support
- ✅ Image Compression
- ✅ My Profile Page
- ✅ Browse All Architects
- ✅ View Architect Details
- ✅ Filter & Sort
- ✅ Responsive Design
- ✅ Footer Component
- ✅ Logo Integration
- ✅ Error Handling
- ✅ Comprehensive Logging

---

**Project Status**: ✅ **COMPLETE** - All core features implemented and working!
