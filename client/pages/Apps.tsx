import { useState } from "react";
import {
  Smartphone,
  Clock,
  Timer,
  Target,
  Focus,
  TrendingUp,
  TrendingDown,
  Play,
  Pause,
  RotateCcw,
} from "lucide-react";

interface AppCardProps {
  name: string;
  time: string;
  percentage: number;
  sessions: number;
  trend: "up" | "down" | "neutral";
  category: string;
  hasLimit?: boolean;
  limitTime?: string;
}

function AppCard({
  name,
  time,
  percentage,
  sessions,
  trend,
  category,
  hasLimit,
  limitTime,
}: AppCardProps) {
  const trendIcon = {
    up: <TrendingUp className="h-4 w-4 text-success" />,
    down: <TrendingDown className="h-4 w-4 text-destructive" />,
    neutral: <div className="h-4 w-4" />,
  }[trend];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="bg-card rounded-xl p-6 border border-border hover:border-border/80 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
            <span className="text-sm font-medium text-accent-foreground">
              {getInitials(name)}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{name}</h3>
            <p className="text-sm text-muted-foreground">{category}</p>
          </div>
        </div>
        {trendIcon}
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Usage Time</span>
          <span className="font-medium text-foreground">{time}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Sessions</span>
          <span className="font-medium text-foreground">{sessions}</span>
        </div>

        {hasLimit && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Daily Limit</span>
            <span className="font-medium text-warning">{limitTime}</span>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Usage</span>
            <span className="text-sm font-medium">{percentage}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                percentage > 80
                  ? "bg-destructive"
                  : percentage > 60
                    ? "bg-warning"
                    : "bg-success"
              }`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Apps() {
  const [activeTab, setActiveTab] = useState<"overview" | "limits" | "focus">(
    "overview",
  );

  const topApps = [
    {
      name: "Microsoft Edge",
      time: "2h 15m",
      percentage: 85,
      sessions: 12,
      trend: "up" as const,
      category: "Web Browser",
      hasLimit: true,
      limitTime: "3h",
    },
    {
      name: "Visual Studio Code",
      time: "1h 30m",
      percentage: 60,
      sessions: 8,
      trend: "neutral" as const,
      category: "Development",
      hasLimit: false,
    },
    {
      name: "Microsoft Teams",
      time: "45m",
      percentage: 30,
      sessions: 5,
      trend: "down" as const,
      category: "Communication",
      hasLimit: true,
      limitTime: "2h",
    },
    {
      name: "Outlook",
      time: "1h 5m",
      percentage: 45,
      sessions: 15,
      trend: "up" as const,
      category: "Productivity",
      hasLimit: false,
    },
    {
      name: "Spotify",
      time: "3h 20m",
      percentage: 95,
      sessions: 6,
      trend: "up" as const,
      category: "Entertainment",
      hasLimit: true,
      limitTime: "4h",
    },
    {
      name: "Excel",
      time: "25m",
      percentage: 20,
      sessions: 3,
      trend: "neutral" as const,
      category: "Productivity",
      hasLimit: false,
    },
  ];

  const categories = [
    { name: "Productivity", time: "3h 45m", apps: 4, color: "bg-success" },
    { name: "Entertainment", time: "3h 20m", apps: 2, color: "bg-warning" },
    { name: "Communication", time: "1h 15m", apps: 3, color: "bg-info" },
    { name: "Development", time: "1h 30m", apps: 2, color: "bg-primary" },
    { name: "Web Browser", time: "2h 15m", apps: 1, color: "bg-destructive" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">App Tracking</h1>
        <p className="text-muted-foreground mt-2">
          Monitor application usage, set time limits, and manage focus modes
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "overview"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("limits")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "limits"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Time Limits
        </button>
        <button
          onClick={() => setActiveTab("focus")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "focus"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Focus Mode
        </button>
      </div>

      {activeTab === "overview" && (
        <div className="space-y-8">
          {/* Category Overview */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <h2 className="text-xl font-semibold text-foreground mb-6">
              Usage by Category
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {categories.map((category, index) => (
                <div key={index} className="text-center">
                  <div
                    className={`${category.color}/10 p-4 rounded-lg mb-3 border border-border/50`}
                  >
                    <Smartphone
                      className={`h-6 w-6 mx-auto ${category.color.replace("bg-", "text-")}`}
                    />
                  </div>
                  <h3 className="font-medium text-foreground">
                    {category.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {category.time}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {category.apps} apps
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* App Usage Grid */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-6">
              Application Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topApps.map((app, index) => (
                <AppCard key={index} {...app} />
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "limits" && (
        <div className="space-y-8">
          <div className="bg-card rounded-xl p-6 border border-border">
            <h2 className="text-xl font-semibold text-foreground mb-6">
              App Time Limits
            </h2>
            <div className="space-y-4">
              {topApps
                .filter((app) => app.hasLimit)
                .map((app, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-4 border-b border-border last:border-b-0"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                        <span className="text-sm font-medium text-accent-foreground">
                          {app.name
                            .split(" ")
                            .map((word) => word[0])
                            .join("")}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">
                          {app.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {app.time} used today
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-foreground">
                          {app.limitTime} limit
                        </p>
                        <p
                          className={`text-sm ${
                            app.percentage > 80
                              ? "text-destructive"
                              : app.percentage > 60
                                ? "text-warning"
                                : "text-success"
                          }`}
                        >
                          {app.percentage}% used
                        </p>
                      </div>
                      <button className="px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80">
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "focus" && (
        <div className="space-y-8">
          <div className="bg-card rounded-xl p-6 border border-border">
            <h2 className="text-xl font-semibold text-foreground mb-6">
              Focus Mode Settings
            </h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-accent/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Focus className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="font-medium text-foreground">
                      Focus Mode Status
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Currently inactive
                    </p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                  Enable Focus
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-foreground mb-3">
                    Blocked Apps During Focus
                  </h4>
                  <div className="space-y-2">
                    {["Spotify", "Instagram", "Twitter", "YouTube"].map(
                      (app, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-muted rounded-md"
                        >
                          <span className="text-sm text-foreground">{app}</span>
                          <button className="text-xs text-destructive hover:text-destructive/80">
                            Remove
                          </button>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-foreground mb-3">
                    Focus Schedule
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-muted rounded-md">
                      <span className="text-sm text-foreground">
                        Weekdays 9:00 AM - 5:00 PM
                      </span>
                      <span className="text-xs text-success">Active</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-muted rounded-md">
                      <span className="text-sm text-foreground">
                        Deep Work 2:00 PM - 4:00 PM
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Inactive
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
