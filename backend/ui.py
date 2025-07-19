import tkinter as tk
from tkinter import ttk, messagebox, filedialog
import matplotlib.pyplot as plt
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
import matplotlib.dates as mdates
from datetime import datetime, timedelta
import json
import threading
import queue
import os
from pathlib import Path

# Import your enhanced tracker classes
from backend.enhanced_tracker import EnhancedAppUsageTracker, EnhancedUsageAnalyzer

class AppUsageTrackerGUI:
    """Main GUI class for the Application Usage Tracker."""
    
    def __init__(self, root):
        self.root = root
        self.root.title("Application Usage Tracker")
        self.root.geometry("1200x800")
        self.root.configure(bg='#f0f0f0')
        
        # Initialize tracker
        self.tracker = EnhancedAppUsageTracker()
        self.is_tracking = False
        self.tracking_thread = None
        self.update_queue = queue.Queue()
        
        # Create GUI elements
        self.create_widgets()
        self.create_menu()
        self.setup_charts()
        
        # Start periodic updates
        self.update_gui()
    
    def create_widgets(self):
        """Create all GUI widgets."""
        # Main container
        main_frame = ttk.Frame(self.root, padding="10")
        main_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # Configure grid weights
        self.root.columnconfigure(0, weight=1)
        self.root.rowconfigure(0, weight=1)
        main_frame.columnconfigure(1, weight=1)
        main_frame.rowconfigure(2, weight=1)
        
        # Control Panel
        self.create_control_panel(main_frame)
        
        # Status Panel
        self.create_status_panel(main_frame)
        
        # Main Content Area (Notebook)
        self.create_notebook(main_frame)
    
    def create_control_panel(self, parent):
        """Create the control panel with start/stop buttons."""
        control_frame = ttk.LabelFrame(parent, text="Control Panel", padding="10")
        control_frame.grid(row=0, column=0, columnspan=2, sticky=(tk.W, tk.E), pady=(0, 10))
        
        # Start/Stop button
        self.start_stop_btn = ttk.Button(
            control_frame, 
            text="Start Tracking", 
            command=self.toggle_tracking,
            style="Success.TButton"
        )
        self.start_stop_btn.grid(row=0, column=0, padx=(0, 10))
        
        # Backup button
        backup_btn = ttk.Button(
            control_frame, 
            text="Create Backup", 
            command=self.create_backup
        )
        backup_btn.grid(row=0, column=1, padx=(0, 10))
        
        # Export button
        export_btn = ttk.Button(
            control_frame, 
            text="Export Data", 
            command=self.export_data
        )
        export_btn.grid(row=0, column=2, padx=(0, 10))
        
        # Settings button
        settings_btn = ttk.Button(
            control_frame, 
            text="Settings", 
            command=self.open_settings
        )
        settings_btn.grid(row=0, column=3)
    
    def create_status_panel(self, parent):
        """Create the status panel showing current info."""
        status_frame = ttk.LabelFrame(parent, text="Status", padding="10")
        status_frame.grid(row=1, column=0, columnspan=2, sticky=(tk.W, tk.E), pady=(0, 10))
        
        # Status labels
        self.status_label = ttk.Label(status_frame, text="Status: Not tracking", font=("Arial", 10, "bold"))
        self.status_label.grid(row=0, column=0, sticky=tk.W)
        
        self.current_app_label = ttk.Label(status_frame, text="Current App: None")
        self.current_app_label.grid(row=1, column=0, sticky=tk.W)
        
        self.session_time_label = ttk.Label(status_frame, text="Session Time: 0s")
        self.session_time_label.grid(row=2, column=0, sticky=tk.W)
        
        self.total_time_label = ttk.Label(status_frame, text="Total Time Today: 0s")
        self.total_time_label.grid(row=0, column=1, sticky=tk.W, padx=(50, 0))
        
        self.productivity_label = ttk.Label(status_frame, text="Productivity: 0%")
        self.productivity_label.grid(row=1, column=1, sticky=tk.W, padx=(50, 0))
    
    def create_notebook(self, parent):
        """Create the main notebook with tabs."""
        self.notebook = ttk.Notebook(parent)
        self.notebook.grid(row=2, column=0, columnspan=2, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # Dashboard Tab
        self.create_dashboard_tab()
        
        # Applications Tab
        self.create_applications_tab()
        
        # Analytics Tab
        self.create_analytics_tab()
        
        # Reports Tab
        self.create_reports_tab()
    
    def create_dashboard_tab(self):
        """Create the dashboard tab with overview."""
        dashboard_frame = ttk.Frame(self.notebook)
        self.notebook.add(dashboard_frame, text="Dashboard")
        
        # Configure grid
        dashboard_frame.columnconfigure(0, weight=1)
        dashboard_frame.columnconfigure(1, weight=1)
        dashboard_frame.rowconfigure(1, weight=1)
        
        # Today's Usage Chart
        chart_frame = ttk.LabelFrame(dashboard_frame, text="Today's Usage", padding="10")
        chart_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S), padx=(0, 5), pady=(0, 10))
        
        # Category Breakdown Chart
        category_frame = ttk.LabelFrame(dashboard_frame, text="Category Breakdown", padding="10")
        category_frame.grid(row=0, column=1, sticky=(tk.W, tk.E, tk.N, tk.S), padx=(5, 0), pady=(0, 10))
        
        # Recent Activity
        activity_frame = ttk.LabelFrame(dashboard_frame, text="Recent Activity", padding="10")
        activity_frame.grid(row=1, column=0, columnspan=2, sticky=(tk.W, tk.E, tk.N, tk.S), pady=(0, 10))
        
        # Create charts
        self.create_dashboard_charts(chart_frame, category_frame)
        self.create_activity_list(activity_frame)
    
    def create_applications_tab(self):
        """Create the applications tab with detailed app info."""
        apps_frame = ttk.Frame(self.notebook)
        self.notebook.add(apps_frame, text="Applications")
        
        # Configure grid
        apps_frame.columnconfigure(0, weight=1)
        apps_frame.rowconfigure(1, weight=1)
        
        # Search and filter
        search_frame = ttk.Frame(apps_frame)
        search_frame.grid(row=0, column=0, sticky=(tk.W, tk.E), pady=(0, 10))
        
        ttk.Label(search_frame, text="Search:").grid(row=0, column=0, padx=(0, 5))
        self.search_var = tk.StringVar()
        self.search_entry = ttk.Entry(search_frame, textvariable=self.search_var)
        self.search_entry.grid(row=0, column=1, padx=(0, 10))
        self.search_entry.bind('<KeyRelease>', self.filter_applications)
        
        # Category filter
        ttk.Label(search_frame, text="Category:").grid(row=0, column=2, padx=(0, 5))
        self.category_var = tk.StringVar()
        self.category_combo = ttk.Combobox(search_frame, textvariable=self.category_var, state="readonly")
        self.category_combo.grid(row=0, column=3)
        self.category_combo.bind('<<ComboboxSelected>>', self.filter_applications)
        
        # Applications tree
        self.create_applications_tree(apps_frame)
    
    def create_analytics_tab(self):
        """Create the analytics tab with charts and graphs."""
        analytics_frame = ttk.Frame(self.notebook)
        self.notebook.add(analytics_frame, text="Analytics")
        
        # Configure grid
        analytics_frame.columnconfigure(0, weight=1)
        analytics_frame.rowconfigure(0, weight=1)
        
        # Chart selection
        chart_control_frame = ttk.Frame(analytics_frame)
        chart_control_frame.grid(row=0, column=0, sticky=(tk.W, tk.E), pady=(0, 10))
        
        ttk.Label(chart_control_frame, text="Chart Type:").grid(row=0, column=0, padx=(0, 5))
        self.chart_type_var = tk.StringVar(value="Daily Usage")
        chart_type_combo = ttk.Combobox(
            chart_control_frame, 
            textvariable=self.chart_type_var,
            values=["Daily Usage", "Hourly Pattern", "Category Analysis", "Productivity Trend"],
            state="readonly"
        )
        chart_type_combo.grid(row=0, column=1, padx=(0, 10))
        chart_type_combo.bind('<<ComboboxSelected>>', self.update_analytics_chart)
        
        # Chart area
        self.analytics_chart_frame = ttk.Frame(analytics_frame)
        self.analytics_chart_frame.grid(row=1, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        self.analytics_chart_frame.columnconfigure(0, weight=1)
        self.analytics_chart_frame.rowconfigure(0, weight=1)
    
    def create_reports_tab(self):
        """Create the reports tab with text reports."""
        reports_frame = ttk.Frame(self.notebook)
        self.notebook.add(reports_frame, text="Reports")
        
        # Configure grid
        reports_frame.columnconfigure(0, weight=1)
        reports_frame.rowconfigure(1, weight=1)
        
        # Report controls
        report_control_frame = ttk.Frame(reports_frame)
        report_control_frame.grid(row=0, column=0, sticky=(tk.W, tk.E), pady=(0, 10))
        
        ttk.Button(
            report_control_frame, 
            text="Generate Report", 
            command=self.generate_report
        ).grid(row=0, column=0, padx=(0, 10))
        
        ttk.Button(
            report_control_frame, 
            text="Save Report", 
            command=self.save_report
        ).grid(row=0, column=1)
        
        # Report text area
        self.report_text = tk.Text(reports_frame, wrap=tk.WORD, font=("Courier", 10))
        self.report_text.grid(row=1, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # Scrollbar for text area
        report_scrollbar = ttk.Scrollbar(reports_frame, orient=tk.VERTICAL, command=self.report_text.yview)
        report_scrollbar.grid(row=1, column=1, sticky=(tk.N, tk.S))
        self.report_text.configure(yscrollcommand=report_scrollbar.set)
    
    def create_dashboard_charts(self, chart_frame, category_frame):
        """Create charts for the dashboard."""
        # Today's usage pie chart
        self.today_fig, self.today_ax = plt.subplots(figsize=(6, 4))
        self.today_canvas = FigureCanvasTkAgg(self.today_fig, chart_frame)
        self.today_canvas.get_tk_widget().pack(fill=tk.BOTH, expand=True)
        
        # Category breakdown pie chart
        self.category_fig, self.category_ax = plt.subplots(figsize=(6, 4))
        self.category_canvas = FigureCanvasTkAgg(self.category_fig, category_frame)
        self.category_canvas.get_tk_widget().pack(fill=tk.BOTH, expand=True)
        
        # Initial chart update
        self.update_dashboard_charts()
    
    def create_activity_list(self, activity_frame):
        """Create recent activity list."""
        # Activity tree
        columns = ("Time", "Application", "Category", "Duration")
        self.activity_tree = ttk.Treeview(activity_frame, columns=columns, show="headings", height=10)
        
        # Configure columns
        for col in columns:
            self.activity_tree.heading(col, text=col)
            self.activity_tree.column(col, width=150)
        
        # Scrollbar
        activity_scrollbar = ttk.Scrollbar(activity_frame, orient=tk.VERTICAL, command=self.activity_tree.yview)
        self.activity_tree.configure(yscrollcommand=activity_scrollbar.set)
        
        # Pack
        self.activity_tree.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        activity_scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
    
    def create_applications_tree(self, apps_frame):
        """Create applications tree view."""
        # Applications tree
        columns = ("Application", "Category", "Total Time", "Sessions", "Avg Session", "Last Used")
        self.apps_tree = ttk.Treeview(apps_frame, columns=columns, show="headings")
        
        # Configure columns
        column_widths = {"Application": 200, "Category": 120, "Total Time": 100, 
                        "Sessions": 80, "Avg Session": 100, "Last Used": 150}
        
        for col in columns:
            self.apps_tree.heading(col, text=col)
            self.apps_tree.column(col, width=column_widths.get(col, 100))
        
        # Scrollbars
        apps_v_scrollbar = ttk.Scrollbar(apps_frame, orient=tk.VERTICAL, command=self.apps_tree.yview)
        apps_h_scrollbar = ttk.Scrollbar(apps_frame, orient=tk.HORIZONTAL, command=self.apps_tree.xview)
        
        self.apps_tree.configure(yscrollcommand=apps_v_scrollbar.set, xscrollcommand=apps_h_scrollbar.set)
        
        # Grid
        self.apps_tree.grid(row=1, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        apps_v_scrollbar.grid(row=1, column=1, sticky=(tk.N, tk.S))
        apps_h_scrollbar.grid(row=2, column=0, sticky=(tk.W, tk.E))
    
    def create_menu(self):
        """Create the menu bar."""
        menubar = tk.Menu(self.root)
        self.root.config(menu=menubar)
        
        # File menu
        file_menu = tk.Menu(menubar, tearoff=0)
        menubar.add_cascade(label="File", menu=file_menu)
        file_menu.add_command(label="New Session", command=self.new_session)
        file_menu.add_command(label="Load Data", command=self.load_data)
        file_menu.add_command(label="Save Data", command=self.save_data)
        file_menu.add_separator()
        file_menu.add_command(label="Export...", command=self.export_data)
        file_menu.add_separator()
        file_menu.add_command(label="Exit", command=self.root.quit)
        
        # View menu
        view_menu = tk.Menu(menubar, tearoff=0)
        menubar.add_cascade(label="View", menu=view_menu)
        view_menu.add_command(label="Refresh", command=self.refresh_data)
        view_menu.add_command(label="Full Screen", command=self.toggle_fullscreen)
        
        # Help menu
        help_menu = tk.Menu(menubar, tearoff=0)
        menubar.add_cascade(label="Help", menu=help_menu)
        help_menu.add_command(label="About", command=self.show_about)
    
    def setup_charts(self):
        """Setup chart styling."""
        plt.style.use('seaborn-v0_8')
        plt.rcParams['figure.facecolor'] = 'white'
        plt.rcParams['axes.facecolor'] = 'white'
    
    def toggle_tracking(self):
        """Toggle tracking on/off."""
        if not self.is_tracking:
            self.start_tracking()
        else:
            self.stop_tracking()
    
    def start_tracking(self):
        """Start tracking in a separate thread."""
        self.is_tracking = True
        self.start_stop_btn.config(text="Stop Tracking", style="Danger.TButton")
        self.status_label.config(text="Status: Tracking active")
        
        # Start tracking thread
        self.tracking_thread = threading.Thread(target=self.tracking_worker, daemon=True)
        self.tracking_thread.start()
        
        messagebox.showinfo("Tracking Started", "Application usage tracking has started!")
    
    def stop_tracking(self):
        """Stop tracking."""
        self.is_tracking = False
        self.start_stop_btn.config(text="Start Tracking", style="Success.TButton")
        self.status_label.config(text="Status: Not tracking")
        
        if self.tracker.is_running:
            self.tracker.stop_tracking()
        
        messagebox.showinfo("Tracking Stopped", "Application usage tracking has stopped!")
    
    def tracking_worker(self):
        """Worker thread for tracking."""
        try:
            self.tracker.start_tracking()
        except Exception as e:
            self.update_queue.put(("error", str(e)))
    
    def update_gui(self):
        """Update GUI elements periodically."""
        # Process queue messages
        try:
            while True:
                message_type, data = self.update_queue.get_nowait()
                if message_type == "error":
                    messagebox.showerror("Tracking Error", data)
        except queue.Empty:
            pass
        
        # Update status if tracking
        if self.is_tracking and self.tracker.current_session:
            session = self.tracker.current_session
            current_time = datetime.now()
            session_duration = int((current_time - session.start_time).total_seconds())
            
            self.current_app_label.config(text=f"Current App: {session.app_name}")
            self.session_time_label.config(text=f"Session Time: {self.format_duration(session_duration)}")
        
        # Update charts and data
        self.update_dashboard_charts()
        self.update_applications_tree()
        self.update_activity_list()
        
        # Schedule next update
        self.root.after(5000, self.update_gui)  # Update every 5 seconds
    
    def update_dashboard_charts(self):
        """Update dashboard charts."""
        try:
            analyzer = self.tracker.get_analyzer()
            
            # Today's usage chart
            today_usage = analyzer.get_daily_usage()
            if today_usage:
                self.today_ax.clear()
                apps = list(today_usage.keys())[:5]  # Top 5 apps
                times = [today_usage[app] for app in apps]
                
                self.today_ax.pie(times, labels=apps, autopct='%1.1f%%', startangle=90)
                self.today_ax.set_title("Today's Top 5 Applications")
            else:
                self.today_ax.clear()
                self.today_ax.text(0.5, 0.5, "No data available", ha='center', va='center')
                self.today_ax.set_title("Today's Usage")
            
            # Category breakdown chart
            category_data = analyzer.get_category_analysis()
            if category_data:
                self.category_ax.clear()
                categories = list(category_data.keys())
                times = [category_data[cat]["total_time"] for cat in categories]
                
                self.category_ax.pie(times, labels=categories, autopct='%1.1f%%', startangle=90)
                self.category_ax.set_title("Usage by Category")
            else:
                self.category_ax.clear()
                self.category_ax.text(0.5, 0.5, "No data available", ha='center', va='center')
                self.category_ax.set_title("Category Breakdown")
            
            # Refresh canvases
            self.today_canvas.draw()
            self.category_canvas.draw()
            
        except Exception as e:
            print(f"Error updating charts: {e}")
    
    def update_applications_tree(self):
        """Update applications tree view."""
        try:
            # Clear existing items
            for item in self.apps_tree.get_children():
                self.apps_tree.delete(item)
            
            # Get data
            analyzer = self.tracker.get_analyzer()
            top_apps = analyzer.get_top_apps(20)
            
            # Update category combobox
            categories = set()
            for app_name, sessions in self.tracker.data.items():
                if sessions:
                    categories.add(sessions[0].category)
            
            self.category_combo['values'] = ["All"] + sorted(categories)
            if not self.category_var.get():
                self.category_var.set("All")
            
            # Populate tree
            for app_name, total_time in top_apps:
                sessions = self.tracker.data.get(app_name, [])
                if sessions:
                    category = sessions[0].category
                    session_count = len(sessions)
                    avg_session = total_time / session_count if session_count > 0 else 0
                    last_used = max(s.end_time for s in sessions if s.end_time)
                    
                    # Apply filters
                    if self.should_show_app(app_name, category):
                        self.apps_tree.insert("", "end", values=(
                            app_name,
                            category.title(),
                            self.format_duration(total_time),
                            session_count,
                            self.format_duration(int(avg_session)),
                            last_used.strftime("%Y-%m-%d %H:%M") if last_used else "Never"
                        ))
        
        except Exception as e:
            print(f"Error updating applications tree: {e}")
    
    def update_activity_list(self):
        """Update recent activity list."""
        try:
            # Clear existing items
            for item in self.activity_tree.get_children():
                self.activity_tree.delete(item)
            
            # Get recent sessions (last 20)
            all_sessions = []
            for sessions in self.tracker.data.values():
                all_sessions.extend(sessions)
            
            # Sort by start time (most recent first)
            all_sessions.sort(key=lambda x: x.start_time, reverse=True)
            
            # Add to tree
            for session in all_sessions[:20]:
                if session.end_time:
                    self.activity_tree.insert("", "end", values=(
                        session.start_time.strftime("%H:%M:%S"),
                        session.app_name,
                        session.category.title(),
                        self.format_duration(session.duration_seconds)
                    ))
        
        except Exception as e:
            print(f"Error updating activity list: {e}")
    
    def should_show_app(self, app_name, category):
        """Check if app should be shown based on filters."""
        # Search filter
        search_term = self.search_var.get().lower()
        if search_term and search_term not in app_name.lower():
            return False
        
        # Category filter
        category_filter = self.category_var.get()
        if category_filter and category_filter != "All" and category_filter.lower() != category.lower():
            return False
        
        return True
    
    def filter_applications(self, event=None):
        """Filter applications based on search and category."""
        self.update_applications_tree()
    
    def update_analytics_chart(self, event=None):
        """Update analytics chart based on selection."""
        chart_type = self.chart_type_var.get()
        
        # Clear existing chart
        for widget in self.analytics_chart_frame.winfo_children():
            widget.destroy()
        
        # Create new chart based on type
        if chart_type == "Daily Usage":
            self.create_daily_usage_chart()
        elif chart_type == "Hourly Pattern":
            self.create_hourly_pattern_chart()
        elif chart_type == "Category Analysis":
            self.create_category_analysis_chart()
        elif chart_type == "Productivity Trend":
            self.create_productivity_trend_chart()
    
    def create_daily_usage_chart(self):
        """Create daily usage chart."""
        fig, ax = plt.subplots(figsize=(10, 6))
        
        # Get last 7 days of data
        analyzer = self.tracker.get_analyzer()
        daily_data = {}
        
        for i in range(7):
            date = datetime.now() - timedelta(days=i)
            usage = analyzer.get_daily_usage(date)
            total_time = sum(usage.values())
            daily_data[date.strftime("%Y-%m-%d")] = total_time
        
        dates = list(daily_data.keys())
        times = [daily_data[date] / 3600 for date in dates]  # Convert to hours
        
        ax.bar(dates, times, color='skyblue')
        ax.set_title("Daily Usage (Last 7 Days)")
        ax.set_ylabel("Hours")
        ax.tick_params(axis='x', rotation=45)
        
        plt.tight_layout()
        
        canvas = FigureCanvasTkAgg(fig, self.analytics_chart_frame)
        canvas.get_tk_widget().pack(fill=tk.BOTH, expand=True)
        canvas.draw()
    
    def create_hourly_pattern_chart(self):
        """Create hourly pattern chart."""
        fig, ax = plt.subplots(figsize=(10, 6))
        
        # Get hourly data
        hourly_data = {str(hour): 0 for hour in range(24)}
        
        for sessions in self.tracker.data.values():
            for session in sessions:
                hour = str(session.start_time.hour)
                hourly_data[hour] += session.duration_seconds
        
        hours = list(range(24))
        times = [hourly_data[str(hour)] / 3600 for hour in hours]  # Convert to hours
        
        ax.bar(hours, times, color='lightcoral')
        ax.set_title("Hourly Usage Pattern")
        ax.set_xlabel("Hour of Day")
        ax.set_ylabel("Hours")
        ax.set_xticks(hours)
        
        plt.tight_layout()
        
        canvas = FigureCanvasTkAgg(fig, self.analytics_chart_frame)
        canvas.get_tk_widget().pack(fill=tk.BOTH, expand=True)
        canvas.draw()
    
    def create_category_analysis_chart(self):
        """Create category analysis chart."""
        fig, ax = plt.subplots(figsize=(10, 6))
        
        analyzer = self.tracker.get_analyzer()
        category_data = analyzer.get_category_analysis()
        
        if category_data:
            categories = list(category_data.keys())
            times = [category_data[cat]["total_time"] / 3600 for cat in categories]  # Convert to hours
            
            ax.bar(categories, times, color='lightgreen')
            ax.set_title("Usage by Category")
            ax.set_ylabel("Hours")
            ax.tick_params(axis='x', rotation=45)
        else:
            ax.text(0.5, 0.5, "No data available", ha='center', va='center')
            ax.set_title("Category Analysis")
        
        plt.tight_layout()
        
        canvas = FigureCanvasTkAgg(fig, self.analytics_chart_frame)
        canvas.get_tk_widget().pack(fill=tk.BOTH, expand=True)
        canvas.draw()
    
    def create_productivity_trend_chart(self):
        """Create productivity trend chart."""
        fig, ax = plt.subplots(figsize=(10, 6))
        
        # Calculate productivity for last 7 days
        productive_categories = ['development', 'office', 'utilities']
        productivity_data = {}
        
        analyzer = self.tracker.get_analyzer()
        
        for i in range(7):
            date = datetime.now() - timedelta(days=i)
            usage = analyzer.get_daily_usage(date)
            
            total_time = sum(usage.values())
            productive_time = 0
            
            for app_name, time_spent in usage.items():
                sessions = self.tracker.data.get(app_name, [])
                if sessions and sessions[0].category in productive_categories:
                    productive_time += time_spent
            
            productivity_pct = (productive_time / total_time * 100) if total_time > 0 else 0
            productivity_data[date.strftime("%Y-%m-%d")] = productivity_pct
        
        dates = list(productivity_data.keys())
        productivity = list(productivity_data.values())
        
        ax.plot(dates, productivity, marker='o', color='purple', linewidth=2)
        ax.set_title("Productivity Trend (Last 7 Days)")
        ax.set_ylabel("Productivity %")
        ax.tick_params(axis='x', rotation=45)
        ax.set_ylim(0, 100)
        
        plt.tight_layout()
        
        canvas = FigureCanvasTkAgg(fig, self.analytics_chart_frame)
        canvas.get_tk_widget().pack(fill=tk.BOTH, expand=True)
        canvas.draw()
    
    def generate_report(self):
        """Generate and display report."""
        try:
            analyzer = self.tracker.get_analyzer()
            report = analyzer.generate_enhanced_report()
            
            self.report_text.delete(1.0, tk.END)
            self.report_text.insert(1.0, report)
            
        except Exception as e:
            messagebox.showerror("Error", f"Failed to generate report: {e}")
    
    def save_report(self):
        """Save report to file."""
        try:
            filename = filedialog.asksaveasfilename(
                defaultextension=".txt",
                filetypes=[("Text files", "*.txt"), ("All files", "*.*")]
            )
            
            if filename:
                with open(filename, 'w') as f:
                    f.write(self.report_text.get(1.0, tk.END))
                
                messagebox.showinfo("Success", f"Report saved to {filename}")
        
        except Exception as e:
            messagebox.showerror("Error", f"Failed to save report: {e}")
    
    def create_backup(self):
        """Create data backup."""
        try:
            self.tracker.create_backup()
            messagebox.showinfo("Success", "Backup created successfully!")
        except Exception as e:
            messagebox.showerror("Error", f"Failed to create backup: {e}")
    
    def export_data(self):
        """Export data to file."""
        try:
            filename = filedialog.asksaveasfilename(
                defaultextension=".json",
                filetypes=[("JSON files", "*.json"), ("All files", "*.*")]
            )
            
            if filename:
                data = self.tracker.export_data()
                with open(filename, 'w') as f:
                    f.write(data)
                
                messagebox.showinfo("Success", f"Data exported to {filename}")
        
        except Exception as e:
            messagebox.showerror("Error", f"Failed to export data: {e}")
    
    def open_settings(self):
        """Open settings dialog."""
        SettingsDialog(self.root, self.tracker.config)
    
    def new_session(self):
        """Start a new tracking session."""
        result = messagebox.askyesno("New Session", "This will clear all current data. Continue?")
        if result:
            self.tracker.data = {}
            self.refresh_data()
    
    def load_data(self):
        """Load data from file."""
        try:
            filename = filedialog.askopenfilename(
                filetypes=[("JSON files", "*.json"), ("All files", "*.*")]
            )
            
            if filename:
                self.tracker.data_manager.log_file = Path(filename)
                self.tracker.data = self.tracker.data_manager.load_data()
                self.refresh_data()
                messagebox.showinfo("Success", "Data loaded successfully!")
        
        except Exception as e:
            messagebox.showerror("Error", f"Failed to load data: {e}")
    
    def save_data(self):
        """Save current data."""
        try:
            self.tracker.data_manager.save_data(self.tracker.data)
            messagebox.showinfo("Success", "Data saved successfully!")
        except Exception as e:
            messagebox.showerror("Error", f"Failed to save data: {e}")
    
    def refresh_data(self):
        """Refresh all data displays."""
        self.update_dashboard_charts()
        self.update_applications_tree()
        self.update_activity_list()
        self.update_analytics_chart()
    
    def toggle_fullscreen(self):
        """Toggle fullscreen mode."""
        self.root.attributes('-fullscreen', not self.root.attributes('-fullscreen'))
    
    def show_about(self):
        """Show about dialog."""
        about_text = """
        Enhanced Application Usage Tracker
        Version 2.0
        
        A comprehensive tool for tracking and analyzing
        application usage patterns with detailed analytics
        and productivity insights.
        
        Features:
        • Real-time application tracking
        • Detailed usage analytics
        • Productivity metrics
        • Category-based analysis
        • Export and backup capabilities
        """
        messagebox.showinfo("About", about_text)
    
    def format_duration(self, seconds):
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

class SettingsDialog:
    """Settings dialog for configuration."""
    
    def __init__(self, parent, config):
        self.config = config
        self.dialog = tk.Toplevel(parent)
        self.dialog.title("Settings")
        self.dialog.geometry("400x300")
        self.dialog.resizable(False, False)
        
        # Center the dialog
        self.dialog.transient(parent)
        self.dialog.grab_set()
        
        self.create_widgets()
    
    def create_widgets(self):
        """Create settings widgets."""
        main_frame = ttk.Frame(self.dialog, padding="20")
        main_frame.pack(fill=tk.BOTH, expand=True)
        
        # Check interval
        ttk.Label(main_frame, text="Check Interval (seconds):").grid(row=0, column=0, sticky=tk.W, pady=5)
        self.check_interval_var = tk.StringVar(value=str(self.config.check_interval))
        ttk.Entry(main_frame, textvariable=self.check_interval_var, width=10).grid(row=0, column=1, sticky=tk.W, pady=5)
        
        # Minimum session duration
        ttk.Label(main_frame, text="Min Session Duration (seconds):").grid(row=1, column=0, sticky=tk.W, pady=5)
        self.min_duration_var = tk.StringVar(value=str(self.config.min_session_duration))
        ttk.Entry(main_frame, textvariable=self.min_duration_var, width=10).grid(row=1, column=1, sticky=tk.W, pady=5)
        
        # Enable productivity tracking
        self.productivity_var = tk.BooleanVar(value=self.config.enable_productivity_tracking)
        ttk.Checkbutton(main_frame, text="Enable Productivity Tracking", variable=self.productivity_var).grid(row=2, column=0, columnspan=2, sticky=tk.W, pady=5)
        
        # Enable detailed tracking
        self.detailed_var = tk.BooleanVar(value=self.config.enable_detailed_tracking)
        ttk.Checkbutton(main_frame, text="Enable Detailed Tracking", variable=self.detailed_var).grid(row=3, column=0, columnspan=2, sticky=tk.W, pady=5)
        
        # Excluded apps
        ttk.Label(main_frame, text="Excluded Applications:").grid(row=4, column=0, sticky=tk.W, pady=5)
        self.excluded_text = tk.Text(main_frame, height=5, width=40)
        self.excluded_text.grid(row=5, column=0, columnspan=2, pady=5)
        self.excluded_text.insert(1.0, '\n'.join(self.config.excluded_apps))
        
        # Buttons
        button_frame = ttk.Frame(main_frame)
        button_frame.grid(row=6, column=0, columnspan=2, pady=20)
        
        ttk.Button(button_frame, text="Save", command=self.save_settings).pack(side=tk.LEFT, padx=5)
        ttk.Button(button_frame, text="Cancel", command=self.dialog.destroy).pack(side=tk.LEFT, padx=5)
    
    def save_settings(self):
        """Save settings."""
        try:
            self.config.check_interval = int(self.check_interval_var.get())
            self.config.min_session_duration = int(self.min_duration_var.get())
            self.config.enable_productivity_tracking = self.productivity_var.get()
            self.config.enable_detailed_tracking = self.detailed_var.get()
            self.config.excluded_apps = [app.strip() for app in self.excluded_text.get(1.0, tk.END).split('\n') if app.strip()]
            
            self.config.save_config()
            messagebox.showinfo("Success", "Settings saved successfully!")
            self.dialog.destroy()
            
        except ValueError:
            messagebox.showerror("Error", "Please enter valid numeric values.")
        except Exception as e:
            messagebox.showerror("Error", f"Failed to save settings: {e}")

def main():
    """Main function to run the GUI."""
    root = tk.Tk()
    
    # Configure ttk styles
    style = ttk.Style()
    style.theme_use('clam')
    
    # Custom button styles
    style.configure('Success.TButton', foreground='white', background='green')
    style.configure('Danger.TButton', foreground='white', background='red')
    
    # Create and run the application
    app = AppUsageTrackerGUI(root)
    root.mainloop()

if __name__ == "__main__":
    main()
