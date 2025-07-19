import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  getTrackerStatus,
  startTracker,
  stopTracker,
  getTrackerData,
  getTrackerStats,
  exportTrackerData,
  createTrackerBackup,
  getTrackerStream,
} from "./routes/tracker";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  app.get("/api/demo", handleDemo);

  // Python Tracker API routes
  app.get("/api/tracker/status", getTrackerStatus);
  app.post("/api/tracker/start", startTracker);
  app.post("/api/tracker/stop", stopTracker);
  app.get("/api/tracker/data", getTrackerData);
  app.get("/api/tracker/stats", getTrackerStats);
  app.get("/api/tracker/export", exportTrackerData);
  app.post("/api/tracker/backup", createTrackerBackup);
  app.get("/api/tracker/stream", getTrackerStream);

  return app;
}
