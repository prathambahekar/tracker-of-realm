import json
import matplotlib.pyplot as plt
from collections import defaultdict

class UsageVisualizer:
    def __init__(self, data_file="usage_log.json"):
        self.data_file = data_file
        self.usage_data = self.load_data()
        self.enable_dark_mode()

    def enable_dark_mode(self):
        plt.style.use('dark_background')
        plt.rcParams.update({
            'axes.facecolor': '#121212',
            'figure.facecolor': '#121212',
            'axes.edgecolor': '#888888',
            'axes.labelcolor': '#FFFFFF',
            'xtick.color': '#AAAAAA',
            'ytick.color': '#AAAAAA',
            'grid.color': '#333333',
            'text.color': '#FFFFFF',
            'axes.titlecolor': '#FFFFFF',
        })

    def load_data(self):
        try:
            with open(self.data_file, "r") as file:
                return json.load(file)
        except (FileNotFoundError, json.JSONDecodeError):
            return []

    def aggregate_by_day(self):
        daily_usage = defaultdict(lambda: {"duration": 0, "sessions": 0})
        for entry in self.usage_data:
            date = entry["date"]
            daily_usage[date]["duration"] += entry["duration_secs"]
            daily_usage[date]["sessions"] += 1
        return dict(sorted(daily_usage.items()))

    def plot_daily_usage(self):
        daily_data = self.aggregate_by_day()
        if not daily_data:
            print("No usage data to plot.")
            return

        dates = list(daily_data.keys())
        durations = [round(info["duration"] / 60, 2) for info in daily_data.values()]
        sessions = [info["sessions"] for info in daily_data.values()]

        fig, ax1 = plt.subplots(figsize=(12, 6))
        ax1.set_xlabel("Date")
        ax1.set_ylabel("Usage Time (minutes)", color='cyan')
        ax1.plot(dates, durations, marker='o', color='cyan')
        ax1.tick_params(axis='y', labelcolor='cyan')

        ax2 = ax1.twinx()
        ax2.set_ylabel("Session Count", color='magenta')
        ax2.plot(dates, sessions, marker='s', linestyle='--', color='magenta')
        ax2.tick_params(axis='y', labelcolor='magenta')

        plt.title("Daily PC Usage and Sessions")
        fig.tight_layout()
        plt.xticks(rotation=45)
        plt.grid(True, linestyle='--', alpha=0.3)
        plt.show()

    def plot_sessions_bar(self):
        if not self.usage_data:
            print("No usage data to plot.")
            return

        session_labels = []
        durations = []

        for session in self.usage_data:
            label = f"{session['date']} {session['start']} - {session['end']}"
            session_labels.append(label)
            durations.append(round(session['duration_secs'] / 60, 2))

        plt.figure(figsize=(14, 6))
        plt.bar(range(len(durations)), durations, color='deepskyblue')
        plt.xticks(range(len(session_labels)), session_labels, rotation=90, fontsize=6)
        plt.ylabel("Duration (minutes)")
        plt.title("Each PC Session Duration")
        plt.tight_layout()
        plt.grid(axis='y', linestyle='--', alpha=0.5)
        plt.show()
