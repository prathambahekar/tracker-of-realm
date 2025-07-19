import { useState, useEffect } from "react";
import { useRealtimeData } from "../hooks/useRealtimeData";
import {
  Play,
  Pause,
  Square,
  Download,
  RotateCcw,
  Activity,
  Clock,
  Target,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  Wifi,
  WifiOff,
  Smartphone,
  Monitor,
  Zap,
  BarChart3,
  PieChart,
  Settings,
} from "lucide-react";

interface TrackerControlsProps {
  isTracking: boolean;
  onStart: () => void;
  onStop: () => void;
  onExport: () => void;
  onBackup: () => void;
  connectionStatus: "connecting" | "connected" | "disconnected";
}

function TrackerControls({
  isTracking,
  onStart,
  onStop,
  onExport,
  onBackup,
  connectionStatus,
}: TrackerControlsProps) {
  const getStatusIcon = () => {
    switch (connectionStatus) {
      case "connected":
        return <Wifi className="h-4 w-4 text-success" />;
      case "connecting":
        return <Activity className="h-4 w-4 text-warning animate-pulse" />;
      default:
        return <WifiOff className="h-4 w-4 text-destructive" />;
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case "connected":
        return "Connected";
      case "connecting":
        return "Connecting...";
      default:
        return "Disconnected";
    }
  };

  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            Python Tracker Control
          </h2>
          <div className="flex items-center space-x-2 mt-1">
            {getStatusIcon()}
            <span className="text-sm text-muted-foreground">
              {getStatusText()}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div
            className={`w-3 h-3 rounded-full ${
              isTracking ? "bg-success animate-pulse" : "bg-muted"
            }`}
          />
          <span className="text-sm font-medium text-foreground">
            {isTracking ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button
          onClick={isTracking ? onStop : onStart}
          disabled={connectionStatus !== "connected"}
          className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-colors ${
            isTracking
              ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
              : "bg-success text-success-foreground hover:bg-success/90"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isTracking ? (
            <>
              <Square className="h-4 w-4" />
              <span>Stop</span>
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              <span>Start</span>
            </>
          )}
        </button>

        <button
          onClick={onExport}
          disabled={connectionStatus !== "connected"}
          className="flex items-center justify-center space-x-2 px-4 py-3 bg-info text-info-foreground rounded-lg font-medium hover:bg-info/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="h-4 w-4" />
          <span>Export</span>
        </button>

        <button
          onClick={onBackup}
          disabled={connectionStatus !== "connected"}
          className="flex items-center justify-center space-x-2 px-4 py-3 bg-warning text-warning-foreground rounded-lg font-medium hover:bg-warning/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Backup</span>
        </button>

        <button
          disabled={connectionStatus !== "connected"}
          className="flex items-center justify-center space-x-2 px-4 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Settings className="h-4 w-4" />
          <span>Config</span>
        </button>
      </div>
    </div>
  );
}

interface CurrentSessionProps {
  session: any;
  formatDuration: (seconds: number) => string;
}

