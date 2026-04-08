import mongoose from "mongoose";

const architectProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      unique: true,
    },
    bio: {
      type: String,
      maxlength: [1000, "Bio cannot exceed 1000 characters"],
      default: "",
    },
    experience: {
      type: Number,
      min: [0, "Experience cannot be negative"],
      default: 0,
      description: "Years of experience",
    },
    pricing: {
      type: Number,
      min: [0, "Pricing cannot be negative"],
      default: 0,
      description: "Hourly rate or project rate in USD",
    },
    location: {
      type: String,
      maxlength: [200, "Location cannot exceed 200 characters"],
      default: "",
    },
    portfolioImages: [
      {
        url: {
          type: String,
          required: true,
        },
        title: {
          type: String,
          default: "",
        },
        description: {
          type: String,
          default: "",
        },
      },
    ],
    specializations: [
      {
        type: String,
        enum: ["residential", "commercial", "hospitality", "retail", "mixed"],
      },
    ],
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Populate user details when querying architect profiles
architectProfileSchema.pre(/^find/, function (next) {
  if (this.options._recursed) {
    return next();
  }
  this.populate({
    path: "userId",
    select: "name email",
    options: { _recursed: true },
  });
  next();
});

// Create indexes for optimal query performance
architectProfileSchema.index({ location: "text" });
architectProfileSchema.index({ pricing: 1 });
architectProfileSchema.index({ rating: -1 });
architectProfileSchema.index({ experience: -1 });
architectProfileSchema.index({ createdAt: -1 });
architectProfileSchema.index({ specializations: 1 });
architectProfileSchema.index({ isAvailable: 1 });

const ArchitectProfile = mongoose.model("ArchitectProfile", architectProfileSchema);

export default ArchitectProfile;
