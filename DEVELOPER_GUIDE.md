# Cozy Corner - Developer Guide & Code Patterns

## API Service Patterns

### Basic API Client Setup

The `client/src/services/api.js` is already configured with Axios:

```javascript
import apiClient from '../services/api';

// Make GET request
const response = await apiClient.get('/endpoint');

// Make POST request with data
const response = await apiClient.post('/endpoint', { data });

// Make PUT request
const response = await apiClient.put('/endpoint/:id', { updatedData });

// Make DELETE request
const response = await apiClient.delete('/endpoint/:id');
```

### Adding New API Methods

In `client/src/services/api.js`:

```javascript
// Product API calls
export const productAPI = {
  getAll: () => apiClient.get('/products'),
  getById: (id) => apiClient.get(`/products/${id}`),
  create: (productData) => apiClient.post('/products', productData),
  update: (id, productData) => apiClient.put(`/products/${id}`, productData),
  delete: (id) => apiClient.delete(`/products/${id}`),
  search: (query) => apiClient.get(`/products/search?q=${query}`),
};
```

---

## Backend Route Patterns

### Create New Route File

`server/src/routes/products.js`:

```javascript
import express from "express";

const router = express.Router();

// Get all products
router.get("/", (req, res) => {
  // Query database
  res.json({ success: true, products: [] });
});

// Get single product
router.get("/:id", (req, res) => {
  const { id } = req.params;
  res.json({ success: true, product: { id } });
});

// Create product
router.post("/", (req, res) => {
  const productData = req.body;
  // Save to database
  res.status(201).json({ 
    success: true, 
    message: "Product created",
    product: productData 
  });
});

// Update product
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  // Update in database
  res.json({ 
    success: true, 
    message: "Product updated",
    product: { id, ...updates }
  });
});

// Delete product
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  // Delete from database
  res.json({ 
    success: true, 
    message: "Product deleted"
  });
});

export default router;
```

### Register Route in Main Server

`server/src/index.js`:

```javascript
import productsRouter from "./routes/products.js";

// Add this after other routes:
app.use("/api/products", productsRouter);
```

---

## Mongoose Model Patterns

### Create New Model

`server/src/models/Product.js`:

```javascript
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0,
    },
    category: {
      type: String,
      enum: ["furniture", "decor", "lighting", "textiles"],
      default: "decor",
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    image: {
      type: String,
      default: null,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
```

### Use Model in Controller

`server/src/controllers/productController.js`:

```javascript
import Product from "../models/Product.js";

export const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.json({ success: true, products });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: "Product not found" 
      });
    }
    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ 
      success: true, 
      message: "Product created",
      product 
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: "Product not found" 
      });
    }
    res.json({ 
      success: true, 
      message: "Product updated",
      product 
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: "Product not found" 
      });
    }
    res.json({ 
      success: true, 
      message: "Product deleted"
    });
  } catch (error) {
    next(error);
  }
};
```

### Update Route to Use Controller

`server/src/routes/products.js`:

```javascript
import express from "express";
import * as productController from "../controllers/productController.js";

const router = express.Router();

router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.post("/", productController.createProduct);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

export default router;
```

---

## React Component Patterns

### Functional Component with Hooks

`client/src/components/ProductList.jsx`:

```javascript
import { useState, useEffect } from 'react';
import { productAPI } from '../services/api';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productAPI.getAll();
        setProducts(response.data.products);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-600 p-8">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-cozy-900 mb-8">Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <div
            key={product._id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
          >
            {product.image && (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="text-xl font-semibold text-cozy-900">
                {product.name}
              </h3>
              <p className="text-cozy-700 mt-2">{product.description}</p>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-2xl font-bold text-cozy-500">
                  ${product.price}
                </span>
                <button className="bg-cozy-500 text-white px-4 py-2 rounded hover:bg-cozy-600">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Form Component with Validation

`client/src/components/ProductForm.jsx`:

```javascript
import { useState } from 'react';
import { productAPI } from '../services/api';

