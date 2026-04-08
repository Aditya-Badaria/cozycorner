import express from "express";

const router = express.Router();

// Get all users
router.get("/", (req, res) => {
  res.json({ message: "Get all users", users: [] });
});

// Get user by ID
router.get("/:id", (req, res) => {
  res.json({ message: `Get user ${req.params.id}` });
});

// Create user
router.post("/", (req, res) => {
  res.json({ message: "User created", user: req.body });
});

// Update user
router.put("/:id", (req, res) => {
  res.json({ message: `User ${req.params.id} updated`, user: req.body });
});

// Delete user
router.delete("/:id", (req, res) => {
  res.json({ message: `User ${req.params.id} deleted` });
});

export default router;
