import time
import sys
import atexit
import win32api

from tracker import UsageTracker
from visualizer import UsageVisualizer

def run_tracker():
    tracker = UsageTracker()
    atexit.register(tracker.log_session)
    win32api.SetConsoleCtrlHandler(lambda sig: (tracker.log_session() or True), True)

    try:
        while True:
            time.sleep(60)
            tracker.log_partial_session()
    except KeyboardInterrupt:
        tracker.log_session()

def run_visualizer():
    vis = UsageVisualizer()
    vis.plot_sessions_bar()
    vis.plot_daily_usage()

if __name__ == "__main__":
    if "--graph" in sys.argv:
        run_visualizer()
    else:
        run_tracker()
