import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  ComposedChart,
} from "recharts";

// Color palettes optimized for dark backgrounds
export const colorSchemes = {
  neon: {
    primary: "#00ff88",
    secondary: "#ff0080",
    tertiary: "#0080ff",
    quaternary: "#ff8000",
    gradient: ["#00ff88", "#0080ff", "#ff0080", "#ff8000"],
  },
  cyberpunk: {
    primary: "#ff073a",
    secondary: "#39ff14",
    tertiary: "#ff9800",
    quaternary: "#e91e63",
    gradient: ["#ff073a", "#39ff14", "#ff9800", "#e91e63"],
  },
  ice: {
    primary: "#64ffda",
    secondary: "#18ffff",
    tertiary: "#69f0ae",
    quaternary: "#76ff03",
    gradient: ["#64ffda", "#18ffff", "#69f0ae", "#76ff03"],
  },
  fire: {
    primary: "#ff5722",
    secondary: "#ff9800",
    tertiary: "#ffc107",
    quaternary: "#ffeb3b",
    gradient: ["#ff5722", "#ff9800", "#ffc107", "#ffeb3b"],
  },
  professional: {
    primary: "#4facfe",
    secondary: "#00f2fe",
    tertiary: "#43e97b",
    quaternary: "#38f9d7",
    gradient: ["#4facfe", "#00f2fe", "#43e97b", "#38f9d7"],
  },
  purple: {
    primary: "#667eea",
    secondary: "#764ba2",
    tertiary: "#f093fb",
    quaternary: "#f5576c",
    gradient: ["#667eea", "#764ba2", "#f093fb", "#f5576c"],
  },
};

// Sample data for various charts
const usageDataDaily = [
  { time: "00:00", systemUsage: 45, appUsage: 32, dataUsage: 20 },
  { time: "04:00", systemUsage: 52, appUsage: 38, dataUsage: 25 },
  { time: "08:00", systemUsage: 78, appUsage: 65, dataUsage: 45 },
  { time: "12:00", systemUsage: 85, appUsage: 72, dataUsage: 60 },
  { time: "16:00", systemUsage: 92, appUsage: 88, dataUsage: 75 },
  { time: "20:00", systemUsage: 76, appUsage: 69, dataUsage: 55 },
  { time: "24:00", systemUsage: 58, appUsage: 45, dataUsage: 35 },
];

const usageDataWeekly = [
  { time: "Mon", systemUsage: 65, appUsage: 52, dataUsage: 40 },
  { time: "Tue", systemUsage: 72, appUsage: 58, dataUsage: 45 },
  { time: "Wed", systemUsage: 68, appUsage: 55, dataUsage: 42 },
  { time: "Thu", systemUsage: 78, appUsage: 65, dataUsage: 50 },
  { time: "Fri", systemUsage: 85, appUsage: 72, dataUsage: 55 },
  { time: "Sat", systemUsage: 45, appUsage: 35, dataUsage: 25 },
  { time: "Sun", systemUsage: 42, appUsage: 32, dataUsage: 22 },
];

const usageDataMonthly = [
  { time: "Week 1", systemUsage: 68, appUsage: 55, dataUsage: 42 },
  { time: "Week 2", systemUsage: 75, appUsage: 62, dataUsage: 48 },
  { time: "Week 3", systemUsage: 72, appUsage: 58, dataUsage: 45 },
  { time: "Week 4", systemUsage: 78, appUsage: 65, dataUsage: 50 },
];

const appDistributionData = [
  { name: "Chrome", value: 35, sessions: 245 },
  { name: "VS Code", value: 25, sessions: 180 },
  { name: "Teams", value: 15, sessions: 120 },
  { name: "Outlook", value: 12, sessions: 95 },
  { name: "Excel", value: 8, sessions: 65 },
  { name: "Others", value: 5, sessions: 45 },
];

const performanceData = [
  { metric: "CPU", value: 65, max: 100 },
  { metric: "Memory", value: 78, max: 100 },
  { metric: "Disk", value: 45, max: 100 },
  { metric: "Network", value: 32, max: 100 },
];

