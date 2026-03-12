import express from "express";
import {
  accessLogger,
  errorLogger,
  consoleLogger,
} from "./api/v1/middleware/logger";
import errorHandler from "./api/v1/middleware/errorHandler";
import loanRoutes from "./api/v1/routes/loanRoutes";
import userRoutes from "./api/v1/routes/userRoutes";
import adminRoutes from "./api/v1/routes/adminRoutes";
import { healthCheck } from "./api/v1/controllers/healthController";

const app = express();

// Logging middleware (should be applied early in the middleware stack)
if (process.env.NODE_ENV === "production") {
  // In production, log to files
  app.use(accessLogger);
  app.use(errorLogger);
} else {
  // In development, log to console for immediate feedback
  app.use(consoleLogger);
}

// Body parsing middleware
app.use(express.json());

// Health check endpoint (public - no authentication required)
app.get("/api/v1/health", healthCheck);

// API Routes
app.use("/api/v1/loans", loanRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/", adminRoutes);

// Global error handling middleware (MUST be applied last)
app.use(errorHandler);

export default app;