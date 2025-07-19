import json
import os
import sys
import time
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
from dataclasses import dataclass
from pathlib import Path
import psutil
import logging

try:
    import win32gui
    import win32process
except ImportError:
    raise ImportError("Please install pywin32 using: pip install pywin32")

@dataclass
class AppSession:
    """Enhanced application session with detailed metadata."""
    app_name: str
    start_time: datetime
    end_time: Optional[datetime] = None
    duration_seconds: int = 0
    window_title: str = ""
    pid: int = 0
    session_id: str = ""
    category: str = "unknown"
    productivity_score: Optional[int] = None
    idle_time: int = 0
    switch_count: int = 0
    
    def __post_init__(self):
        """Generate session ID and categorize app."""
        if not self.session_id:
            self.session_id = f"{self.app_name}_{int(self.start_time.timestamp())}"
        
        if not self.category or self.category == "unknown":
            self.category = self._categorize_app()
    
    def _categorize_app(self) -> str:
        """Categorize application based on name."""
        categories = {
            'development': ['code.exe', 'devenv.exe', 'sublime_text.exe', 'atom.exe', 'notepad++.exe', 'pycharm64.exe', 'intellij.exe'],
            'browser': ['chrome.exe', 'firefox.exe', 'msedge.exe', 'opera.exe', 'safari.exe', 'brave.exe'],
            'communication': ['teams.exe', 'slack.exe', 'discord.exe', 'zoom.exe', 'skype.exe', 'whatsapp.exe'],
            'media': ['vlc.exe', 'spotify.exe', 'itunes.exe', 'photoshop.exe', 'premiere.exe', 'gimp.exe'],
            'office': ['winword.exe', 'excel.exe', 'powerpoint.exe', 'outlook.exe', 'onenote.exe'],
            'gaming': ['steam.exe', 'epicgameslauncher.exe', 'origin.exe', 'battle.net.exe', 'roblox.exe'],
            'system': ['explorer.exe', 'taskmgr.exe', 'cmd.exe', 'powershell.exe', 'services.exe'],
            'utilities': ['calculator.exe', 'notepad.exe', 'mspaint.exe', 'snipping.exe', 'winrar.exe']
        }
        
        app_lower = self.app_name.lower()
        for category, apps in categories.items():
            if app_lower in apps:
                return category
        return 'unknown'
    
    def to_dict(self) -> Dict[str, Any]:
        """Enhanced dictionary representation."""
        return {
            "session_id": self.session_id,
            "start": self.start_time.strftime("%Y-%m-%d %H:%M:%S"),
            "end": self.end_time.strftime("%Y-%m-%d %H:%M:%S") if self.end_time else None,
            "duration_seconds": self.duration_seconds,
            "window_title": self.window_title,
            "pid": self.pid,
            "category": self.category,
            "productivity_score": self.productivity_score,
            "idle_time": self.idle_time,
            "switch_count": self.switch_count,
            "metadata": {
                "day_of_week": self.start_time.strftime("%A"),
                "hour": self.start_time.hour,
                "is_weekend": self.start_time.weekday() >= 5,
                "time_of_day": self._get_time_of_day()
            }
        }
    
    def _get_time_of_day(self) -> str:
        """Get time of day category."""
        hour = self.start_time.hour
        if 5 <= hour < 12:
            return "morning"
        elif 12 <= hour < 17:
            return "afternoon"
        elif 17 <= hour < 21:
            return "evening"
        else:
            return "night"
    
    @classmethod
    def from_dict(cls, app_name: str, data: Dict[str, Any]) -> 'AppSession':
        """Create session from dictionary."""
        start_time = datetime.strptime(data["start"], "%Y-%m-%d %H:%M:%S")
        end_time = datetime.strptime(data["end"], "%Y-%m-%d %H:%M:%S") if data.get("end") else None
        
        return cls(
            app_name=app_name,
            start_time=start_time,
            end_time=end_time,
            duration_seconds=data.get("duration_seconds", 0),
            window_title=data.get("window_title", ""),
            pid=data.get("pid", 0),
            session_id=data.get("session_id", ""),
            category=data.get("category", "unknown"),
            productivity_score=data.get("productivity_score"),
            idle_time=data.get("idle_time", 0),
            switch_count=data.get("switch_count", 0)
        )

