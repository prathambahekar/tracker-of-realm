import { RequestHandler } from "express";
import { spawn, ChildProcess } from "child_process";
import { EventEmitter } from "events";
import path from "path";
import fs from "fs";

interface TrackerStatus {
  isRunning: boolean;
  currentSession: any;
  systemMetrics: any;
  lastUpdate: string;
}

interface TrackerData {
  applications: any;
  metadata: any;
  stats: any;
}

class PythonTrackerManager extends EventEmitter {
  private trackerProcess: ChildProcess | null = null;
  private status: TrackerStatus = {
    isRunning: false,
    currentSession: null,
    systemMetrics: null,
    lastUpdate: new Date().toISOString(),
  };
  private dataFile = path.join(process.cwd(), "app_usage_log.json");
  private statsFile = path.join(process.cwd(), "app_usage_log.stats.json");

  constructor() {
    super();
    this.setupFileWatchers();
  }

  private setupFileWatchers() {
    // Watch for changes in the data files
    if (fs.existsSync(this.dataFile)) {
      fs.watchFile(this.dataFile, () => {
        this.emit("dataUpdated");
      });
    }

    if (fs.existsSync(this.statsFile)) {
      fs.watchFile(this.statsFile, () => {
        this.emit("statsUpdated");
      });
    }
  }

  async startTracking(): Promise<boolean> {
    if (this.trackerProcess && !this.trackerProcess.killed) {
      return false; // Already running
    }

    try {
      // In a real implementation, you would run the Python script
      // For demo purposes, we'll simulate the process
      this.status.isRunning = true;
      this.status.lastUpdate = new Date().toISOString();

      // Simulate starting the Python tracker
      console.log("Starting Python tracker...");

      // In reality, you would do:
      // this.trackerProcess = spawn('python', ['path/to/your/tracker.py']);

      this.emit("trackingStarted");
      return true;
    } catch (error) {
      console.error("Failed to start Python tracker:", error);
      return false;
    }
  }

  async stopTracking(): Promise<boolean> {
    if (!this.trackerProcess || this.trackerProcess.killed) {
      this.status.isRunning = false;
      return true; // Already stopped
    }

    try {
      this.trackerProcess.kill("SIGTERM");
      this.status.isRunning = false;
      this.status.lastUpdate = new Date().toISOString();

      this.emit("trackingStopped");
      return true;
    } catch (error) {
      console.error("Failed to stop Python tracker:", error);
      return false;
    }
  }

  getStatus(): TrackerStatus {
    return { ...this.status };
  }

  async getTrackerData(): Promise<TrackerData | null> {
    try {
      if (fs.existsSync(this.dataFile)) {
        const data = JSON.parse(fs.readFileSync(this.dataFile, "utf8"));
        return data;
      }
      return null;
    } catch (error) {
      console.error("Failed to read tracker data:", error);
      return null;
    }
  }

  async getStats(): Promise<any> {
    try {
      if (fs.existsSync(this.statsFile)) {
        const stats = JSON.parse(fs.readFileSync(this.statsFile, "utf8"));
        return stats;
      }
      return null;
    } catch (error) {
      console.error("Failed to read tracker stats:", error);
      return null;
    }
  }

  async exportData(format: "json" | "csv" = "json"): Promise<string | null> {
    try {
      const data = await this.getTrackerData();
      if (!data) return null;

      if (format === "json") {
        return JSON.stringify(data, null, 2);
      } else if (format === "csv") {
        // Convert to CSV format
        return this.convertToCSV(data);
      }

      return null;
    } catch (error) {
      console.error("Failed to export data:", error);
      return null;
    }
  }

  private convertToCSV(data: any): string {
    // Simple CSV conversion for app usage data
    const headers = [
      "App Name",
      "Category",
      "Total Duration (s)",
      "Sessions",
      "Last Used",
    ];
    const rows = [headers.join(",")];

    if (data.applications) {
      Object.entries(data.applications).forEach(
        ([appName, appData]: [string, any]) => {
          const row = [
            appName,
            appData.category || "unknown",
            appData.total_duration || 0,
            appData.total_sessions || 0,
            appData.last_used || "N/A",
          ];
          rows.push(row.join(","));
        },
      );
    }

    return rows.join("\n");
  }

