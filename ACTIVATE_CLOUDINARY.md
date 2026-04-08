# How to Activate Cloudinary Integration

## Quick Start

### Step 1: Get Cloudinary Credentials
1. Go to https://cloudinary.com/
2. Sign up for a free account
3. Navigate to Dashboard
4. Copy your:
   - **Cloud Name** (shown on dashboard)
   - **API Key** (Settings → API Keys)
   - **API Secret** (Settings → API Keys)

### Step 2: Update Environment Variables
Edit `/server/.env` and replace placeholders:

```env
CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
CLOUDINARY_API_KEY=your_actual_api_key
CLOUDINARY_API_SECRET=your_actual_api_secret
```

### Step 3: Install Cloudinary SDK
```bash
cd server
npm install cloudinary
```

### Step 4: Update Backend Upload Function
In `/server/src/controllers/architectController.js`, replace the `uploadImage` function with:

```javascript
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary (add at top of controller)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Replace the uploadImage function:
export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file provided",
      });
    }

    // Upload to Cloudinary
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        folder: "cozy-corner/portfolio",
        quality: "auto",
        fetch_format: "auto",
      },
      async (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return res.status(500).json({
            success: false,
            message: "Failed to upload image",
            error: error.message,
          });
        }

        res.status(200).json({
          success: true,
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    stream.end(req.file.buffer);
  } catch (error) {
    console.error("Image upload error:", error);
    next(error);
  }
};
```

### Step 5: Update Frontend (Optional - Already Implemented)
The frontend is already set up to use the upload service:
```javascript
// In ArchitectProfileForm.jsx, you can now use:
const response = await architectService.uploadImage(file);
// response.url contains the Cloudinary URL
```

### Step 6: Restart Server
```bash
cd server
npm run dev
```

## Testing the Integration

### Test Upload via Frontend
1. Navigate to Create Profile page
2. Select an image to upload
3. The image should upload to Cloudinary
4. Portfolio gallery should display the Cloudinary URL

### Test via API (curl)
```bash
# Get auth token first
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"architect@example.com","password":"password"}'

# Upload image
curl -X POST http://localhost:5001/api/architects/upload-image \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@/path/to/image.jpg"
```

## Database Migration (If Upgrading from Base64)

If you have existing profiles with base64 images:

1. **Option A: Keep existing images**
   - They'll continue to work as base64 data URLs
   - New uploads will use Cloudinary

2. **Option B: Migrate to Cloudinary**
   - Create migration script to convert base64 to Cloudinary
   - Delete old base64 data to reduce database size

## Cloudinary Settings for Best Results

In Cloudinary dashboard settings:
- ✅ Enable automatic format optimization
- ✅ Enable responsive images
- ✅ Set quality to "auto" for optimal compression
- ✅ Enable lazy loading for web

## Benefits After Integration

✅ Unlimited image storage (on Cloudinary)
✅ Automatic image optimization
✅ Global CDN for fast delivery
✅ Image transformations (resize, crop, etc.)
✅ Responsive image serving
✅ Reduced database size
✅ Better performance

## Troubleshooting

**Issue:** "Cloudinary not configured"
- **Solution:** Check .env file has correct credentials, restart server

**Issue:** Upload fails with 401
- **Solution:** Ensure you're logged in and token is valid

**Issue:** Image URL returns 404
- **Solution:** Check Cloud Name in credentials is correct

## Current Architecture (Without Cloudinary)

Currently, the system falls back to base64 encoding if Cloudinary isn't configured. This works for development but isn't recommended for production due to:
- Larger database size
- Slower image loading
- No image optimization
- Limited scalability

## Production Checklist

Before deploying to production:
- [ ] Set up Cloudinary paid account (if high volume expected)
- [ ] Add Cloudinary credentials to production .env
- [ ] Test image uploads end-to-end
- [ ] Set up image transformation presets
- [ ] Enable image security features
- [ ] Configure backup/disaster recovery
- [ ] Monitor Cloudinary usage and costs
