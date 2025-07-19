import { useState, useEffect, useCallback } from "react";

interface AppSession {
  session_id: string;
  app_name: string;
  start: string;
  end?: string;
  duration_seconds: number;
  window_title: string;
  pid: number;
  category: string;
  productivity_score?: number;
  idle_time: number;
  switch_count: number;
  metadata: {
    day_of_week: string;
    hour: number;
    is_weekend: boolean;
    time_of_day: string;
  };
}

interface SystemMetrics {
  cpu_percent: number;
  memory_mb: number;
  active_app: string;
  window_title: string;
  switch_count: number;
  uptime_seconds: number;
  productivity_score: number;
}

interface ProductivityMetrics {
  total_time: number;
  productive_time: number;
  productivity_percentage: number;
  distraction_time: number;
  focus_sessions: number;
  interruptions: number;
}

interface CategoryBreakdown {
  [category: string]: {
    total_duration: number;
    total_sessions: number;
    app_count: number;
    productivity_score: number;
  };
}

interface RealtimeData {
  currentSession: AppSession | null;
  systemMetrics: SystemMetrics | null;
  todaysSessions: AppSession[];
  productivityMetrics: ProductivityMetrics | null;
  categoryBreakdown: CategoryBreakdown;
  topApps: Array<{
    name: string;
    duration: number;
    category: string;
    sessions: number;
  }>;
  isTracking: boolean;
  lastUpdate: Date | null;
}

export function useRealtimeData() {
  const [data, setData] = useState<RealtimeData>({
    currentSession: null,
    systemMetrics: null,
    todaysSessions: [],
    productivityMetrics: null,
    categoryBreakdown: {},
    topApps: [],
    isTracking: false,
    lastUpdate: null,
  });

  const [connectionStatus, setConnectionStatus] = useState<
    "connecting" | "connected" | "disconnected"
  >("disconnected");

  // Simulate real-time data updates (replace with actual WebSocket/API integration)
  const generateMockData = useCallback((): RealtimeData => {
    const now = new Date();
    const startTime = new Date(now.getTime() - 1800000); // 30 minutes ago

    const currentSession: AppSession = {
      session_id: `session_${Date.now()}`,
      app_name: "msedge.exe",
      start: startTime.toISOString(),
      duration_seconds: Math.floor(
        (now.getTime() - startTime.getTime()) / 1000,
      ),
      window_title: "System Monitor - Analytics",
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

    const systemMetrics: SystemMetrics = {
      cpu_percent: Math.floor(Math.random() * 30) + 20,
      memory_mb: Math.floor(Math.random() * 1000) + 4000,
      active_app: "msedge.exe",
      window_title: "System Monitor - Analytics",
      switch_count: 47,
      uptime_seconds: 24567,
      productivity_score: 78,
    };

    const productivityMetrics: ProductivityMetrics = {
      total_time: 28800, // 8 hours
      productive_time: 22464, // ~6.2 hours
      productivity_percentage: 78,
      distraction_time: 6336,
      focus_sessions: 12,
      interruptions: 8,
    };

    const categoryBreakdown: CategoryBreakdown = {
      development: {
        total_duration: 10800,
        total_sessions: 8,
        app_count: 3,
        productivity_score: 9,
      },
      browser: {
        total_duration: 7200,
        total_sessions: 15,
        app_count: 2,
        productivity_score: 6,
      },
      communication: {
        total_duration: 3600,
        total_sessions: 12,
        app_count: 2,
        productivity_score: 7,
      },
      office: {
        total_duration: 5400,
        total_sessions: 6,
        app_count: 4,
        productivity_score: 8,
      },
      entertainment: {
        total_duration: 1800,
        total_sessions: 3,
        app_count: 2,
        productivity_score: 3,
      },
    };

    const topApps = [
      {
        name: "Visual Studio Code",
        duration: 10800,
        category: "development",
        sessions: 8,
      },
      {
        name: "Microsoft Edge",
        duration: 7200,
        category: "browser",
        sessions: 15,
      },
      {
        name: "Microsoft Excel",
        duration: 5400,
        category: "office",
        sessions: 6,
      },
      {
        name: "Microsoft Teams",
        duration: 3600,
        category: "communication",
        sessions: 12,
      },
      {
        name: "Spotify",
        duration: 1800,
        category: "entertainment",
        sessions: 3,
      },
    ];

    return {
      currentSession,
      systemMetrics,
      todaysSessions: [currentSession],
      productivityMetrics,
      categoryBreakdown,
      topApps,
      isTracking: true,
      lastUpdate: now,
    };
  }, []);

  // Simulate WebSocket connection and real-time updates
  useEffect(() => {
    setConnectionStatus("connecting");

    // Simulate connection delay
    const connectTimer = setTimeout(() => {
      setConnectionStatus("connected");
      setData(generateMockData());
    }, 1000);

    // Update data every 5 seconds
    const updateInterval = setInterval(() => {
      if (connectionStatus === "connected") {
        setData(generateMockData());
      }
    }, 5000);

    return () => {
      clearTimeout(connectTimer);
      clearInterval(updateInterval);
    };
  }, [generateMockData, connectionStatus]);

  // API methods that connect to Python backend
  const startTracking = useCallback(async () => {
    try {
      const response = await fetch("/api/tracker/start", { method: "POST" });
      const result = await response.json();
      if (result.success) {
        setData((prev) => ({ ...prev, isTracking: true }));
      } else {
        console.error("Failed to start tracking:", result.message);
      }
    } catch (error) {
      console.error("Failed to start tracking:", error);
    }
  }, []);

  const stopTracking = useCallback(async () => {
    try {
      const response = await fetch("/api/tracker/stop", { method: "POST" });
      const result = await response.json();
      if (result.success) {
        setData((prev) => ({ ...prev, isTracking: false }));
      } else {
        console.error("Failed to stop tracking:", result.message);
      }
    } catch (error) {
      console.error("Failed to stop tracking:", error);
    }
  }, []);

  const exportData = useCallback(async (format: "json" | "csv" = "json") => {
    try {
      const response = await fetch(`/api/tracker/export?format=${format}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `usage_report_${new Date().toISOString().split("T")[0]}.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        console.error("Failed to export data");
      }
    } catch (error) {
      console.error("Failed to export data:", error);
    }
  }, []);

  const createBackup = useCallback(async () => {
    try {
      const response = await fetch("/api/tracker/backup", { method: "POST" });
      const result = await response.json();
      if (result.success) {
        console.log("Backup created:", result.backupFile);
      } else {
        console.error("Failed to create backup:", result.message);
      }
    } catch (error) {
      console.error("Failed to create backup:", error);
    }
  }, []);

  const getSessionDetails = useCallback(
    (sessionId: string) => {
      // Find session details from current data
      return data.todaysSessions.find(
        (session) => session.session_id === sessionId,
      );
    },
    [data.todaysSessions],
  );

  const formatDuration = useCallback((seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  }, []);

  return {
    data,
    connectionStatus,
    startTracking,
    stopTracking,
    exportData,
    createBackup,
    getSessionDetails,
    formatDuration,
    isLoading: connectionStatus === "connecting",
    isConnected: connectionStatus === "connected",
  };
}