class AppUsageConfig:
    """Configuration management for the app tracker."""
    
    def __init__(self, config_path: str = "config.json"):
        self.config_path = Path(config_path)
        self._load_config()
    
    def _load_config(self):
        """Load configuration from file or use defaults."""
        default_config = {
            "log_file": "app_usage_log.json",
            "check_interval": 5,
            "min_session_duration": 3,
            "excluded_apps": ["dwm.exe", "winlogon.exe", "csrss.exe", "searchhost.exe"],
            "enable_logging": True,
            "log_level": "INFO",
            "enable_productivity_tracking": True,
            "enable_detailed_tracking": True
        }
        
        if self.config_path.exists():
            try:
                with open(self.config_path, 'r') as f:
                    user_config = json.load(f)
                    default_config.update(user_config)
            except (json.JSONDecodeError, IOError) as e:
                print(f"Could not load config: {e}. Using defaults.")
        
        for key, value in default_config.items():
            setattr(self, key, value)
    
    def save_config(self):
        """Save current configuration to file."""
        config_dict = {k: v for k, v in self.__dict__.items() if not k.startswith('_')}
        config_dict.pop('config_path', None)
        
        with open(self.config_path, 'w') as f:
            json.dump(config_dict, f, indent=4)

class EnhancedWindowsAppDetector:
    """Enhanced Windows app detector with more details."""
    
    def __init__(self):
        self.switch_count = 0
        self.last_app = None
    
    def get_active_app_info(self) -> Optional[Dict[str, Any]]:
        """Get detailed information about the currently active application."""
        try:
            hwnd = win32gui.GetForegroundWindow()
            if hwnd == 0:
                return self._get_desktop_info()
            
            window_title = win32gui.GetWindowText(hwnd)
            _, pid = win32process.GetWindowThreadProcessId(hwnd)
            
            try:
                proc = psutil.Process(pid)
                
                # Get additional process info
                process_info = {
                    "name": proc.name(),
                    "title": window_title,
                    "pid": pid,
                    "cpu_percent": proc.cpu_percent(),
                    "memory_mb": round(proc.memory_info().rss / 1024 / 1024, 2),
                    "create_time": datetime.fromtimestamp(proc.create_time()),
                    "window_handle": hwnd
                }
                
                # Track app switches
                if self.last_app != proc.name():
                    self.switch_count += 1
                    self.last_app = proc.name()
                    process_info["switch_count"] = self.switch_count
                
                return process_info
                
            except psutil.NoSuchProcess:
                return {
                    "name": "Unknown Process",
                    "title": window_title,
                    "pid": pid,
                    "cpu_percent": 0,
                    "memory_mb": 0,
                    "create_time": datetime.now(),
                    "window_handle": hwnd
                }
                
        except Exception as e:
            print(f"Error getting active app: {e}")
            return None
    
    def _get_desktop_info(self) -> Dict[str, Any]:
        """Get desktop information."""
        return {
            "name": "Desktop",
            "title": "Desktop",
            "pid": 0,
            "cpu_percent": 0,
            "memory_mb": 0,
            "create_time": datetime.now(),
            "window_handle": 0
        }

