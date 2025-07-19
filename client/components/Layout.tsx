import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Monitor,
  Smartphone,
  Wifi,
  BarChart3,
  Settings,
  Menu,
  X,
  Activity,
  Clock,
  Shield,
  Bell,
  Search,
  Sun,
  Moon,
  Zap,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  badge?: string;
}

const sidebarItems: SidebarItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <Home className="h-5 w-5" />,
    path: "/",
  },
  {
    id: "system",
    label: "System Usage",
    icon: <Monitor className="h-5 w-5" />,
    path: "/system",
  },
  {
    id: "apps",
    label: "App Tracking",
    icon: <Smartphone className="h-5 w-5" />,
    path: "/apps",
    badge: "5",
  },
  {
    id: "data",
    label: "Data Usage",
    icon: <Wifi className="h-5 w-5" />,
    path: "/data",
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: <BarChart3 className="h-5 w-5" />,
    path: "/analytics",
  },
  {
    id: "tracker",
    label: "Live Tracker",
    icon: <Zap className="h-5 w-5" />,
    path: "/tracker",
    badge: "Live",
  },
];

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-sidebar transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center px-6 border-b border-sidebar-border">
            <div className="flex items-center space-x-3">
              <div className="bg-sidebar-primary p-2 rounded-lg">
                <Activity className="h-6 w-6 text-sidebar-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-sidebar-foreground">
                  System Monitor
                </h1>
                <p className="text-xs text-sidebar-foreground/60">
                  Enterprise Analytics
                </p>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-sidebar-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-sidebar-foreground/60" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-sidebar-accent text-sidebar-accent-foreground placeholder-sidebar-foreground/60 pl-10 pr-4 py-2 rounded-lg border border-sidebar-border focus:outline-none focus:ring-2 focus:ring-sidebar-ring focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1">
            {sidebarItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className={`group flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-[1.02] ${
                  isActive(item.path)
                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground hover:shadow-sm hover:translate-x-1"
                }`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <div className="flex items-center space-x-3">
                  <div className="transition-transform duration-200 group-hover:scale-110">
                    {item.icon}
                  </div>
                  <span className="transition-all duration-200">
                    {item.label}
                  </span>
                </div>
                {item.badge && (
                  <span className="bg-sidebar-primary text-sidebar-primary-foreground text-xs px-2 py-0.5 rounded-full transition-all duration-200 group-hover:scale-110 group-hover:bg-primary">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Bottom section */}
          <div className="p-4 border-t border-sidebar-border">
            <Link
              to="/settings"
              className="group flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground transition-all duration-200 transform hover:scale-[1.02] hover:translate-x-1 hover:shadow-sm"
            >
              <div className="transition-transform duration-200 group-hover:scale-110 group-hover:rotate-45">
                <Settings className="h-5 w-5" />
              </div>
              <span className="transition-all duration-200">Settings</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:pl-64">
        {/* Top navigation */}
        <header className="bg-card border-b border-border">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent lg:hidden"
              >
                <Menu className="h-6 w-6" />
              </button>
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Usage Analytics Dashboard
                </h2>
                <p className="text-sm text-muted-foreground">
                  Monitor system performance and app usage
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-110 hover:bg-accent rounded-lg"
                title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>
              <button className="relative p-2 text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-110 hover:bg-accent rounded-lg">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full animate-pulse"></span>
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-accent-foreground">
                    A
                  </span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-foreground">Admin</p>
                  <p className="text-xs text-muted-foreground">
                    Microsoft Corp.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
