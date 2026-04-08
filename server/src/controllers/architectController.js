import ArchitectProfile from "../models/ArchitectProfile.js";
import User from "../models/User.js";
import { v2 as cloudinary } from "cloudinary";

/**
 * Create architect profile
 * @route POST /api/architects/create
 * @access Private (Architect only)
 */
export const createProfile = async (req, res, next) => {
  try {
    const { bio, experience, pricing, location, portfolioImages, specializations } = req.body;
    const userId = req.user?.id || req.user?._id;

    // Validate userId exists from token
    if (!userId) {
      console.log("❌ [Create Profile] No userId in JWT token");
      return res.status(401).json({
        success: false,
        message: "User not found in authentication token",
      });
    }

    console.log("📝 [Create Profile] Request received:", {
      userId,
      bio: bio?.substring(0, 50),
      experience,
      pricing,
      location,
      imageCount: portfolioImages?.length,
    });

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      console.log("❌ [Create Profile] User not found in database:", userId);
      return res.status(401).json({
        success: false,
        message: "User not found. Please log in again.",
      });
    }

    console.log("✅ [Create Profile] User found:", { id: user._id, name: user.name, role: user.role });

    // Check if user is architect role
    if (user.role !== "architect") {
      console.log("❌ [Create Profile] User role is not architect:", user.role);
      return res.status(403).json({
        success: false,
        message: "Only users with architect role can create profiles",
        userRole: user.role,
      });
    }

    // Check if profile already exists
    const existingProfile = await ArchitectProfile.findOne({ userId });
    if (existingProfile) {
      console.log("Profile already exists for user:", userId);
      return res.status(400).json({
        success: false,
        message: "Architect profile already exists for this user",
      });
    }

    // Validation
    if (!bio || experience === undefined || experience === null || pricing === undefined || pricing === null || !location) {
      console.log("Validation failed. Missing fields:", { bio: !bio, experience: experience === undefined || experience === null, pricing: pricing === undefined || pricing === null, location: !location });
      return res.status(400).json({
        success: false,
        message: "Please provide bio, experience, pricing, and location",
      });
    }

    // Convert to numbers and validate
    const expNum = parseFloat(experience);
    const priceNum = parseFloat(pricing);

    if (isNaN(expNum) || isNaN(priceNum)) {
      console.log("Validation failed. Experience and pricing must be numbers");
      return res.status(400).json({
        success: false,
        message: "Experience and pricing must be valid numbers",
      });
    }

    // Validate portfolio images (check total size)
    if (portfolioImages && portfolioImages.length > 0) {
      const totalSize = portfolioImages.reduce((acc, img) => {
        return acc + (img.url ? img.url.length : 0);
      }, 0);

      console.log("Portfolio images validation:", { count: portfolioImages.length, totalSize });

      // Limit total base64 data to 10MB
      if (totalSize > 10 * 1024 * 1024) {
        console.log("Portfolio size exceeded 10MB limit");
        return res.status(400).json({
          success: false,
          message: "Total portfolio images size exceeds 10MB limit",
        });
      }
    }

    // Create profile
    console.log("📝 Creating profile with data:", { userId, bio: bio.substring(0, 50), experience: expNum, pricing: priceNum, location });
    const profile = await ArchitectProfile.create({
      userId,
      bio,
      experience: expNum,
      pricing: priceNum,
      location,
      portfolioImages: portfolioImages || [],
      specializations: specializations || [],
    });

    console.log("✅ Profile created successfully:", {
      profileId: profile._id,
      userId: profile.userId,
    });

    res.status(201).json({
      success: true,
      message: "Architect profile created successfully",
      profile,
    });
  } catch (error) {
    console.error("❌ Create profile error - Message:", error.message);
    console.error("❌ Create profile error - Stack:", error.stack);
    next(error);
  }
};

/**
 * Get all architect profiles
 * @route GET /api/architects/all
 * @access Public
 */
