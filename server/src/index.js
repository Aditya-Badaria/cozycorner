import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import "express-async-errors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/database.js";
import errorHandler from "./middleware/errorHandler.js";
import usersRouter from "./routes/users.js";
import authRouter from "./routes/auth.js";
import architectRouter from "./routes/architects.js";
import requestsRouter from "./routes/requests.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, "..", ".env");
console.log("Loading .env from:", envPath);
const result = dotenv.config({ path: envPath });
console.log("dotenv.config result:", result.error ? result.error.message : "Success");
if (result.parsed) {
  console.log("Loaded env vars:", Object.keys(result.parsed));
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));
// Increase payload limit to 50MB for image uploads
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Connect to MongoDB
connectDB();

// Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running", timestamp: new Date() });
});

app.use("/api/auth", authRouter);
app.use("/api/architects", architectRouter);
app.use("/api/users", usersRouter);
app.use("/api/requests", requestsRouter);

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