  async createBackup(): Promise<string | null> {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const backupFile = path.join(
        process.cwd(),
        `app_usage_backup_${timestamp}.json`,
      );

      if (fs.existsSync(this.dataFile)) {
        fs.copyFileSync(this.dataFile, backupFile);
        return backupFile;
      }

      return null;
    } catch (error) {
      console.error("Failed to create backup:", error);
      return null;
    }
  }

  // Simulate real-time data for demo purposes
  generateMockData() {
    const now = new Date();

    this.status.currentSession = {
      session_id: `session_${Date.now()}`,
      app_name: "msedge.exe",
      start: new Date(now.getTime() - 1800000).toISOString(), // 30 minutes ago
      window_title: "System Monitor - Real-time Tracker",
      pid: 12345,
      category: "browser",
      productivity_score: 7,
      idle_time: 0,
      switch_count: 3,
      metadata: {
        day_of_week: now.toLocaleDateString("en-US", { weekday: "long" }),
        hour: now.getHours(),
        is_weekend: now.getDay() === 0 || now.getDay() === 6,
        time_of_day:
          now.getHours() < 12
            ? "morning"
            : now.getHours() < 17
              ? "afternoon"
              : "evening",
      },
    };

    this.status.systemMetrics = {
      cpu_percent: Math.floor(Math.random() * 30) + 20,
      memory_mb: Math.floor(Math.random() * 1000) + 4000,
      active_app: "msedge.exe",
      window_title: "System Monitor - Real-time Tracker",
      switch_count: 47,
      uptime_seconds: 24567,
      productivity_score: 78,
    };

    this.status.lastUpdate = now.toISOString();
    this.emit("dataUpdated");
  }
}

// Global tracker manager instance
const trackerManager = new PythonTrackerManager();

// Start generating mock data every 5 seconds for demo
setInterval(() => {
  if (trackerManager.getStatus().isRunning) {
    trackerManager.generateMockData();
  }
}, 5000);

// Route handlers
export const getTrackerStatus: RequestHandler = (req, res) => {
  const status = trackerManager.getStatus();
  res.json(status);
};

export const startTracker: RequestHandler = async (req, res) => {
  try {
    const success = await trackerManager.startTracking();
    if (success) {
      res.json({ success: true, message: "Tracker started successfully" });
    } else {
      res
        .status(400)
        .json({ success: false, message: "Tracker is already running" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to start tracker" });
  }
};

export const stopTracker: RequestHandler = async (req, res) => {
  try {
    const success = await trackerManager.stopTracking();
    if (success) {
      res.json({ success: true, message: "Tracker stopped successfully" });
    } else {
      res
        .status(400)
        .json({ success: false, message: "Tracker is not running" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to stop tracker" });
  }
};

export const getTrackerData: RequestHandler = async (req, res) => {
  try {
    const data = await trackerManager.getTrackerData();
    if (data) {
      res.json(data);
    } else {
      res.status(404).json({ message: "No tracker data available" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve tracker data" });
  }
};

export const getTrackerStats: RequestHandler = async (req, res) => {
  try {
    const stats = await trackerManager.getStats();
    if (stats) {
      res.json(stats);
    } else {
      res.status(404).json({ message: "No tracker stats available" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve tracker stats" });
  }
};

export const exportTrackerData: RequestHandler = async (req, res) => {
  try {
    const format = (req.query.format as string) || "json";
    const data = await trackerManager.exportData(format as "json" | "csv");

    if (data) {
      const filename = `usage_report_${new Date().toISOString().split("T")[0]}.${format}`;
      const contentType = format === "json" ? "application/json" : "text/csv";

      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`,
      );
      res.setHeader("Content-Type", contentType);
      res.send(data);
    } else {
      res.status(404).json({ message: "No data to export" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to export data" });
  }
};

export const createTrackerBackup: RequestHandler = async (req, res) => {
  try {
    const backupFile = await trackerManager.createBackup();
    if (backupFile) {
      res.json({
        success: true,
        backupFile,
        message: "Backup created successfully",
      });
    } else {
      res.status(404).json({ success: false, message: "No data to backup" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to create backup" });
  }
};

// WebSocket-style real-time updates (for Server-Sent Events)
export const getTrackerStream: RequestHandler = (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "Access-Control-Allow-Origin": "*",
  });

  const sendData = () => {
    const status = trackerManager.getStatus();
    res.write(`data: ${JSON.stringify(status)}\n\n`);
  };

  // Send initial data
  sendData();

  // Send updates when data changes
  const handleUpdate = () => sendData();
  trackerManager.on("dataUpdated", handleUpdate);
  trackerManager.on("trackingStarted", handleUpdate);
  trackerManager.on("trackingStopped", handleUpdate);

  // Clean up on client disconnect
  req.on("close", () => {
    trackerManager.off("dataUpdated", handleUpdate);
    trackerManager.off("trackingStarted", handleUpdate);
    trackerManager.off("trackingStopped", handleUpdate);
  });
};

export { trackerManager };