const weeklyTrendData = [
  { day: "Mon", unlocks: 45, screenTime: 420, dataUsage: 2.3 },
  { day: "Tue", unlocks: 52, screenTime: 385, dataUsage: 2.8 },
  { day: "Wed", unlocks: 48, screenTime: 445, dataUsage: 3.1 },
  { day: "Thu", unlocks: 61, screenTime: 502, dataUsage: 2.9 },
  { day: "Fri", unlocks: 58, screenTime: 478, dataUsage: 3.4 },
  { day: "Sat", unlocks: 42, screenTime: 324, dataUsage: 1.8 },
  { day: "Sun", unlocks: 38, screenTime: 289, dataUsage: 1.5 },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  labelKey?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
        <p className="text-foreground font-medium">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value}${entry.unit || ""}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

interface ChartContainerProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const ChartContainer = ({
  title,
  children,
  className = "",
}: ChartContainerProps) => (
  <div className={`bg-card rounded-xl p-6 border border-border ${className}`}>
    <h3 className="text-lg font-semibold text-foreground mb-6">{title}</h3>
    <div className="h-80">{children}</div>
  </div>
);

// Usage Trends Chart
export const UsageTrendsChart = ({
  colorScheme = "professional",
  period = "daily",
  onPeriodChange,
}: {
  colorScheme?: keyof typeof colorSchemes;
  period?: "daily" | "weekly" | "monthly";
  onPeriodChange?: (period: "daily" | "weekly" | "monthly") => void;
}) => {
  const colors = colorSchemes[colorScheme];

  const getData = () => {
    switch (period) {
      case "weekly":
        return usageDataWeekly;
      case "monthly":
        return usageDataMonthly;
      default:
        return usageDataDaily;
    }
  };

  const getTitle = () => {
    switch (period) {
      case "weekly":
        return "Weekly Usage Trends";
      case "monthly":
        return "Monthly Usage Trends";
      default:
        return "Daily Usage Trends";
    }
  };

  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">{getTitle()}</h3>
        {onPeriodChange && (
          <div className="flex space-x-2">
            <button
              onClick={() => onPeriodChange("daily")}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                period === "daily"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              Daily
            </button>
            <button
              onClick={() => onPeriodChange("weekly")}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                period === "weekly"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => onPeriodChange("monthly")}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                period === "monthly"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              Monthly
            </button>
          </div>
        )}
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={getData()}>
            <defs>
              <linearGradient id="systemGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={colors.primary}
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor={colors.primary}
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="appGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={colors.secondary}
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor={colors.secondary}
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="dataGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={colors.tertiary}
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor={colors.tertiary}
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#262626"
              opacity={0.3}
            />
            <XAxis dataKey="time" stroke="#737373" fontSize={12} />
            <YAxis stroke="#737373" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="systemUsage"
              stroke={colors.primary}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#systemGradient)"
              name="System Usage"
            />
            <Area
              type="monotone"
              dataKey="appUsage"
              stroke={colors.secondary}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#appGradient)"
              name="App Usage"
            />
            <Area
              type="monotone"
              dataKey="dataUsage"
              stroke={colors.tertiary}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#dataGradient)"
              name="Data Usage"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// App Distribution Pie Chart
