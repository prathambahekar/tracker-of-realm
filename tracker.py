import os
import json
import datetime

class UsageTracker:
    def __init__(self, data_file="usage_log.json"):
        self.data_file = data_file
        self.start_time = datetime.datetime.now()
        self.data = self.load_data()
        self.restore_temp_session()

    def load_data(self):
        if os.path.exists(self.data_file):
            try:
                with open(self.data_file, "r") as f:
                    return json.load(f)
            except json.JSONDecodeError:
                return []
        return []

    def restore_temp_session(self):
        if os.path.exists("last_session_tmp.json"):
            try:
                with open("last_session_tmp.json", "r") as f:
                    partial = json.load(f)
                print("Restored previous session:", partial)
                self.data.append(partial)
                os.remove("last_session_tmp.json")
            except Exception as e:
                print("Failed to restore temp session:", e)

    def log_partial_session(self):
        now = datetime.datetime.now()
        duration = round((now - self.start_time).total_seconds())

        session = {
            "date": self.start_time.strftime("%Y-%m-%d"),
            "start": self.start_time.strftime("%H:%M:%S"),
            "end": now.strftime("%H:%M:%S"),
            "duration_secs": duration
        }

        try:
            with open("last_session_tmp.json", "w") as f:
                json.dump(session, f, indent=4)
        except Exception as e:
            print("Failed to write temp session:", e)

    def log_session(self):
        end_time = datetime.datetime.now()
        duration = round((end_time - self.start_time).total_seconds())

        session = {
            "date": self.start_time.strftime("%Y-%m-%d"),
            "start": self.start_time.strftime("%H:%M:%S"),
            "end": end_time.strftime("%H:%M:%S"),
            "duration_secs": duration
        }

        self.data.append(session)
        with open(self.data_file + ".bak", "w") as backup:
            json.dump(self.data, backup, indent=4)

        with open(self.data_file, "w") as f:
            json.dump(self.data, f, indent=4)

        if os.path.exists("last_session_tmp.json"):
            os.remove("last_session_tmp.json")

        print(f"Logged session: {duration} seconds")
