import { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Calendar,
  Download,
  FileText,
  Mail,
  PieChart,
  LineChart,
  Target,
  Clock,
} from "lucide-react";
import {
  UsageTrendsChart,
  AppDistributionChart,
  WeeklyTrendsChart,
  DataUsageComparisonChart,
} from "../components/Charts";

interface AnalyticsCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: React.ReactNode;
}

function AnalyticsCard({
  title,
  value,
  change,
  trend,
  icon,
}: AnalyticsCardProps) {
  const trendColor = {
    up: "text-success",
    down: "text-destructive",
    neutral: "text-muted-foreground",
  }[trend];

  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-accent rounded-lg">{icon}</div>
        <div className={`text-sm font-medium ${trendColor}`}>{change}</div>
      </div>
      <h3 className="text-2xl font-bold text-foreground mb-1">{value}</h3>
      <p className="text-sm text-muted-foreground">{title}</p>
    </div>
  );
}

interface InsightCardProps {
  title: string;
  description: string;
  recommendation: string;
  type: "warning" | "info" | "success";
  icon: React.ReactNode;
}

function InsightCard({
  title,
  description,
  recommendation,
  type,
  icon,
}: InsightCardProps) {
  const typeStyles = {
    warning: "border-warning/20 bg-warning/5",
    info: "border-info/20 bg-info/5",
    success: "border-success/20 bg-success/5",
  };

  const iconStyles = {
    warning: "text-warning",
    info: "text-info",
    success: "text-success",
  };

  return (
    <div className={`rounded-xl p-6 border ${typeStyles[type]}`}>
      <div className="flex items-start space-x-4">
        <div className={`p-2 rounded-lg ${iconStyles[type]}`}>{icon}</div>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground mb-3">{description}</p>
          <div className="bg-card/50 rounded-lg p-3">
            <p className="text-sm font-medium text-foreground">
              💡 Recommendation: {recommendation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Analytics() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");
  const [reportType, setReportType] = useState<"summary" | "detailed">(
    "summary",
  );

  const analyticsMetrics = [
    {
      title: "Average Session Duration",
      value: "1h 22m",
      change: "+12%",
      trend: "up" as const,
      icon: <Clock className="h-6 w-6 text-muted-foreground" />,
    },
    {
      title: "Most Productive Hours",
      value: "10-12 AM",
      change: "Peak time",
      trend: "neutral" as const,
      icon: <Target className="h-6 w-6 text-muted-foreground" />,
    },
    {
      title: "Daily Screen Time",
      value: "6h 42m",
      change: "-8%",
      trend: "down" as const,
      icon: <BarChart3 className="h-6 w-6 text-muted-foreground" />,
    },
    {
      title: "Focus Efficiency",
      value: "78%",
      change: "+15%",
      trend: "up" as const,
      icon: <TrendingUp className="h-6 w-6 text-muted-foreground" />,
    },
  ];

  const insights = [
    {
      title: "Increased Social Media Usage",
      description:
        "Your social media usage has increased by 35% compared to last month, primarily during work hours.",
      recommendation:
        "Consider using Focus Mode during 9 AM - 5 PM to limit distracting apps.",
      type: "warning" as const,
      icon: <TrendingUp className="h-5 w-5" />,
    },
    {
      title: "Optimal Productivity Pattern",
      description:
        "Your most productive sessions occur between 10 AM - 12 PM with 85% focus efficiency.",
      recommendation:
        "Schedule important tasks during your peak productivity hours.",
      type: "success" as const,
      icon: <Target className="h-5 w-5" />,
    },
    {
      title: "Data Usage Spike",
      description:
        "Your data consumption increased by 25% this week, mainly from video streaming apps.",
      recommendation:
        "Consider adjusting video quality settings or using Wi-Fi when available.",
      type: "info" as const,
      icon: <BarChart3 className="h-5 w-5" />,
    },
  ];

  const weeklyComparison = [
    { metric: "Screen Time", thisWeek: "46h 12m", lastWeek: "42h 30m" },
    { metric: "App Sessions", thisWeek: "156", lastWeek: "142" },
    { metric: "Unlocks", thisWeek: "324", lastWeek: "298" },
    { metric: "Data Usage", thisWeek: "18.5 GB", lastWeek: "16.2 GB" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Analytics & Reports
          </h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive insights into your digital behavior and productivity
            patterns
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <button className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
            <Download className="h-4 w-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analyticsMetrics.map((metric, index) => (
          <AnalyticsCard key={index} {...metric} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <UsageTrendsChart colorScheme="professional" />
        <AppDistributionChart colorScheme="cyberpunk" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <WeeklyTrendsChart colorScheme="fire" />
        <DataUsageComparisonChart colorScheme="purple" />
      </div>

      {/* Insights and Recommendations */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">
          AI-Powered Insights
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {insights.map((insight, index) => (
            <InsightCard key={index} {...insight} />
          ))}
        </div>
      </div>

      {/* Weekly Comparison */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <h2 className="text-xl font-semibold text-foreground mb-6">
          Weekly Comparison
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {weeklyComparison.map((item, index) => (
            <div key={index} className="text-center">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                {item.metric}
              </h3>
              <div className="space-y-1">
                <p className="text-lg font-bold text-foreground">
                  {item.thisWeek}
                </p>
                <p className="text-sm text-muted-foreground">This week</p>
                <p className="text-sm text-muted-foreground">
                  vs {item.lastWeek} last week
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Report Generation */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <h2 className="text-xl font-semibold text-foreground mb-6">
          Generate Custom Report
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Report Type
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="reportType"
                  value="summary"
                  checked={reportType === "summary"}
                  onChange={(e) => setReportType(e.target.value as any)}
                  className="text-primary"
                />
                <span className="text-sm text-foreground">Summary</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="reportType"
                  value="detailed"
                  checked={reportType === "detailed"}
                  onChange={(e) => setReportType(e.target.value as any)}
                  className="text-primary"
                />
                <span className="text-sm text-foreground">Detailed</span>
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Export Format
            </label>
            <div className="flex space-x-4">
              <button className="flex items-center space-x-2 px-3 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80">
                <FileText className="h-4 w-4" />
                <span>PDF</span>
              </button>
              <button className="flex items-center space-x-2 px-3 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80">
                <BarChart3 className="h-4 w-4" />
                <span>CSV</span>
              </button>
              <button className="flex items-center space-x-2 px-3 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80">
                <Mail className="h-4 w-4" />
                <span>Email</span>
              </button>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <button className="w-full md:w-auto px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );
}
