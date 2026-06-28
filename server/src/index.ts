import express, { type Express } from "express";
import cors from "cors";
import dotenv from "dotenv";

import { connectDb } from "./db/dbConnection.js";
import jobRoutes from "./routes/job.routes.js";
import eventRoutes from "./routes/event.routes.js";
import sseRoutes from "./routes/sse.routes.js";

dotenv.config();

const app: Express = express();

const PORT = process.env.PORT || 3000;

// Connect MongoDB
connectDb();

// Middlewares
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());

// Routes
app.use("/api/jobs", jobRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/stream", sseRoutes);

// Health Check
app.get("/", (_, res) => {
  res.json({
    success: true,
    message: "RegisterKaro Automation API Running 🚀",
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`⚡ Server running on http://localhost:${PORT}`);
});
