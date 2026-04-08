import express from "express";
import {
  register,
  login,
  getCurrentUser,
  logout,
} from "../controllers/authController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes
router.get("/me", protect, getCurrentUser);
router.post("/logout", protect, logout);

// Role-specific protected route example
router.get("/architect-only", protect, authorize("architect"), (req, res) => {
  res.json({
    success: true,
    message: "This route is only accessible to architects",
  });
});

export default router;
