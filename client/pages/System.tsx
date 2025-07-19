import {
  Monitor,
  Shield,
  Power,
  Clock,
  Activity,
  Server,
  Cpu,
  HardDrive,
  MemoryStick,
  Thermometer,
} from "lucide-react";

interface SystemMetricProps {
  title: string;
  value: string;
  unit: string;
  status: "healthy" | "warning" | "critical";
  icon: React.ReactNode;
}

function SystemMetric({ title, value, unit, status, icon }: SystemMetricProps) {
  const statusColor = {
    healthy: "text-success",
    warning: "text-warning",
    critical: "text-destructive",
  }[status];

  const statusBg = {
    healthy: "bg-success/10",
    warning: "bg-warning/10",
    critical: "bg-destructive/10",
  }[status];

  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${statusBg}`}>
          <div className={statusColor}>{icon}</div>
        </div>
        <div className={`text-sm font-medium ${statusColor}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </div>
      </div>
      <h3 className="text-2xl font-bold text-foreground mb-1">
        {value}
        <span className="text-sm text-muted-foreground ml-1">{unit}</span>
      </h3>
      <p className="text-sm text-muted-foreground">{title}</p>
    </div>
  );
}

export default function System() {
  const systemMetrics = [
    {
      title: "System Unlocks Today",
      value: "47",
      unit: "unlocks",
      status: "healthy" as const,
      icon: <Shield className="h-6 w-6" />,
    },
    {
      title: "Active Usage Time",
      value: "6h 42m",
      unit: "",
      status: "healthy" as const,
      icon: <Clock className="h-6 w-6" />,
    },
    {
      title: "Boot Sessions",
      value: "3",
      unit: "boots",
      status: "healthy" as const,
      icon: <Power className="h-6 w-6" />,
    },
    {
      title: "System Uptime",
      value: "15h 23m",
      unit: "",
      status: "healthy" as const,
      icon: <Activity className="h-6 w-6" />,
    },
    {
      title: "CPU Usage",
      value: "34",
      unit: "%",
      status: "healthy" as const,
      icon: <Cpu className="h-6 w-6" />,
    },
    {
      title: "Memory Usage",
      value: "68",
      unit: "%",
      status: "warning" as const,
      icon: <MemoryStick className="h-6 w-6" />,
    },
    {
      title: "Disk Usage",
      value: "45",
      unit: "%",
      status: "healthy" as const,
      icon: <HardDrive className="h-6 w-6" />,
    },
    {
      title: "Temperature",
      value: "42",
      unit: "°C",
      status: "healthy" as const,
      icon: <Thermometer className="h-6 w-6" />,
    },
  ];

  const bootLogs = [
    {
      time: "08:15:32",
      event: "System Boot",
      status: "Successful",
      duration: "45.2s",
    },
    {
      time: "16:42:18",
      event: "System Restart",
      status: "Successful",
      duration: "52.1s",
    },
    {
      time: "22:05:45",
      event: "System Shutdown",
      status: "Normal",
      duration: "12.3s",
    },
  ];

  const unlockHistory = [
    { time: "09:15", method: "Face ID", location: "Home Screen" },
    { time: "09:42", method: "Passcode", location: "Lock Screen" },
    { time: "10:18", method: "Face ID", location: "Notification" },
    { time: "11:35", method: "Face ID", location: "Home Screen" },
    { time: "13:22", method: "Passcode", location: "Control Center" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">System Usage</h1>
        <p className="text-muted-foreground mt-2">
          Monitor system performance, unlock patterns, and boot sessions
        </p>
      </div>

      {/* System Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {systemMetrics.map((metric, index) => (
          <SystemMetric key={index} {...metric} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Boot & Shutdown Logs */}
        <div className="bg-card rounded-xl p-6 border border-border">
          <h2 className="text-xl font-semibold text-foreground mb-6">
            Boot & Shutdown History
          </h2>
          <div className="space-y-4">
            {bootLogs.map((log, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 border-b border-border last:border-b-0"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-accent p-2 rounded-lg">
                    <Power className="h-4 w-4 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{log.event}</p>
                    <p className="text-sm text-muted-foreground">{log.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-success">
                    {log.status}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {log.duration}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Unlock History */}
        <div className="bg-card rounded-xl p-6 border border-border">
          <h2 className="text-xl font-semibold text-foreground mb-6">
            Recent Unlock Activity
          </h2>
          <div className="space-y-4">
            {unlockHistory.map((unlock, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 border-b border-border last:border-b-0"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-accent p-2 rounded-lg">
                    <Shield className="h-4 w-4 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {unlock.method}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {unlock.time}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">
                    {unlock.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Session Duration Overview */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <h2 className="text-xl font-semibold text-foreground mb-6">
          Session Duration Analysis
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-success/10 p-4 rounded-lg mb-3">
              <Clock className="h-8 w-8 text-success mx-auto" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">2h 45m</h3>
            <p className="text-sm text-muted-foreground">Longest Session</p>
            <p className="text-xs text-muted-foreground mt-1">
              Today 9:00 AM - 11:45 AM
            </p>
          </div>
          <div className="text-center">
            <div className="bg-warning/10 p-4 rounded-lg mb-3">
              <Clock className="h-8 w-8 text-warning mx-auto" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">12m</h3>
            <p className="text-sm text-muted-foreground">Shortest Session</p>
            <p className="text-xs text-muted-foreground mt-1">
              Today 2:30 PM - 2:42 PM
            </p>
          </div>
          <div className="text-center">
            <div className="bg-info/10 p-4 rounded-lg mb-3">
              <Activity className="h-8 w-8 text-info mx-auto" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">1h 22m</h3>
            <p className="text-sm text-muted-foreground">Average Session</p>
            <p className="text-xs text-muted-foreground mt-1">
              Based on 8 sessions today
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
