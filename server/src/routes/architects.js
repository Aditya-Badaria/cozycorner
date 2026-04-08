import express from "express";
import {
  createProfile,
  getAllArchitects,
  getArchitectById,
  updateProfile,
  getMyProfile,
  uploadImage,
} from "../controllers/architectController.js";
import { protect, authorize } from "../middleware/auth.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Protected routes (require authentication) - specific routes MUST come before ID-based routes
router.post("/create", protect, createProfile);
router.get("/my-profile", protect, getMyProfile);
router.post("/upload-image", protect, upload.single("image"), uploadImage);
router.put("/:id", protect, updateProfile);

// Public routes - must come AFTER all specific routes
router.get("/all", getAllArchitects);
router.get("/:id", getArchitectById);

export default router;