export const getAllArchitects = async (req, res, next) => {
  try {
    const { search, location, specialization, minPrice, maxPrice, minRating, sortBy } = req.query;

    // Build optimized filter object using MongoDB operators
    const filter = { isAvailable: true };

    // Search by architect name or location (using $or for name search across userId.name)
    if (search) {
      // Will use text search on location field, combined with name search via $or
      filter.$or = [
        { location: new RegExp(search, "i") }
        // Note: Name search will be done via populate with filtering below
      ];
    }

    // Filter by location (case-insensitive)
    if (location && !search) {
      filter.location = new RegExp(location, "i");
    }

    // Filter by specialization (exact match in array)
    if (specialization) {
      filter.specializations = specialization;
    }

    // Filter by price range (minPrice and maxPrice)
    if (minPrice || maxPrice) {
      filter.pricing = {};
      if (minPrice) {
        filter.pricing.$gte = parseFloat(minPrice);
      }
      if (maxPrice) {
        filter.pricing.$lte = parseFloat(maxPrice);
      }
    }

    // Filter by minimum rating
    if (minRating) {
      filter.rating = { $gte: parseFloat(minRating) };
    }

    // Build optimized sort object
    let sortObj = { createdAt: -1 };
    if (sortBy === "rating") {
      sortObj = { rating: -1 };
    } else if (sortBy === "experience") {
      sortObj = { experience: -1 };
    } else if (sortBy === "pricing") {
      sortObj = { pricing: 1 };
    }

    // Execute optimized query with indexes
    const architects = await ArchitectProfile.find(filter)
      .sort(sortObj)
      .lean() // Use lean() for better performance when not modifying documents
      .populate({
        path: "userId",
        select: "name email",
      });

    // Filter by name if search is provided (post-query filtering for user names)
    let results = architects;
    if (search) {
      results = architects.filter(arch => 
        arch.userId?.name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Log query performance metrics
    console.log(`✅ Architects query executed - Filters: ${JSON.stringify(filter)} - Results: ${results.length}`);

    res.status(200).json({
      success: true,
      count: results.length,
      architects: results,
    });
  } catch (error) {
    console.error("❌ Get all architects error:", error);
    next(error);
  }
};

/**
 * Get architect by ID
 * @route GET /api/architects/:id
 * @access Public
 */
export const getArchitectById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const architect = await ArchitectProfile.findById(id).populate({
      path: "userId",
      select: "name email",
    });

    if (!architect) {
      return res.status(404).json({
        success: false,
        message: "Architect profile not found",
      });
    }

    res.status(200).json({
      success: true,
      architect,
    });
  } catch (error) {
    console.error("Get architect error:", error);
    next(error);
  }
};

/**
 * Update architect profile
 * @route PUT /api/architects/:id
 * @access Private (Own profile only)
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { bio, experience, pricing, location, portfolioImages, specializations, isAvailable } = req.body;

    console.log("Update profile request:", {
      profileId: id,
      userId: req.user.id,
      bio: bio?.substring(0, 50),
      experience,
      pricing,
      location,
      imageCount: portfolioImages?.length,
    });

    const profile = await ArchitectProfile.findById(id);

    if (!profile) {
      console.log("Profile not found:", id);
      return res.status(404).json({
        success: false,
        message: "Architect profile not found",
      });
    }

    // Check ownership
    if (profile.userId.toString() !== req.user.id) {
      console.log("Unauthorized update attempt. Profile userId:", profile.userId, "Request userId:", req.user.id);
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this profile",
      });
    }

    // Update fields
    if (bio) profile.bio = bio;
    if (experience !== undefined) {
      const expNum = parseFloat(experience);
      if (!isNaN(expNum)) profile.experience = expNum;
    }
    if (pricing !== undefined) {
      const priceNum = parseFloat(pricing);
      if (!isNaN(priceNum)) profile.pricing = priceNum;
    }
    if (location) profile.location = location;
    if (portfolioImages) profile.portfolioImages = portfolioImages;
    if (specializations) profile.specializations = specializations;
    if (isAvailable !== undefined) profile.isAvailable = isAvailable;

    await profile.save();

    console.log("Profile updated successfully:", id);
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profile,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    next(error);
  }
};

/**
 * Get current user's architect profile
 * @route GET /api/architects/my-profile
 * @access Private (Architect only)
 */
export const getMyProfile = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?._id;

    // Validate userId exists from token
    if (!userId) {
      console.log("❌ [Get My Profile] No userId in JWT token");
      return res.status(401).json({
        success: false,
        message: "User not found in authentication token",
      });
    }

    console.log("🔍 [Get My Profile] Fetching profile for userId:", userId);

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      console.log("❌ [Get My Profile] User not found in database:", userId);
      return res.status(401).json({
        success: false,
        message: "User not found. Please log in again.",
      });
    }

    // Fetch architect profile
    const profile = await ArchitectProfile.findOne({ userId }).populate({
      path: "userId",
      select: "name email role",
    });

    if (!profile) {
      console.log("ℹ️ [Get My Profile] No architect profile found for user:", userId);
      return res.status(404).json({
        success: false,
        message: "You don't have an architect profile yet",
      });
    }

    console.log("✅ [Get My Profile] Profile found:", { profileId: profile._id, userId });

    res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error("❌ [Get My Profile] Error:", error.message);
    next(error);
  }
};

/**
 * Upload image to Cloudinary
 * @route POST /api/architects/upload-image
 * @access Private
 */
export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file provided",
      });
    }

    // Configure Cloudinary with current env vars
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    console.log("Uploading image to Cloudinary:", {
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    });

    // Upload to Cloudinary using upload_stream
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        folder: "cozy-corner/portfolio",
        quality: "auto",
        fetch_format: "auto",
        transformation: [
          { width: 1200, height: 800, crop: "limit" }, // Max dimensions
          { quality: "auto" },
        ],
      },
      async (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return res.status(500).json({
            success: false,
            message: "Failed to upload image to Cloudinary",
            error: error.message,
          });
        }

        console.log("Cloudinary upload successful:", {
          publicId: result.public_id,
          url: result.secure_url,
          format: result.format,
          bytes: result.bytes,
        });

        res.status(200).json({
          success: true,
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
          bytes: result.bytes,
        });
      }
    );

    // End the stream with the file buffer
    uploadStream.end(req.file.buffer);
  } catch (error) {
    console.error("Image upload error:", error);
    next(error);
  }
};
