import json
import os
import time
import tkinter as tk
from tkinter import ttk
import webbrowser
from threading import Thread

class PopupClient:
    def __init__(self):
        self.content_path = os.path.join(os.path.dirname(__file__), 'ml', 'data', 'content.json')
        self.check_interval = 5  # seconds
        self.last_mtime = 0
        self.content_data = []
        self.current_index = 0
        self.current_popup = None

    def start(self):
        Thread(target=self.run_schedule, daemon=True).start()
        self.run_tk()

    def run_schedule(self):
        while True:
            self.check_for_recommendations()
            time.sleep(self.check_interval)

    def check_for_recommendations(self):
        if not os.path.exists(self.content_path):
            print(f"File not found: {self.content_path}")
            return

        mtime = os.path.getmtime(self.content_path)
        if mtime == self.last_mtime:
            # File not modified since last check
            return

        self.last_mtime = mtime

        try:
            with open(self.content_path, 'r') as f:
                self.content_data = json.load(f)
        except Exception as e:
            print(f"Error reading content.json: {e}")
            return

        if not isinstance(self.content_data, list):
            print("content.json is not a list.")
            return

        self.current_index = 0
        if self.content_data:
            self.display_popup(self.content_data[self.current_index])

    def display_popup(self, recommendation):
        # Close previous popup if open
        if self.current_popup and self.current_popup.winfo_exists():
            self.current_popup.destroy()

        popup = tk.Toplevel()
        popup.title("Study Assistant")
        popup.geometry("400x650")
        popup.configure(bg='white')
        popup.attributes('-topmost', True)
        screen_width = popup.winfo_screenwidth()
        screen_height = popup.winfo_screenheight()
        popup.geometry(f"+{screen_width - 420}+{screen_height - 650}")

        # --- Support both 'popup' and 'recommendation' structures ---
        popup_data = recommendation.get('popup')
        context = recommendation.get('context', {})

        if popup_data:
            # Old/test structure
            title = popup_data.get('title', 'Study Assistant')
            message = popup_data.get('message', '')
            fun_fact = popup_data.get('fun_fact', '')
            primary_rec = popup_data.get('recommendation', {})
            alt_rec = popup_data.get('alternative', {})
        else:
            # New LLM structure
            rec = recommendation.get('recommendation', {})
            title = rec.get('title', 'Study Assistant')
            message = rec.get('description', '')
            fun_fact = ""
            primary_rec = rec
            alt_rec = {}

        # Get trigger information
        trigger_info = context.get('trigger', {})
        trigger_type = "Unknown"
        trigger_message = ""
        if isinstance(trigger_info, dict):
            trigger_type = trigger_info.get('type', 'Unknown')
            trigger_message = trigger_info.get('message', '')
        elif isinstance(trigger_info, str):
            trigger_type = trigger_info

        # Primary recommendation fields
        primary_type = primary_rec.get('type', 'RESOURCE')
        primary_title = primary_rec.get('title', 'Recommended Resource')
        primary_desc = primary_rec.get('description', 'Check out this helpful resource!')
        primary_url = primary_rec.get('url', '')

        # --- Build the popup UI ---
        frame = ttk.Frame(popup, padding=20)
        frame.pack(fill=tk.BOTH, expand=True)

        # Live message at the top
        ttk.Label(frame, text="We analysed your emotions, try this to enhance productivity", 
                  font=("Helvetica", 11, "italic"), foreground="#0077cc").pack(pady=(0, 12))

        ttk.Label(frame, text=title, font=("Helvetica", 16, "bold")).pack(pady=(0, 10))
        if message:
            ttk.Label(frame, text=message, wraplength=360, font=("Helvetica", 12)).pack(pady=(0, 10))

        if fun_fact:
            ttk.Label(frame, text="Fun Fact:", font=("Helvetica", 12, "bold")).pack(anchor="w", pady=(10, 0))
            ttk.Label(frame, text=fun_fact, wraplength=360, font=("Helvetica", 11, "italic")).pack(anchor="w", pady=(0, 10))

        # Show the main recommendation
        ttk.Label(frame, text="Recommendation:", font=("Helvetica", 13, "bold")).pack(anchor="w", pady=(10, 0))
        ttk.Label(frame, text=primary_title, font=("Helvetica", 12, "bold")).pack(anchor="w")
        ttk.Label(frame, text=primary_desc, wraplength=360, font=("Helvetica", 11)).pack(anchor="w")
        if primary_url:
            def open_url(url=primary_url):
                webbrowser.open(url)
            ttk.Button(frame, text="Open Resource", command=open_url).pack(anchor="w", pady=(5, 0))

        # Show trigger info if available
        if trigger_type and trigger_type != "Unknown":
            ttk.Label(frame, text=f"Trigger: {trigger_type}", font=("Helvetica", 10, "italic")).pack(anchor="w", pady=(10, 0))
        if trigger_message:
            ttk.Label(frame, text=trigger_message, font=("Helvetica", 10, "italic")).pack(anchor="w")

        # --- Static exercise/rest section ---
        ttk.Separator(frame, orient='horizontal').pack(fill='x', pady=15)
        ttk.Label(frame, text="Or, take a 5-minute break!", font=("Helvetica", 12, "bold"), foreground="#228B22").pack(pady=(0, 5))
        ttk.Label(frame, text="Stand up, stretch, or try this quick exercise:", font=("Helvetica", 11)).pack()
        ttk.Label(frame, text="• Stand and reach for the sky\n• Roll your shoulders\n• Walk around your room", font=("Helvetica", 10, "italic")).pack(pady=(0, 10))

        # --- Buttons ---
        btn_frame = ttk.Frame(frame)
        btn_frame.pack(pady=(20, 0))

        def on_refresh():
            if not self.content_data:
                return
            self.current_index = (self.current_index + 1) % len(self.content_data)
            self.display_popup(self.content_data[self.current_index])

        ttk.Button(btn_frame, text="Refresh (Next Recommendation)", command=on_refresh).pack(side=tk.LEFT, padx=5)
        ttk.Button(btn_frame, text="Close", command=popup.destroy).pack(side=tk.LEFT, padx=5)

        self.current_popup = popup

    def run_tk(self):
        root = tk.Tk()
        root.withdraw()  # Hide the root window
        root.mainloop()

if __name__ == "__main__":
    client = PopupClient()
    client.start()