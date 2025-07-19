import { useState } from "react";
import {
  Settings,
  User,
  Bell,
  Shield,
  Monitor,
  Palette,
  Database,
  Download,
  Globe,
  Zap,
  Clock,
  Eye,
  Lock,
  Smartphone,
  Wifi,
  BarChart3,
  Save,
  RotateCcw,
  ChevronRight,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

interface SettingsSectionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function SettingsSection({
  title,
  description,
  icon,
  children,
}: SettingsSectionProps) {
  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <div className="flex items-start space-x-4 mb-6">
        <div className="p-3 bg-accent rounded-lg">{icon}</div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-1">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

interface ToggleSettingProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

function ToggleSetting({
  label,
  description,
  checked,
  onChange,
  disabled = false,
}: ToggleSettingProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex-1">
        <label className="text-sm font-medium text-foreground">{label}</label>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      <button
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background ${
          checked ? "bg-primary" : "bg-accent"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-background transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}

interface SelectSettingProps {
  label: string;
  description?: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}

function SelectSetting({
  label,
  description,
  value,
  options,
  onChange,
}: SelectSettingProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex-1">
        <label className="text-sm font-medium text-foreground">{label}</label>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-accent text-accent-foreground border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

interface SliderSettingProps {
  label: string;
  description?: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
}

function SliderSetting({
  label,
  description,
  value,
  min,
  max,
  step = 1,
  unit = "",
  onChange,
}: SliderSettingProps) {
  return (
    <div className="py-2">
      <div className="flex items-center justify-between mb-2">
        <div className="flex-1">
          <label className="text-sm font-medium text-foreground">{label}</label>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        <span className="text-sm font-medium text-foreground">
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-accent rounded-lg appearance-none cursor-pointer slider"
      />
    </div>
  );
}

export default function Settings() {
  const { theme, toggleTheme } = useTheme();

  // Theme & Appearance
  const [autoTheme, setAutoTheme] = useState(false);
  const [compactMode, setCompactMode] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);

  // Notifications
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [criticalOnly, setCriticalOnly] = useState(false);

  // Monitoring
  const [realTimeUpdates, setRealTimeUpdates] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30);
  const [dataRetention, setDataRetention] = useState("30");

  // Privacy & Security
  const [analyticsTracking, setAnalyticsTracking] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState(60);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  // Data & Export
  const [exportFormat, setExportFormat] = useState("csv");
  const [autoBackup, setAutoBackup] = useState(false);
  const [compressionLevel, setCompressionLevel] = useState(5);

  const handleSaveSettings = () => {
    // Here you would save settings to your backend/localStorage
    console.log("Settings saved!");
    // Show success toast notification
  };

  const handleResetSettings = () => {
    // Reset all settings to defaults
    setAutoTheme(false);
    setCompactMode(false);
    setAnimationsEnabled(true);
    setEmailNotifications(true);
    setPushNotifications(true);
    setSoundEnabled(true);
    setCriticalOnly(false);
    setRealTimeUpdates(true);
    setAutoRefresh(true);
    setRefreshInterval(30);
    setDataRetention("30");
    setAnalyticsTracking(true);
    setSessionTimeout(60);
    setTwoFactorAuth(false);
    setExportFormat("csv");
    setAutoBackup(false);
    setCompressionLevel(5);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Customize your system monitoring dashboard experience and configure
          preferences.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4">
        <button
          onClick={handleSaveSettings}
          className="flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Save className="h-4 w-4" />
          <span>Save All</span>
        </button>
        <button
          onClick={handleResetSettings}
          className="flex items-center space-x-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:bg-secondary/80 transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Reset to Defaults</span>
        </button>
        <button
          onClick={toggleTheme}
          className="flex items-center space-x-2 bg-accent text-accent-foreground px-4 py-2 rounded-lg hover:bg-accent/80 transition-colors"
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
          <span>Toggle Theme</span>
        </button>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Theme & Appearance */}
        <SettingsSection
          title="Theme & Appearance"
          description="Customize the visual appearance and behavior of the interface"
          icon={<Palette className="h-6 w-6 text-muted-foreground" />}
        >
          <SelectSetting
            label="Theme Mode"
            description="Choose your preferred color scheme"
            value={theme}
            options={[
              { value: "light", label: "Light" },
              { value: "dark", label: "Dark" },
            ]}
            onChange={() => toggleTheme()}
          />
          <ToggleSetting
            label="Auto Theme"
            description="Automatically switch theme based on system preference"
            checked={autoTheme}
            onChange={setAutoTheme}
          />
          <ToggleSetting
            label="Compact Mode"
            description="Reduce spacing and padding for more content visibility"
            checked={compactMode}
            onChange={setCompactMode}
          />
          <ToggleSetting
            label="Animations"
            description="Enable smooth transitions and hover effects"
            checked={animationsEnabled}
            onChange={setAnimationsEnabled}
          />
        </SettingsSection>

        {/* Notifications */}
        <SettingsSection
          title="Notifications"
          description="Configure how and when you receive system alerts and updates"
          icon={<Bell className="h-6 w-6 text-muted-foreground" />}
        >
          <ToggleSetting
            label="Email Notifications"
            description="Receive alerts and reports via email"
            checked={emailNotifications}
            onChange={setEmailNotifications}
          />
          <ToggleSetting
            label="Push Notifications"
            description="Browser notifications for real-time alerts"
            checked={pushNotifications}
            onChange={setPushNotifications}
          />
          <ToggleSetting
            label="Sound Alerts"
            description="Play notification sounds for critical events"
            checked={soundEnabled}
            onChange={setSoundEnabled}
          />
          <ToggleSetting
            label="Critical Events Only"
            description="Only notify for high-priority system events"
            checked={criticalOnly}
            onChange={setCriticalOnly}
          />
        </SettingsSection>

        {/* Monitoring & Data */}
        <SettingsSection
          title="Monitoring & Data"
          description="Configure data collection, refresh rates, and system monitoring behavior"
          icon={<Monitor className="h-6 w-6 text-muted-foreground" />}
        >
          <ToggleSetting
            label="Real-time Updates"
            description="Enable live data streaming for charts and metrics"
            checked={realTimeUpdates}
            onChange={setRealTimeUpdates}
          />
          <ToggleSetting
            label="Auto Refresh"
            description="Automatically refresh data at set intervals"
            checked={autoRefresh}
            onChange={setAutoRefresh}
          />
          <SliderSetting
            label="Refresh Interval"
            description="How often to update data automatically"
            value={refreshInterval}
            min={5}
            max={300}
            step={5}
            unit=" seconds"
            onChange={setRefreshInterval}
          />
          <SelectSetting
            label="Data Retention"
            description="How long to keep historical data"
            value={dataRetention}
            options={[
              { value: "7", label: "7 days" },
              { value: "30", label: "30 days" },
              { value: "90", label: "90 days" },
              { value: "365", label: "1 year" },
              { value: "unlimited", label: "Unlimited" },
            ]}
            onChange={setDataRetention}
          />
        </SettingsSection>

        {/* Privacy & Security */}
        <SettingsSection
          title="Privacy & Security"
          description="Manage your privacy settings and security preferences"
          icon={<Shield className="h-6 w-6 text-muted-foreground" />}
        >
          <ToggleSetting
            label="Analytics Tracking"
            description="Allow anonymous usage analytics to improve the product"
            checked={analyticsTracking}
            onChange={setAnalyticsTracking}
          />
          <SliderSetting
            label="Session Timeout"
            description="Automatically log out after period of inactivity"
            value={sessionTimeout}
            min={15}
            max={480}
            step={15}
            unit=" minutes"
            onChange={setSessionTimeout}
          />
          <ToggleSetting
            label="Two-Factor Authentication"
            description="Add an extra layer of security to your account"
            checked={twoFactorAuth}
            onChange={setTwoFactorAuth}
          />
          <div className="pt-2">
            <button className="flex items-center space-x-2 text-destructive hover:text-destructive/80 text-sm">
              <Trash2 className="h-4 w-4" />
              <span>Clear All Data</span>
            </button>
          </div>
        </SettingsSection>

        {/* Data Export & Backup */}
        <SettingsSection
          title="Data Export & Backup"
          description="Configure data export formats and backup preferences"
          icon={<Database className="h-6 w-6 text-muted-foreground" />}
        >
          <SelectSetting
            label="Default Export Format"
            description="Preferred format for data exports and reports"
            value={exportFormat}
            options={[
              { value: "csv", label: "CSV" },
              { value: "json", label: "JSON" },
              { value: "excel", label: "Excel" },
              { value: "pdf", label: "PDF" },
            ]}
            onChange={setExportFormat}
          />
          <ToggleSetting
            label="Automatic Backup"
            description="Automatically backup your data and settings"
            checked={autoBackup}
            onChange={setAutoBackup}
          />
          <SliderSetting
            label="Compression Level"
            description="Balance between file size and processing time"
            value={compressionLevel}
            min={1}
            max={9}
            step={1}
            onChange={setCompressionLevel}
          />
          <div className="pt-2 space-y-2">
            <button className="flex items-center space-x-2 text-primary hover:text-primary/80 text-sm">
              <Download className="h-4 w-4" />
              <span>Export All Data</span>
            </button>
            <button className="flex items-center space-x-2 text-primary hover:text-primary/80 text-sm">
              <RefreshCw className="h-4 w-4" />
              <span>Backup Now</span>
            </button>
          </div>
        </SettingsSection>

        {/* Account Information */}
        <SettingsSection
          title="Account Information"
          description="Manage your account details and preferences"
          icon={<User className="h-6 w-6 text-muted-foreground" />}
        >
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Display Name
              </label>
              <input
                type="text"
                defaultValue="Admin"
                className="w-full bg-accent text-accent-foreground border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Email
              </label>
              <input
                type="email"
                defaultValue="admin@microsoft.com"
                className="w-full bg-accent text-accent-foreground border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Organization
              </label>
              <input
                type="text"
                defaultValue="Microsoft Corp."
                className="w-full bg-accent text-accent-foreground border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div className="pt-2">
              <button className="text-primary hover:text-primary/80 text-sm">
                Change Password
              </button>
            </div>
          </div>
        </SettingsSection>
      </div>

      {/* System Information */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          System Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Version:</span>
            <span className="ml-2 font-medium text-foreground">v2.4.1</span>
          </div>
          <div>
            <span className="text-muted-foreground">Build:</span>
            <span className="ml-2 font-medium text-foreground">#1234</span>
          </div>
          <div>
            <span className="text-muted-foreground">Environment:</span>
            <span className="ml-2 font-medium text-foreground">Production</span>
          </div>
          <div>
            <span className="text-muted-foreground">Last Updated:</span>
            <span className="ml-2 font-medium text-foreground">2 days ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}