export default function ProductForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'decor',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Price must be greater than 0';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      await productAPI.create(formData);
      setFormData({ name: '', description: '', price: '', category: 'decor' });
      setErrors({});
      onSuccess?.();
    } catch (error) {
      console.error('Error creating product:', error);
      setErrors({ submit: 'Failed to create product' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-cozy-900 mb-4">Add Product</h2>

      <div className="mb-4">
        <label className="block text-cozy-700 font-semibold mb-2">
          Product Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded ${
            errors.name ? 'border-red-500' : 'border-cozy-300'
          }`}
          placeholder="Enter product name"
        />
        {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
      </div>

      <div className="mb-4">
        <label className="block text-cozy-700 font-semibold mb-2">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded ${
            errors.description ? 'border-red-500' : 'border-cozy-300'
          }`}
          placeholder="Enter product description"
          rows="3"
        />
        {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
      </div>

      <div className="mb-4">
        <label className="block text-cozy-700 font-semibold mb-2">
          Price
        </label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded ${
            errors.price ? 'border-red-500' : 'border-cozy-300'
          }`}
          placeholder="0.00"
          step="0.01"
        />
        {errors.price && <p className="text-red-600 text-sm mt-1">{errors.price}</p>}
      </div>

      <div className="mb-6">
        <label className="block text-cozy-700 font-semibold mb-2">
          Category
        </label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-cozy-300 rounded"
        >
          <option value="decor">Decor</option>
          <option value="furniture">Furniture</option>
          <option value="lighting">Lighting</option>
          <option value="textiles">Textiles</option>
        </select>
      </div>

      {errors.submit && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {errors.submit}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-cozy-500 text-white py-2 rounded font-semibold hover:bg-cozy-600 disabled:opacity-50"
      >
        {loading ? 'Creating...' : 'Add Product'}
      </button>
    </form>
  );
}
```

---

## Error Handling Patterns

### Custom Error Middleware

`server/src/middleware/errorHandler.js` (already configured):

```javascript
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({
    success: false,
    status,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export default errorHandler;
```

### Async Error Handling

In routes (express-async-errors is already installed):

```javascript
router.get('/:id', async (req, res, next) => {
  // No try-catch needed - errors automatically caught and passed to error handler
  const user = await User.findById(req.params.id);
  if (!user) {
    const error = new Error('User not found');
    error.status = 404;
    throw error;
  }
  res.json(user);
});
```

---

## Environment Variables

### Server `.env` Variables

```env
# Server port
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/cozy-corner
# or for Atlas:
# MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/cozy-corner

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:5173

# Environment
NODE_ENV=development

# JWT Secret (when adding auth)
JWT_SECRET=your-secret-key-here

# Email configuration (if needed)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### Client `.env` Variables

```env
# API endpoint
VITE_API_URL=http://localhost:5000/api

# Analytics or other services
VITE_GOOGLE_ANALYTICS_ID=your-id

# Feature flags
VITE_ENABLE_DEBUG_MODE=false
```

---

## Deployment Checklist

### Before Deploying

- [ ] Remove `console.log()` statements
- [ ] Set `NODE_ENV=production` in server `.env`
- [ ] Update `CLIENT_URL` for production domain
- [ ] Build frontend: `npm run build`
- [ ] Test in production mode locally
- [ ] Verify all environment variables are set
- [ ] Update MongoDB connection to production database

### Deployment Platforms

**Frontend (Vercel, Netlify):**
```bash
cd client
npm run build
# Deploy `dist` folder
```

**Backend (Heroku, Railway, Render):**
```bash
cd server
git push heroku main
# or use platform deployment
```

---

## Testing Pattern

### Simple Test Example

`server/src/routes/products.test.js`:

```javascript
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../index.js';

describe('Product Routes', () => {
  it('should get all products', async () => {
    const response = await request(app)
      .get('/api/products')
      .expect(200);
    
    expect(response.body).toHaveProperty('success');
    expect(response.body).toHaveProperty('products');
  });

  it('should create a product', async () => {
    const response = await request(app)
      .post('/api/products')
      .send({
        name: 'Test Product',
        description: 'Test',
        price: 99.99,
      })
      .expect(201);
    
    expect(response.body.product).toHaveProperty('_id');
  });
});
```

---

This guide provides the foundation for extending your MERN application. Use these patterns as templates for adding new features!