export const AppDistributionChart = ({
  colorScheme = "cyberpunk",
}: {
  colorScheme?: keyof typeof colorSchemes;
}) => {
  const colors = colorSchemes[colorScheme].gradient;

  return (
    <ChartContainer title="Application Usage Distribution">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={appDistributionData}
            cx="50%"
            cy="50%"
            outerRadius={120}
            innerRadius={60}
            paddingAngle={2}
            dataKey="value"
            stroke="none"
          >
            {appDistributionData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                    <p className="text-foreground font-medium">{data.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {data.value}% usage
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {data.sessions} sessions
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

// System Performance Radial Chart
export const SystemPerformanceChart = ({
  colorScheme = "ice",
}: {
  colorScheme?: keyof typeof colorSchemes;
}) => {
  const colors = colorSchemes[colorScheme];

  return (
    <ChartContainer title="System Performance Metrics">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="20%"
          outerRadius="90%"
          data={performanceData}
        >
          <RadialBar
            dataKey="value"
            cornerRadius={10}
            fill={colors.primary}
            background={{ fill: "#262626", opacity: 0.3 }}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                    <p className="text-foreground font-medium">{data.metric}</p>
                    <p className="text-sm text-muted-foreground">
                      {data.value}% usage
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
        </RadialBarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

// Weekly Trends Bar Chart
export const WeeklyTrendsChart = ({
  colorScheme = "fire",
}: {
  colorScheme?: keyof typeof colorSchemes;
}) => {
  const colors = colorSchemes[colorScheme];

  return (
    <ChartContainer title="Weekly Activity Trends">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={weeklyTrendData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#262626" opacity={0.3} />
          <XAxis dataKey="day" stroke="#737373" fontSize={12} />
          <YAxis yAxisId="left" stroke="#737373" fontSize={12} />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="#737373"
            fontSize={12}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            yAxisId="left"
            dataKey="unlocks"
            fill={colors.primary}
            radius={[4, 4, 0, 0]}
            name="Unlocks"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="screenTime"
            stroke={colors.secondary}
            strokeWidth={3}
            dot={{ fill: colors.secondary, strokeWidth: 2, r: 6 }}
            name="Screen Time (min)"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="dataUsage"
            stroke={colors.tertiary}
            strokeWidth={3}
            strokeDasharray="5 5"
            dot={{ fill: colors.tertiary, strokeWidth: 2, r: 4 }}
            name="Data Usage (GB)"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

// Real-time Activity Chart
export const RealTimeActivityChart = ({
  colorScheme = "neon",
}: {
  colorScheme?: keyof typeof colorSchemes;
}) => {
  const colors = colorSchemes[colorScheme];

  const realtimeData = usageDataDaily.map((item, index) => ({
    ...item,
    cpuUsage: Math.floor(Math.random() * 30) + 40,
    memoryUsage: Math.floor(Math.random() * 25) + 50,
    networkActivity: Math.floor(Math.random() * 40) + 20,
  }));

  return (
    <ChartContainer title="Real-time System Activity">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={realtimeData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#262626" opacity={0.3} />
          <XAxis dataKey="time" stroke="#737373" fontSize={12} />
          <YAxis stroke="#737373" fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="cpuUsage"
            stroke={colors.primary}
            strokeWidth={2}
            dot={{ fill: colors.primary, strokeWidth: 2, r: 4 }}
            name="CPU Usage"
          />
          <Line
            type="monotone"
            dataKey="memoryUsage"
            stroke={colors.secondary}
            strokeWidth={2}
            dot={{ fill: colors.secondary, strokeWidth: 2, r: 4 }}
            name="Memory Usage"
          />
          <Line
            type="monotone"
            dataKey="networkActivity"
            stroke={colors.tertiary}
            strokeWidth={2}
            dot={{ fill: colors.tertiary, strokeWidth: 2, r: 4 }}
            name="Network Activity"
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

// Data Usage Comparison Chart
export const DataUsageComparisonChart = ({
  colorScheme = "purple",
}: {
  colorScheme?: keyof typeof colorSchemes;
}) => {
  const colors = colorSchemes[colorScheme];

  const dataComparison = [
    { category: "Social Media", thisWeek: 45, lastWeek: 38 },
    { category: "Streaming", thisWeek: 32, lastWeek: 29 },
    { category: "Work Apps", thisWeek: 28, lastWeek: 35 },
    { category: "Gaming", thisWeek: 18, lastWeek: 22 },
    { category: "Utilities", thisWeek: 12, lastWeek: 15 },
  ];

  return (
    <ChartContainer title="Data Usage Comparison">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={dataComparison} layout="horizontal">
          <CartesianGrid strokeDasharray="3 3" stroke="#262626" opacity={0.3} />
          <XAxis type="number" stroke="#737373" fontSize={12} />
          <YAxis
            dataKey="category"
            type="category"
            stroke="#737373"
            fontSize={12}
            width={80}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="thisWeek"
            fill={colors.primary}
            radius={[0, 4, 4, 0]}
            name="This Week %"
          />
          <Bar
            dataKey="lastWeek"
            fill={colors.secondary}
            radius={[0, 4, 4, 0]}
            name="Last Week %"
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
