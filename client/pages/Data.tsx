import {
  Wifi,
  Download,
  Upload,
  Smartphone,
  Globe,
  Activity,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

interface DataCardProps {
  title: string;
  value: string;
  unit: string;
  change: string;
  changeType: "increase" | "decrease" | "neutral";
  icon: React.ReactNode;
  color: string;
}

function DataCard({
  title,
  value,
  unit,
  change,
  changeType,
  icon,
  color,
}: DataCardProps) {
  const changeColor =
    changeType === "increase"
      ? "text-warning"
      : changeType === "decrease"
        ? "text-success"
        : "text-muted-foreground";

  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
        <div className={`text-sm font-medium ${changeColor}`}>{change}</div>
      </div>
      <h3 className="text-2xl font-bold text-foreground mb-1">
        {value}
        <span className="text-sm text-muted-foreground ml-1">{unit}</span>
      </h3>
      <p className="text-sm text-muted-foreground">{title}</p>
    </div>
  );
}

interface AppDataUsageProps {
  name: string;
  download: string;
  upload: string;
  total: string;
  percentage: number;
}

function AppDataUsage({
  name,
  download,
  upload,
  total,
  percentage,
}: AppDataUsageProps) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-border last:border-b-0">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
          <span className="text-sm font-medium text-accent-foreground">
            {name.charAt(0)}
          </span>
        </div>
        <div>
          <h3 className="font-medium text-foreground">{name}</h3>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Download className="h-3 w-3" />
              <span>{download}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Upload className="h-3 w-3" />
              <span>{upload}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="text-right">
        <p className="font-medium text-foreground">{total}</p>
        <div className="flex items-center space-x-2 mt-1">
          <div className="w-16 bg-muted rounded-full h-1.5">
            <div
              className="bg-primary h-1.5 rounded-full"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground">{percentage}%</span>
        </div>
      </div>
    </div>
  );
}

export default function Data() {
  const dataMetrics = [
    {
      title: "Total Data Today",
      value: "2.4",
      unit: "GB",
      change: "+15%",
      changeType: "increase" as const,
      icon: <Activity className="h-6 w-6 text-white" />,
      color: "bg-primary",
    },
    {
      title: "Download Speed",
      value: "45.2",
      unit: "Mbps",
      change: "+5%",
      changeType: "increase" as const,
      icon: <Download className="h-6 w-6 text-white" />,
      color: "bg-success",
    },
    {
      title: "Upload Speed",
      value: "12.8",
      unit: "Mbps",
      change: "-2%",
      changeType: "decrease" as const,
      icon: <Upload className="h-6 w-6 text-white" />,
      color: "bg-info",
    },
    {
      title: "Connected Devices",
      value: "8",
      unit: "devices",
      change: "0%",
      changeType: "neutral" as const,
      icon: <Wifi className="h-6 w-6 text-white" />,
      color: "bg-warning",
    },
  ];

  const appDataUsage = [
    {
      name: "Chrome",
      download: "1.2 GB",
      upload: "145 MB",
      total: "1.35 GB",
      percentage: 85,
    },
    {
      name: "Teams",
      download: "450 MB",
      upload: "320 MB",
      total: "770 MB",
      percentage: 60,
    },
    {
      name: "Spotify",
      download: "280 MB",
      upload: "15 MB",
      total: "295 MB",
      percentage: 30,
    },
    {
      name: "Outlook",
      download: "120 MB",
      upload: "85 MB",
      total: "205 MB",
      percentage: 25,
    },
    {
      name: "OneDrive",
      download: "95 MB",
      upload: "180 MB",
      total: "275 MB",
      percentage: 28,
    },
  ];

  const dataLimits = [
    {
      period: "Daily",
      used: "2.4 GB",
      limit: "5 GB",
      percentage: 48,
      status: "healthy",
    },
    {
      period: "Weekly",
      used: "15.2 GB",
      limit: "25 GB",
      percentage: 61,
      status: "warning",
    },
    {
      period: "Monthly",
      used: "45.8 GB",
      limit: "100 GB",
      percentage: 46,
      status: "healthy",
    },
  ];

  const networkActivity = [
    { time: "00:00", download: 20, upload: 5 },
    { time: "04:00", download: 15, upload: 3 },
    { time: "08:00", download: 85, upload: 25 },
    { time: "12:00", download: 120, upload: 45 },
    { time: "16:00", download: 95, upload: 35 },
    { time: "20:00", download: 60, upload: 20 },
    { time: "24:00", download: 30, upload: 8 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Data Usage</h1>
        <p className="text-muted-foreground mt-2">
          Monitor internet usage, track app data consumption, and manage limits
        </p>
      </div>

      {/* Data Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dataMetrics.map((metric, index) => (
          <DataCard key={index} {...metric} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - App Usage */}
        <div className="lg:col-span-2 space-y-8">
          {/* Per-App Data Usage */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <h2 className="text-xl font-semibold text-foreground mb-6">
              App Data Usage
            </h2>
            <div className="space-y-2">
              {appDataUsage.map((app, index) => (
                <AppDataUsage key={index} {...app} />
              ))}
            </div>
          </div>

          {/* Network Activity Chart Placeholder */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <h2 className="text-xl font-semibold text-foreground mb-6">
              Network Activity
            </h2>
            <div className="h-64 bg-accent/30 rounded-lg flex items-center justify-center border border-border/50">
              <div className="text-center">
                <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium text-foreground">
                  Network Activity Chart
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Real-time download and upload speeds
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Limits and Status */}
        <div className="space-y-8">
          {/* Data Limits */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <h2 className="text-xl font-semibold text-foreground mb-6">
              Data Limits
            </h2>
            <div className="space-y-6">
              {dataLimits.map((limit, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-foreground">
                      {limit.period}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {limit.used} / {limit.limit}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        limit.status === "warning" ? "bg-warning" : "bg-success"
                      }`}
                      style={{ width: `${limit.percentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span
                      className={`text-xs ${
                        limit.status === "warning"
                          ? "text-warning"
                          : "text-success"
                      }`}
                    >
                      {limit.percentage}% used
                    </span>
                    {limit.status === "warning" && (
                      <AlertCircle className="h-3 w-3 text-warning" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Connection Info */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <h2 className="text-xl font-semibold text-foreground mb-6">
              Connection Details
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Network</span>
                <span className="text-sm font-medium text-foreground">
                  Wi-Fi (Office_Network)
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Signal Strength
                </span>
                <span className="text-sm font-medium text-success">
                  Excellent
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  IP Address
                </span>
                <span className="text-sm font-medium text-foreground">
                  192.168.1.105
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">DNS</span>
                <span className="text-sm font-medium text-foreground">
                  8.8.8.8
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Connection Type
                </span>
                <span className="text-sm font-medium text-foreground">
                  802.11ac
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <h2 className="text-xl font-semibold text-foreground mb-6">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <button className="w-full p-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                Export Data Report
              </button>
              <button className="w-full p-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors">
                Set Data Limits
              </button>
              <button className="w-full p-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/80 transition-colors">
                Reset Usage Stats
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