class EnhancedDataManager:
    """Enhanced data manager with detailed tracking."""
    
    def __init__(self, log_file: str):
        self.log_file = Path(log_file)
        self.stats_file = Path(log_file).with_suffix('.stats.json')
        self._ensure_log_directory()
    
    def _ensure_log_directory(self):
        """Create log directory if it doesn't exist."""
        self.log_file.parent.mkdir(parents=True, exist_ok=True)
    
    def load_data(self) -> Dict[str, List[AppSession]]:
        """Load existing application usage data."""
        if not self.log_file.exists():
            return {}
        
        try:
            with open(self.log_file, 'r') as f:
                raw_data = json.load(f)
            
            # Handle both old and new formats
            if "applications" in raw_data:  # New format
                data = {}
                for app_name, app_data in raw_data["applications"].items():
                    data[app_name] = [
                        AppSession.from_dict(app_name, session_data)
                        for session_data in app_data["sessions"]
                    ]
                return data
            else:  # Old format
                data = {}
                for app_name, sessions in raw_data.items():
                    data[app_name] = [
                        AppSession.from_dict(app_name, session_data)
                        for session_data in sessions
                    ]
                return data
            
        except (json.JSONDecodeError, IOError) as e:
            print(f"Error loading data: {e}")
            return {}
    
    def save_data(self, data: Dict[str, List[AppSession]]):
        """Save enhanced data with statistics."""
        try:
            # Convert to enhanced format
            enhanced_data = {
                "metadata": {
                    "version": "2.0",
                    "last_updated": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                    "total_sessions": sum(len(sessions) for sessions in data.values()),
                    "total_apps": len(data),
                    "tracking_period": self._get_tracking_period(data)
                },
                "applications": {}
            }
            
            # Process each application
            for app_name, sessions in data.items():
                if sessions:  # Only process if there are sessions
                    app_data = {
                        "name": app_name,
                        "category": sessions[0].category if sessions else "unknown",
                        "total_sessions": len(sessions),
                        "total_duration": sum(s.duration_seconds for s in sessions),
                        "average_session_duration": round(sum(s.duration_seconds for s in sessions) / len(sessions), 2) if sessions else 0,
                        "first_used": min(s.start_time for s in sessions).strftime("%Y-%m-%d %H:%M:%S") if sessions else None,
                        "last_used": max(s.end_time for s in sessions if s.end_time).strftime("%Y-%m-%d %H:%M:%S") if sessions else None,
                        "sessions": [session.to_dict() for session in sessions],
                        "daily_usage": self._calculate_daily_usage(sessions),
                        "hourly_pattern": self._calculate_hourly_pattern(sessions)
                    }
                    enhanced_data["applications"][app_name] = app_data
            
            # Save enhanced data
            with open(self.log_file, 'w') as f:
                json.dump(enhanced_data, f, indent=2)
            
            # Save separate stats file
            self._save_statistics(enhanced_data)
                
        except IOError as e:
            print(f"Error saving enhanced data: {e}")
    
    def _get_tracking_period(self, data: Dict[str, List[AppSession]]) -> Dict[str, Any]:
        """Calculate tracking period."""
        all_sessions = [session for sessions in data.values() for session in sessions]
        if not all_sessions:
            return {"start": None, "end": None, "days": 0}
        
        start_date = min(s.start_time for s in all_sessions)
        end_date = max(s.end_time for s in all_sessions if s.end_time)
        
        if end_date:
            days = (end_date - start_date).days + 1
        else:
            days = 1
        
        return {
            "start": start_date.strftime("%Y-%m-%d"),
            "end": end_date.strftime("%Y-%m-%d") if end_date else None,
            "days": days
        }
    
    def _calculate_daily_usage(self, sessions: List[AppSession]) -> Dict[str, int]:
        """Calculate daily usage patterns."""
        daily_usage = {}
        for session in sessions:
            date = session.start_time.strftime("%Y-%m-%d")
            daily_usage[date] = daily_usage.get(date, 0) + session.duration_seconds
        return daily_usage
    
    def _calculate_hourly_pattern(self, sessions: List[AppSession]) -> Dict[str, int]:
        """Calculate hourly usage patterns."""
        hourly_pattern = {str(hour): 0 for hour in range(24)}
        for session in sessions:
            hour = str(session.start_time.hour)
            hourly_pattern[hour] += session.duration_seconds
        return hourly_pattern
    
    def _save_statistics(self, data: Dict[str, Any]):
        """Save aggregated statistics."""
        stats = {
            "summary": data["metadata"],
            "top_apps": self._get_top_apps(data["applications"]),
            "category_breakdown": self._get_category_breakdown(data["applications"]),
            "productivity_metrics": self._calculate_productivity_metrics(data["applications"]),
            "time_patterns": self._analyze_time_patterns(data["applications"])
        }
        
        with open(self.stats_file, 'w') as f:
            json.dump(stats, f, indent=2)
    
    def _get_top_apps(self, apps: Dict[str, Any], limit: int = 10) -> List[Dict[str, Any]]:
        """Get top applications by usage."""
        app_list = []
        for app_name, app_data in apps.items():
            app_list.append({
                "name": app_name,
                "category": app_data["category"],
                "total_duration": app_data["total_duration"],
                "total_sessions": app_data["total_sessions"],
                "average_session": app_data["average_session_duration"]
            })
        
        return sorted(app_list, key=lambda x: x["total_duration"], reverse=True)[:limit]
    
    def _get_category_breakdown(self, apps: Dict[str, Any]) -> Dict[str, Any]:
        """Get usage breakdown by category."""
        categories = {}
        for app_data in apps.values():
            category = app_data["category"]
            if category not in categories:
                categories[category] = {
                    "total_duration": 0,
                    "total_sessions": 0,
                    "app_count": 0
                }
            
            categories[category]["total_duration"] += app_data["total_duration"]
            categories[category]["total_sessions"] += app_data["total_sessions"]
            categories[category]["app_count"] += 1
        
        return categories
    
    def _calculate_productivity_metrics(self, apps: Dict[str, Any]) -> Dict[str, Any]:
        """Calculate productivity metrics."""
        productive_categories = ['development', 'office', 'utilities']
        total_time = sum(app_data["total_duration"] for app_data in apps.values())
        productive_time = sum(
            app_data["total_duration"] 
            for app_data in apps.values() 
            if app_data["category"] in productive_categories
        )
        
        return {
            "total_time": total_time,
            "productive_time": productive_time,
            "productivity_percentage": round((productive_time / total_time * 100), 2) if total_time > 0 else 0,
            "distraction_time": total_time - productive_time
        }
    
    def _analyze_time_patterns(self, apps: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze time usage patterns."""
        # Aggregate all hourly patterns
        combined_hourly = {}
        weekend_usage = 0
        weekday_usage = 0
        
        for app_data in apps.values():
            for hour, duration in app_data["hourly_pattern"].items():
                combined_hourly[hour] = combined_hourly.get(hour, 0) + duration
        
        # Find peak hours
        peak_hours = sorted(combined_hourly.items(), key=lambda x: x[1], reverse=True)[:3]
        
        return {
            "peak_hours": [{"hour": int(hour), "duration": duration} for hour, duration in peak_hours],
            "weekend_usage": weekend_usage,
            "weekday_usage": weekday_usage,
            "hourly_distribution": combined_hourly
        }
    
    def backup_data(self):
        """Create a backup of the current data."""
        if self.log_file.exists():
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            backup_path = self.log_file.with_suffix(f".backup_{timestamp}.json")
            
            try:
                import shutil
                shutil.copy2(self.log_file, backup_path)
                print(f"Backup created: {backup_path}")
            except IOError as e:
                print(f"Error creating backup: {e}")

class EnhancedUsageAnalyzer:
    """Enhanced analysis and reporting capabilities."""
    
    def __init__(self, data: Dict[str, List[AppSession]]):
        self.data = data
    
    def get_daily_usage(self, date: datetime = None) -> Dict[str, int]:
        """Get usage statistics for a specific date."""
        if date is None:
            date = datetime.now()
        
        target_date = date.strftime("%Y-%m-%d")
        daily_usage = {}
        
        for app_name, sessions in self.data.items():
            daily_time = sum(
                session.duration_seconds
                for session in sessions
                if session.start_time.strftime("%Y-%m-%d") == target_date
            )
            if daily_time > 0:
                daily_usage[app_name] = daily_time
        
        return daily_usage
    
    def get_top_apps(self, limit: int = 10) -> List[tuple]:
        """Get top applications by total usage time."""
        app_totals = {}
        
        for app_name, sessions in self.data.items():
            total_time = sum(session.duration_seconds for session in sessions)
            app_totals[app_name] = total_time
        
        return sorted(app_totals.items(), key=lambda x: x[1], reverse=True)[:limit]
    
    def get_category_analysis(self) -> Dict[str, Dict[str, Any]]:
        """Get analysis by application category."""
        category_stats = {}
        
        for app_name, sessions in self.data.items():
            if not sessions:
                continue
                
            category = sessions[0].category
            total_time = sum(session.duration_seconds for session in sessions)
            
            if category not in category_stats:
                category_stats[category] = {
                    "total_time": 0,
                    "apps": [],
                    "session_count": 0
                }
            
            category_stats[category]["total_time"] += total_time
            category_stats[category]["apps"].append(app_name)
            category_stats[category]["session_count"] += len(sessions)
        
        return category_stats
    
    def _format_duration(self, seconds: int) -> str:
        """Format duration in hours, minutes, and seconds."""
        hours = seconds // 3600
        minutes = (seconds % 3600) // 60
        secs = seconds % 60
        
        if hours > 0:
            return f"{hours}h {minutes}m {secs}s"
        elif minutes > 0:
            return f"{minutes}m {secs}s"
        else:
            return f"{secs}s"
    
    def generate_enhanced_report(self) -> str:
        """Generate a comprehensive enhanced usage report."""
        today_usage = self.get_daily_usage()
        top_apps = self.get_top_apps(5)
        category_analysis = self.get_category_analysis()
        
        report = f"Enhanced Usage Report - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n"
        report += "=" * 60 + "\n\n"
        
        # Top Apps Section
        report += "Top 5 Apps (All Time):\n"
        report += "-" * 30 + "\n"
        for i, (app, seconds) in enumerate(top_apps, 1):
            duration = self._format_duration(seconds)
            app_sessions = len(self.data.get(app, []))
            category = self.data[app][0].category if self.data.get(app) else "unknown"
            report += f"{i}. {app} ({category}): {duration} ({app_sessions} sessions)\n"
        
        # Today's Usage Section
        report += "\nToday's Usage:\n"
        report += "-" * 30 + "\n"
        if today_usage:
            for app, seconds in sorted(today_usage.items(), key=lambda x: x[1], reverse=True):
                duration = self._format_duration(seconds)
                category = self.data[app][0].category if self.data.get(app) else "unknown"
                report += f"• {app} ({category}): {duration}\n"
        else:
            report += "No usage data for today.\n"
        
        # Category Breakdown
        report += "\nCategory Breakdown:\n"
        report += "-" * 30 + "\n"
        for category, stats in sorted(category_analysis.items(), key=lambda x: x[1]["total_time"], reverse=True):
            duration = self._format_duration(stats["total_time"])
            app_count = len(stats["apps"])
            report += f"• {category.title()}: {duration} ({app_count} apps, {stats['session_count']} sessions)\n"
        
        # Productivity Metrics
        productive_categories = ['development', 'office', 'utilities']
        total_time = sum(stats["total_time"] for stats in category_analysis.values())
        productive_time = sum(
            stats["total_time"] 
            for cat, stats in category_analysis.items() 
            if cat in productive_categories
        )
        
        if total_time > 0:
            productivity_percentage = (productive_time / total_time) * 100
            report += "\nProductivity Metrics:\n"
            report += "-" * 30 + "\n"
            report += f"• Total Time: {self._format_duration(total_time)}\n"
            report += f"• Productive Time: {self._format_duration(productive_time)}\n"
            report += f"• Productivity: {productivity_percentage:.1f}%\n"
            report += f"• Distraction Time: {self._format_duration(total_time - productive_time)}\n"
        
        return report

class SafeLogger:
    """Unicode-safe logging wrapper."""
    
    def __init__(self, logger_name: str = __name__):
        self.logger = logging.getLogger(logger_name)
        self._setup_unicode_logging()
    
    def _setup_unicode_logging(self):
        """Setup logging with proper Unicode support."""
        # Set UTF-8 encoding for stdout if possible
        if hasattr(sys.stdout, 'reconfigure'):
            try:
                sys.stdout.reconfigure(encoding='utf-8')
            except (AttributeError, OSError):
                pass
        
        # Create handlers with proper encoding
        file_handler = logging.FileHandler('app_tracker.log', encoding='utf-8')
        console_handler = logging.StreamHandler(sys.stdout)
        
        # Set formatting
        formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
        file_handler.setFormatter(formatter)
        console_handler.setFormatter(formatter)
        
        # Configure logger
        self.logger.setLevel(logging.INFO)
        self.logger.addHandler(file_handler)
        self.logger.addHandler(console_handler)
    
    def safe_log(self, level, message):
        """Log message with fallback for Unicode issues."""
        try:
            getattr(self.logger, level)(message)
        except UnicodeEncodeError:
            # Fallback: replace emojis with ASCII equivalents
            safe_message = self._make_ascii_safe(message)
            getattr(self.logger, level)(safe_message)
    
    def _make_ascii_safe(self, message):
        """Convert Unicode emojis to ASCII equivalents."""
        emoji_map = {
            '🔄': '[*]',
            '🟢': '[+]',
            '✅': '[OK]',
            '🛑': '[!]',
            '🔴': '[-]',
            '❌': '[ERROR]',
            '📊': '[REPORT]',
            '🏆': '[TOP]',
            '📅': '[TODAY]'
        }
        
        for emoji, ascii_equiv in emoji_map.items():
            message = message.replace(emoji, ascii_equiv)
        
        return message
    
    def info(self, message):
        self.safe_log('info', message)
    
    def error(self, message):
        self.safe_log('error', message)
    
    def warning(self, message):
        self.safe_log('warning', message)

class EnhancedAppUsageTracker:
    """Enhanced main application usage tracker class."""
    
    def __init__(self, config_path: str = "config.json"):
        self.config = AppUsageConfig(config_path)
        self.detector = EnhancedWindowsAppDetector()
        self.data_manager = EnhancedDataManager(self.config.log_file)
        
        # Use safe logger
        self.logger = SafeLogger()
        
        # Load existing data
        self.data = self.data_manager.load_data()
        self.current_session: Optional[AppSession] = None
        self.is_running = False
    
    def _should_track_app(self, app_name: str) -> bool:
        """Check if the application should be tracked."""
        return app_name.lower() not in [app.lower() for app in self.config.excluded_apps]
    
    def _calculate_productivity_score(self, app_name: str, category: str) -> int:
        """Calculate productivity score for an app session."""
        if not self.config.enable_productivity_tracking:
            return None
        
        scores = {
            'development': 9,
            'office': 8,
            'utilities': 7,
            'communication': 6,
            'browser': 5,
            'media': 4,
            'gaming': 2,
            'system': 6,
            'unknown': 5
        }
        
        return scores.get(category, 5)
    
    def _end_current_session(self):
        """End the current tracking session."""
        if self.current_session:
            self.current_session.end_time = datetime.now()
            self.current_session.duration_seconds = int(
                (self.current_session.end_time - self.current_session.start_time).total_seconds()
            )
            
            # Calculate productivity score
            self.current_session.productivity_score = self._calculate_productivity_score(
                self.current_session.app_name, 
                self.current_session.category
            )
            
            # Only save sessions longer than minimum duration
            if self.current_session.duration_seconds >= self.config.min_session_duration:
                app_name = self.current_session.app_name
                
                if app_name not in self.data:
                    self.data[app_name] = []
                
                self.data[app_name].append(self.current_session)
                self.data_manager.save_data(self.data)
                
                self.logger.info(f"✅ {app_name} ({self.current_session.category}) - {self.current_session.duration_seconds}s")
    
    def _start_new_session(self, app_info: Dict[str, Any]):
        """Start a new tracking session."""
        app_name = app_info["name"]
        if self._should_track_app(app_name):
            self.current_session = AppSession(
                app_name=app_name,
                start_time=datetime.now(),
                window_title=app_info.get("title", ""),
                pid=app_info.get("pid", 0),
                switch_count=app_info.get("switch_count", 0)
            )
            
            self.logger.info(f"🟢 Started tracking: {app_name} ({self.current_session.category})")
    
    def start_tracking(self):
        """Start the application usage tracking."""
        self.is_running = True
        self.logger.info("🔄 Enhanced app usage tracking started...")
        
        try:
            while self.is_running:
                app_info = self.detector.get_active_app_info()
                
                if app_info:
                    current_app = app_info["name"]
                    
                    # Check if app changed
                    if not self.current_session or self.current_session.app_name != current_app:
                        self._end_current_session()
                        self._start_new_session(app_info)
                
                time.sleep(self.config.check_interval)
                
        except KeyboardInterrupt:
            self.logger.info("🛑 Tracking stopped by user")
        except Exception as e:
            self.logger.error(f"❌ Tracking error: {e}")
        finally:
            self.stop_tracking()
    
    def stop_tracking(self):
        """Stop the application usage tracking."""
        self.is_running = False
        self._end_current_session()
        self.logger.info("🔴 Enhanced tracking stopped")
    
    def get_analyzer(self) -> EnhancedUsageAnalyzer:
        """Get an enhanced analyzer instance for the current data."""
        return EnhancedUsageAnalyzer(self.data)
    
    def create_backup(self):
        """Create a backup of the current data."""
        self.data_manager.backup_data()
    
    def export_data(self, format_type: str = "json") -> str:
        """Export data in specified format."""
        if format_type == "json":
            return json.dumps(self.data, default=str, indent=2)
        elif format_type == "csv":
            # Implementation for CSV export
            pass
        else:
            raise ValueError(f"Unsupported format: {format_type}")

# Usage Example
def main():
    """Main function to run the enhanced tracker."""
    # Set environment variable for Unicode support
    os.environ['PYTHONIOENCODING'] = 'utf-8'
    
    tracker = EnhancedAppUsageTracker()
    
    try:
        # Start tracking
        tracker.start_tracking()
    except KeyboardInterrupt:
        print("\n🛑 Stopping enhanced tracker...")
    finally:
        # Generate enhanced report before exit
        analyzer = tracker.get_analyzer()
        print("\n" + analyzer.generate_enhanced_report())
        
        # Create backup
        tracker.create_backup()

if __name__ == "__main__":
    main()
