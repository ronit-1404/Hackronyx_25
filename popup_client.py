import json
import os
import time
import tkinter as tk
from tkinter import ttk
import webbrowser
from threading import Thread

class PopupClient:
    def __init__(self):
        # Always use the correct path relative to project root
        self.content_path = os.path.abspath(os.path.join(os.path.dirname(__file__), 'ml', 'data', 'content.json'))
        self.check_interval = 5  # seconds
        self.last_mtime = 0
        self.current_popups = []
        self.current_index = 0
        self.content_data = []

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
        # Close previous popups if open
        for popup in self.current_popups:
            if popup and popup.winfo_exists():
                popup.destroy()
        self.current_popups = []

        popup = tk.Toplevel()
        popup.title("Study Assistant")
        popup.geometry("400x650")
        popup.configure(bg='#f0f6ff')  # Light blue background
        popup.attributes('-topmost', True)
        screen_width = popup.winfo_screenwidth()
        screen_height = popup.winfo_screenheight()
        popup.geometry(f"+{screen_width - 420}+{screen_height - 650}")

        # --- Add custom styles ---
        style = ttk.Style(popup)
        style.theme_use('clam')
        style.configure('Blue.TFrame', background='#e3f2fd')
        style.configure('Title.TFrame', background='#1976d2')
        style.configure('Header.TLabel', background='#1976d2', foreground='white', font=("Helvetica", 20, "bold"), padding=10)
        style.configure('SubHeader.TLabel', background='#e3f2fd', foreground='#1976d2', font=("Helvetica", 12, "bold"))
        style.configure('Message.TLabel', background='#e3f2fd', foreground='#263238', font=("Helvetica", 12))
        style.configure('FunFact.TLabel', background='#fffde7', foreground='#fbc02d', font=("Helvetica", 11, "italic"))
        style.configure('RecTitle.TLabel', background='#e8f5e9', foreground='#388e3c', font=("Helvetica", 12, "bold"))
        style.configure('RecDesc.TLabel', background='#e8f5e9', foreground='#2e7d32', font=("Helvetica", 11))
        style.configure('Trigger.TLabel', background='#fce4ec', foreground='#ad1457', font=("Helvetica", 10, "italic"))
        style.configure('Break.TLabel', background='#e1f5fe', foreground='#0288d1', font=("Helvetica", 12, "bold"))
        style.configure('BreakDesc.TLabel', background='#e1f5fe', foreground='#0277bd', font=("Helvetica", 11))
        style.configure('BreakList.TLabel', background='#e1f5fe', foreground='#01579b', font=("Helvetica", 10, "italic"))
        style.configure('Accent.TButton', background='#1976d2', foreground='white', font=("Helvetica", 11, "bold"), borderwidth=0, focusthickness=3, focuscolor='none')
        style.map('Accent.TButton', background=[('active', '#1565c0')])
        style.configure('Close.TButton', background='#e53935', foreground='white', font=("Helvetica", 11, "bold"), borderwidth=0)
        style.map('Close.TButton', background=[('active', '#b71c1c')])

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

        # --- Build the popup UI (colorful and full coverage) ---
        frame = ttk.Frame(popup, style='Blue.TFrame', padding=20)
        frame.pack(fill=tk.BOTH, expand=True)

        # Title bar (broad, colored)
        title_frame = ttk.Frame(frame, style='Title.TFrame')
        title_frame.pack(fill=tk.X, pady=(0, 12))
        ttk.Label(title_frame, text=title, style='Header.TLabel', anchor='center').pack(fill=tk.X)

        # Live message at the top
        ttk.Label(frame, text="We analysed your emotions, try this to enhance productivity", 
                  font=("Helvetica", 11, "italic"), foreground="#0077cc", background='#e3f2fd').pack(pady=(0, 12), fill=tk.X)

        if message:
            ttk.Label(frame, text=message, style='Message.TLabel', wraplength=360).pack(pady=(0, 10), fill=tk.X)
        if fun_fact:
            ttk.Label(frame, text="Fun Fact:", style='SubHeader.TLabel').pack(anchor="w", pady=(10, 0), fill=tk.X)
            ttk.Label(frame, text=fun_fact, style='FunFact.TLabel', wraplength=360).pack(anchor="w", pady=(0, 10), fill=tk.X)
        # Show the main recommendation
        rec_frame = ttk.Frame(frame, style='Blue.TFrame', padding=10)
        rec_frame.pack(fill=tk.X, pady=(10, 0))
        ttk.Label(rec_frame, text="Recommendation:", style='SubHeader.TLabel').pack(anchor="w", pady=(0, 2), fill=tk.X)
        ttk.Label(rec_frame, text=primary_title, style='RecTitle.TLabel').pack(anchor="w", fill=tk.X)
        ttk.Label(rec_frame, text=primary_desc, style='RecDesc.TLabel', wraplength=340).pack(anchor="w", fill=tk.X)
        if primary_url:
            def open_url(url=primary_url):
                webbrowser.open(url)
            ttk.Button(rec_frame, text="Open Resource", style='Accent.TButton', command=open_url).pack(anchor="w", pady=(5, 0))
        # Show trigger info if available
        if trigger_type and trigger_type != "Unknown":
            ttk.Label(frame, text=f"Trigger: {trigger_type}", style='Trigger.TLabel').pack(anchor="w", pady=(10, 0), fill=tk.X)
        if trigger_message:
            ttk.Label(frame, text=trigger_message, style='Trigger.TLabel').pack(anchor="w", fill=tk.X)
        # --- Static exercise/rest section ---
        ttk.Separator(frame, orient='horizontal').pack(fill='x', pady=15)
        break_frame = ttk.Frame(frame, style='Blue.TFrame', padding=10)
        break_frame.pack(fill=tk.X)
        ttk.Label(break_frame, text="Or, take a 5-minute break!", style='Break.TLabel').pack(pady=(0, 5), fill=tk.X)
        ttk.Label(break_frame, text="Stand up, stretch, or try this quick exercise:", style='BreakDesc.TLabel').pack(fill=tk.X)
        ttk.Label(break_frame, text="• Stand and reach for the sky\n• Roll your shoulders\n• Walk around your room", style='BreakList.TLabel').pack(pady=(0, 10), fill=tk.X)
        # --- Buttons ---
        btn_frame = ttk.Frame(frame, style='Blue.TFrame')
        btn_frame.pack(pady=(20, 0), fill=tk.X)
        def on_refresh():
            if not self.content_data:
                return
            self.current_index = (self.current_index + 1) % len(self.content_data)
            self.display_popup(self.content_data[self.current_index])
        ttk.Button(btn_frame, text="Refresh :)", style='Accent.TButton', command=on_refresh).pack(side=tk.LEFT, padx=5, ipadx=10, ipady=2)
        ttk.Button(btn_frame, text="Close", style='Close.TButton', command=popup.destroy).pack(side=tk.LEFT, padx=5, ipadx=10, ipady=2)
        self.current_popups.append(popup)

    def run_tk(self):
        root = tk.Tk()
        root.withdraw()  # Hide the root window
        root.mainloop()

if __name__ == "__main__":
    client = PopupClient()
    client.start()