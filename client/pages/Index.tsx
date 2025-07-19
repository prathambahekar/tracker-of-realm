import { useState } from "react";
import {
  Monitor,
  Smartphone,
  Clock,
  TrendingUp,
  Activity,
  Shield,
  Wifi,
  BarChart3,
  Calendar,
  Power,
  Timer,
  Target,
  Focus,
  Bell,
  Download,
  ChevronUp,
  ChevronDown,
  Play,
  Pause,
  RotateCcw,
  Zap,
  Server,
  Users,
  Database,
} from "lucide-react";
import {
  UsageTrendsChart,
  AppDistributionChart,
  SystemPerformanceChart,
  WeeklyTrendsChart,
  RealTimeActivityChart,
  DataUsageComparisonChart,
} from "../components/Charts";

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "increase" | "decrease" | "neutral";
  icon: React.ReactNode;
  trend?: number[];
}

function MetricCard({
  title,
  value,
  change,
  changeType,
  icon,
  trend,
}: MetricCardProps) {
  const changeColor =
    changeType === "increase"
      ? "text-success"
      : changeType === "decrease"
        ? "text-destructive"
        : "text-muted-foreground";
  const changeIcon =
    changeType === "increase" ? (
      <ChevronUp className="h-4 w-4" />
    ) : changeType === "decrease" ? (
      <ChevronDown className="h-4 w-4" />
    ) : null;

  return (
    <div className="bg-card rounded-xl p-6 border border-border hover:border-border/80 transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <div
            className={`flex items-center text-sm font-medium ${changeColor}`}
          >
            {changeIcon}
            <span>{change}</span>
            <span className="text-muted-foreground ml-1">vs last week</span>
          </div>
        </div>
        <div className="p-3 bg-accent rounded-lg">{icon}</div>
      </div>
      {trend && (
        <div className="mt-4 h-8 flex items-end space-x-1">
          {trend.map((height, index) => (
            <div
              key={index}
              className="bg-primary/20 rounded-sm flex-1"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface StatusIndicatorProps {
  label: string;
  status: "healthy" | "warning" | "critical";
  value: string;
}

function StatusIndicator({ label, status, value }: StatusIndicatorProps) {
  const statusColor = {
    healthy: "bg-success",
    warning: "bg-warning",
    critical: "bg-destructive",
  }[status];

  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
      <div className="flex items-center space-x-3">
        <div className={`w-2 h-2 rounded-full ${statusColor}`} />
        <span className="text-sm font-medium text-foreground">{label}</span>
      </div>
      <span className="text-sm text-muted-foreground">{value}</span>
    </div>
  );
}

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  buttonText: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "destructive";
}

function QuickActionCard({
  title,
  description,
  icon,
  buttonText,
  onClick,
  variant = "primary",
}: QuickActionCardProps) {
  const variantStyles = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive:
      "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  };

  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <div className="flex items-start space-x-4">
        <div className="p-3 bg-accent rounded-lg">{icon}</div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-foreground mb-1">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">{description}</p>
          <button
            onClick={onClick}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${variantStyles[variant]}`}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Index() {
  const [focusModeActive, setFocusModeActive] = useState(false);
  const [trendsPeriod, setTrendsPeriod] = useState<
    "daily" | "weekly" | "monthly"
  >("daily");

  const systemMetrics = [
    {
      title: "System Unlocks",
      value: "47",
      change: "+12%",
      changeType: "increase" as const,
      icon: <Shield className="h-6 w-6 text-muted-foreground" />,
      trend: [20, 45, 30, 60, 40, 80, 90],
    },
    {
      title: "Active Usage",
      value: "6h 42m",
      change: "-8%",
      changeType: "decrease" as const,
      icon: <Clock className="h-6 w-6 text-muted-foreground" />,
      trend: [80, 65, 45, 55, 70, 60, 50],
    },
    {
      title: "App Sessions",
      value: "23",
      change: "+5%",
      changeType: "increase" as const,
      icon: <Smartphone className="h-6 w-6 text-muted-foreground" />,
      trend: [30, 50, 40, 70, 60, 80, 75],
    },
    {
      title: "Data Consumed",
      value: "2.4 GB",
      change: "+15%",
      changeType: "increase" as const,
      icon: <Wifi className="h-6 w-6 text-muted-foreground" />,
      trend: [40, 35, 60, 45, 70, 85, 90],
    },
  ];

  const systemStatus = [
    { label: "CPU Usage", status: "healthy" as const, value: "34%" },
    { label: "Memory", status: "healthy" as const, value: "62%" },
    { label: "Disk I/O", status: "warning" as const, value: "78%" },
    { label: "Network", status: "healthy" as const, value: "23%" },
    { label: "Temperature", status: "healthy" as const, value: "42°C" },
  ];

  const topApplications = [
    { name: "Microsoft Edge", usage: "2h 15m", percentage: 85, sessions: 12 },
    {
      name: "Visual Studio Code",
      usage: "1h 30m",
      percentage: 60,
      sessions: 8,
    },
    { name: "Microsoft Teams", usage: "45m", percentage: 30, sessions: 5 },
    { name: "Outlook", usage: "1h 5m", percentage: 45, sessions: 15 },
    { name: "Excel", usage: "25m", percentage: 20, sessions: 3 },
  ];

  const quickActions = [
    {
      title: "Focus Mode",
      description: focusModeActive
        ? "Focus mode is currently active. Click to disable and restore normal app access."
        : "Enable focus mode to block distracting applications and improve productivity.",
      icon: <Focus className="h-6 w-6 text-muted-foreground" />,
      buttonText: focusModeActive ? "Disable Focus" : "Enable Focus",
      onClick: () => setFocusModeActive(!focusModeActive),
      variant: focusModeActive
        ? ("destructive" as const)
        : ("primary" as const),
    },
    {
      title: "App Time Limits",
      description:
        "Configure daily time limits for specific applications to maintain healthy usage patterns.",
      icon: <Timer className="h-6 w-6 text-muted-foreground" />,
      buttonText: "Set Limits",
      onClick: () => console.log("Set app limits"),
      variant: "secondary" as const,
    },
    {
      title: "Export Analytics",
      description:
        "Generate comprehensive reports in PDF or CSV format for detailed analysis.",
      icon: <Download className="h-6 w-6 text-muted-foreground" />,
      buttonText: "Generate Report",
      onClick: () => console.log("Export report"),
      variant: "secondary" as const,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Focus Mode Alert */}
      {focusModeActive && (
        <div className="bg-card border border-warning/20 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-warning/10 p-2 rounded-lg">
                <Focus className="h-5 w-5 text-warning" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">
                  Focus Mode Active
                </h3>
                <p className="text-sm text-muted-foreground">
                  Distracting applications are currently blocked until 6:00 PM
                </p>
              </div>
            </div>
            <button
              onClick={() => setFocusModeActive(false)}
              className="px-4 py-2 bg-warning text-warning-foreground rounded-lg hover:bg-warning/90 transition-colors text-sm font-medium"
            >
              Disable
            </button>
          </div>
        </div>
      )}

      {/* Key Metrics */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">
          System Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {systemMetrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Charts and Analytics */}
        <div className="lg:col-span-2 space-y-8">
          {/* Usage Trends Chart */}
          <UsageTrendsChart
            colorScheme="professional"
            period={trendsPeriod}
            onPeriodChange={setTrendsPeriod}
          />

          {/* Real-time Activity Chart */}
          <RealTimeActivityChart colorScheme="neon" />

          {/* Weekly Trends Chart */}
          <WeeklyTrendsChart colorScheme="fire" />

          {/* Top Applications */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">
                Application Usage
              </h3>
              <button className="text-primary hover:text-primary/80 text-sm font-medium">
                View All Applications
              </button>
            </div>
            <div className="space-y-4">
              {topApplications.map((app, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-3 border-b border-border last:border-b-0"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                      <span className="text-sm font-medium text-accent-foreground">
                        {app.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{app.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {app.sessions} sessions today
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">
                        {app.usage}
                      </p>
                      <div className="w-20 bg-accent rounded-full h-1.5 mt-1">
                        <div
                          className="bg-primary h-1.5 rounded-full"
                          style={{ width: `${app.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Status and Quick Actions */}
        <div className="space-y-8">
          {/* App Distribution Chart */}
          <AppDistributionChart colorScheme="cyberpunk" />

          {/* System Status */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-6">
              System Health
            </h3>
            <div className="space-y-2">
              {systemStatus.map((status, index) => (
                <StatusIndicator key={index} {...status} />
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-border">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Uptime</span>
                <span className="font-medium text-foreground">6h 42m</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-muted-foreground">Last Boot</span>
                <span className="font-medium text-foreground">8:15 AM</span>
              </div>
            </div>
          </div>

          {/* Data Usage */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-6">
              Data Usage
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Today</span>
                  <span className="font-medium text-foreground">2.4 GB</span>
                </div>
                <div className="w-full bg-accent rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: "60%" }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">This Week</span>
                  <span className="font-medium text-foreground">15.2 GB</span>
                </div>
                <div className="w-full bg-accent rounded-full h-2">
                  <div
                    className="bg-warning h-2 rounded-full"
                    style={{ width: "76%" }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Monthly</span>
                  <span className="font-medium text-foreground">
                    45.8 / 100 GB
                  </span>
                </div>
                <div className="w-full bg-accent rounded-full h-2">
                  <div
                    className="bg-success h-2 rounded-full"
                    style={{ width: "46%" }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-6">
              Recent Activity
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-success/10 p-2 rounded-lg">
                  <Power className="h-4 w-4 text-success" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    System Started
                  </p>
                  <p className="text-xs text-muted-foreground">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-info/10 p-2 rounded-lg">
                  <Smartphone className="h-4 w-4 text-info" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    Edge opened
                  </p>
                  <p className="text-xs text-muted-foreground">5 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-warning/10 p-2 rounded-lg">
                  <Timer className="h-4 w-4 text-warning" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    Focus session ended
                  </p>
                  <p className="text-xs text-muted-foreground">1 hour ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Usage Comparison Chart */}
      <DataUsageComparisonChart colorScheme="purple" />

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <QuickActionCard key={index} {...action} />
          ))}
        </div>
      </div>
    </div>
  );
}
