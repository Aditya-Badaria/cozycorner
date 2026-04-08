import express from "express";
import {
  createRequest,
  getArchitectRequests,
  getUserRequests,
  updateRequestStatus,
  deleteRequest,
  deleteAllRequests,
} from "../controllers/requestController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Protected routes
router.post("/", protect, createRequest);
router.get("/my-requests", protect, getUserRequests);
router.get("/architect/:architectId", protect, getArchitectRequests);
router.put("/:requestId", protect, updateRequestStatus);
router.delete("/:requestId", protect, deleteRequest);
router.delete("/", deleteAllRequests); // No auth required for admin cleanup

export default router;