function CurrentSession({ session, formatDuration }: CurrentSessionProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!session) return;

    const startTime = new Date(session.start).getTime();
    const updateElapsed = () => {
      const now = Date.now();
      setElapsed(Math.floor((now - startTime) / 1000));
    };

    updateElapsed();
    const interval = setInterval(updateElapsed, 1000);
    return () => clearInterval(interval);
  }, [session]);

  if (!session) {
    return (
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="text-center py-8">
          <Monitor className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No Active Session
          </h3>
          <p className="text-sm text-muted-foreground">
            Start tracking to monitor your current application usage
          </p>
        </div>
      </div>
    );
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      development: "bg-success/10 text-success border-success/20",
      browser: "bg-info/10 text-info border-info/20",
      communication: "bg-warning/10 text-warning border-warning/20",
      office: "bg-primary/10 text-primary border-primary/20",
      media: "bg-destructive/10 text-destructive border-destructive/20",
      gaming: "bg-accent/10 text-accent-foreground border-accent/20",
      system: "bg-muted/10 text-muted-foreground border-muted/20",
      utilities:
        "bg-secondary/10 text-secondary-foreground border-secondary/20",
    };
    return colors[category] || colors.system;
  };

  const getProductivityIcon = (score: number) => {
    if (score >= 8) return <TrendingUp className="h-4 w-4 text-success" />;
    if (score >= 6) return <Target className="h-4 w-4 text-warning" />;
    return <AlertCircle className="h-4 w-4 text-destructive" />;
  };

  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">
          Current Session
        </h2>
        <div className="flex items-center space-x-2">
          <Activity className="h-4 w-4 text-success animate-pulse" />
          <span className="text-sm font-medium text-success">Live</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
            <Smartphone className="h-6 w-6 text-accent-foreground" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">
              {session.app_name}
            </h3>
            <p className="text-sm text-muted-foreground truncate">
              {session.window_title}
            </p>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(session.category)}`}
          >
            {session.category}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">
              {formatDuration(elapsed)}
            </div>
            <div className="text-sm text-muted-foreground">Duration</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1">
              <span className="text-2xl font-bold text-foreground">
                {session.productivity_score || 0}
              </span>
              {getProductivityIcon(session.productivity_score || 0)}
            </div>
            <div className="text-sm text-muted-foreground">Productivity</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">
              {session.switch_count || 0}
            </div>
            <div className="text-sm text-muted-foreground">Switches</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">
              {session.pid || 0}
            </div>
            <div className="text-sm text-muted-foreground">PID</div>
          </div>
        </div>

        <div className="bg-accent/30 rounded-lg p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Session Started</span>
            <span className="font-medium text-foreground">
              {new Date(session.start).toLocaleTimeString()}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-muted-foreground">Time of Day</span>
            <span className="font-medium text-foreground capitalize">
              {session.metadata?.time_of_day || "unknown"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ProductivityInsightsProps {
  productivityMetrics: any;
  categoryBreakdown: any;
  formatDuration: (seconds: number) => string;
}

function ProductivityInsights({
  productivityMetrics,
  categoryBreakdown,
  formatDuration,
}: ProductivityInsightsProps) {
  if (!productivityMetrics) {
    return (
      <div className="bg-card rounded-xl p-6 border border-border">
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Productivity Insights
        </h2>
        <div className="text-center py-8">
          <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">
            No productivity data available yet
          </p>
        </div>
      </div>
    );
  }

  const productivityScore = productivityMetrics.productivity_percentage;
  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-success";
    if (score >= 50) return "text-warning";
    return "text-destructive";
  };

  const getScoreIcon = (score: number) => {
    if (score >= 70) return <CheckCircle className="h-5 w-5 text-success" />;
    if (score >= 50) return <AlertCircle className="h-5 w-5 text-warning" />;
    return <XCircle className="h-5 w-5 text-destructive" />;
  };

  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <h2 className="text-xl font-semibold text-foreground mb-6">
        Productivity Insights
      </h2>

      <div className="space-y-6">
        {/* Overall Score */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            {getScoreIcon(productivityScore)}
            <span
              className={`text-4xl font-bold ${getScoreColor(productivityScore)}`}
            >
              {productivityScore}%
            </span>
          </div>
          <p className="text-sm text-muted-foreground">Overall Productivity</p>
        </div>

        {/* Time Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-lg font-bold text-foreground">
              {formatDuration(productivityMetrics.total_time)}
            </div>
            <div className="text-sm text-muted-foreground">Total Time</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-success">
              {formatDuration(productivityMetrics.productive_time)}
            </div>
            <div className="text-sm text-muted-foreground">Productive</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-destructive">
              {formatDuration(productivityMetrics.distraction_time)}
            </div>
            <div className="text-sm text-muted-foreground">Distractions</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Productivity Goal</span>
            <span className="text-foreground">70%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${
                productivityScore >= 70
                  ? "bg-success"
                  : productivityScore >= 50
                    ? "bg-warning"
                    : "bg-destructive"
              }`}
              style={{ width: `${Math.min(productivityScore, 100)}%` }}
            />
          </div>
        </div>

        {/* Focus Sessions */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-accent/30 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-foreground">
              {productivityMetrics.focus_sessions}
            </div>
            <div className="text-xs text-muted-foreground">Focus Sessions</div>
          </div>
          <div className="bg-accent/30 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-foreground">
              {productivityMetrics.interruptions}
            </div>
            <div className="text-xs text-muted-foreground">Interruptions</div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface CategoryBreakdownProps {
  categoryBreakdown: any;
  formatDuration: (seconds: number) => string;
}

function CategoryBreakdown({
  categoryBreakdown,
  formatDuration,
}: CategoryBreakdownProps) {
  const categories = Object.entries(categoryBreakdown).map(
    ([name, data]: [string, any]) => ({
      name,
      ...data,
    }),
  );

  const totalTime = categories.reduce(
    (sum, cat) => sum + cat.total_duration,
    0,
  );

  const getCategoryIcon = (category: string) => {
    const icons = {
      development: "💻",
      browser: "🌐",
      communication: "💬",
      office: "📊",
      media: "🎵",
      gaming: "🎮",
      system: "⚙️",
      utilities: "🔧",
    };
    return icons[category] || "📱";
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      development: "bg-success",
      browser: "bg-info",
      communication: "bg-warning",
      office: "bg-primary",
      media: "bg-destructive",
      gaming: "bg-purple-500",
      system: "bg-gray-500",
      utilities: "bg-cyan-500",
    };
    return colors[category] || "bg-gray-500";
  };

  if (categories.length === 0) {
    return (
      <div className="bg-card rounded-xl p-6 border border-border">
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Category Breakdown
        </h2>
        <div className="text-center py-8">
          <PieChart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">
            No category data available yet
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <h2 className="text-xl font-semibold text-foreground mb-6">
        Category Breakdown
      </h2>

      <div className="space-y-4">
        {categories
          .sort((a, b) => b.total_duration - a.total_duration)
          .map((category) => {
            const percentage = totalTime
              ? (category.total_duration / totalTime) * 100
              : 0;

            return (
              <div key={category.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">
                      {getCategoryIcon(category.name)}
                    </span>
                    <div>
                      <p className="font-medium text-foreground capitalize">
                        {category.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {category.app_count} apps, {category.total_sessions}{" "}
                        sessions
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">
                      {formatDuration(category.total_duration)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {percentage.toFixed(1)}%
                    </p>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getCategoryColor(category.name)}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default function RealTimeTracker() {
  const {
    data,
    connectionStatus,
    startTracking,
    stopTracking,
    exportData,
    createBackup,
    formatDuration,
  } = useRealtimeData();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Real-Time Activity Tracker
        </h1>
        <p className="text-muted-foreground mt-2">
          Live monitoring powered by Python enhanced tracker with AI insights
        </p>
      </div>

      {/* Tracker Controls */}
      <TrackerControls
        isTracking={data.isTracking}
        onStart={startTracking}
        onStop={stopTracking}
        onExport={() => exportData("json")}
        onBackup={createBackup}
        connectionStatus={connectionStatus}
      />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Current Session */}
        <CurrentSession
          session={data.currentSession}
          formatDuration={formatDuration}
        />

        {/* Productivity Insights */}
        <ProductivityInsights
          productivityMetrics={data.productivityMetrics}
          categoryBreakdown={data.categoryBreakdown}
          formatDuration={formatDuration}
        />
      </div>

      {/* Category Breakdown */}
      <CategoryBreakdown
        categoryBreakdown={data.categoryBreakdown}
        formatDuration={formatDuration}
      />

      {/* System Status */}
      {data.systemMetrics && (
        <div className="bg-card rounded-xl p-6 border border-border">
          <h2 className="text-xl font-semibold text-foreground mb-6">
            System Performance
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">
                {data.systemMetrics.cpu_percent}%
              </div>
              <div className="text-sm text-muted-foreground">CPU Usage</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">
                {(data.systemMetrics.memory_mb / 1024).toFixed(1)} GB
              </div>
              <div className="text-sm text-muted-foreground">Memory</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">
                {formatDuration(data.systemMetrics.uptime_seconds)}
              </div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">
                {data.systemMetrics.switch_count}
              </div>
              <div className="text-sm text-muted-foreground">App Switches</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
