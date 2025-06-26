import json
import os
import time
import tkinter as tk
from tkinter import ttk
import webbrowser
from threading import Thread
import schedule

class PopupClient:
    def __init__(self):
        self.content_path = os.path.join(os.path.dirname(__file__), 'ml', 'data', 'content.json')
        self.shown_recommendations = set()
        self.current_popup = None
        self.check_interval = 5  # seconds - reduced for faster response
        self.last_check_time = 0  # Track when we last checked the file
        
        # Start the scheduler in a background thread
        self.scheduler_thread = Thread(target=self.run_scheduler, daemon=True)
        self.scheduler_thread.start()
        
    def run_scheduler(self):
        schedule.every(self.check_interval).seconds.do(self.check_for_recommendations)
        while True:
            schedule.run_pending()
            time.sleep(1)
    
    def load_content(self):
        try:
            if os.path.exists(self.content_path):
                with open(self.content_path, 'r', encoding='utf-8') as f:
                    content = f.read().strip()
                    if not content:
                        print("Content file is empty")
                        return []
                    return json.loads(content)
            else:
                print(f"Content file does not exist at: {self.content_path}")
                # Create directory if it doesn't exist
                os.makedirs(os.path.dirname(self.content_path), exist_ok=True)
                # Create empty content file
                with open(self.content_path, 'w', encoding='utf-8') as f:
                    f.write('[]')
                return []
        except json.JSONDecodeError as e:
            print(f"Error parsing JSON content: {e}")
            print(f"Content starts with: {open(self.content_path, 'r').read(100)}...")
            return []
        except Exception as e:
            print(f"Error loading content: {e}")
            return []
    
    def check_for_recommendations(self):
        print(f"Checking for recommendations at {time.strftime('%H:%M:%S')}")
        print(f"Checking file: {self.content_path}")
        print(f"File exists: {os.path.exists(self.content_path)}")
        
        # Check if file was modified since last check
        try:
            file_mtime = os.path.getmtime(self.content_path) if os.path.exists(self.content_path) else 0
            if file_mtime <= self.last_check_time:
                print("File not modified since last check")
                return
            self.last_check_time = file_mtime
        except Exception as e:
            print(f"Error checking file modification time: {e}")
        
        content_data = self.load_content()
        print(f"Found {len(content_data)} entries in content.json")
        
        if content_data:
            print("Sample of content structure:")
            for i, item in enumerate(content_data[:2]):  # Show first 2 items
                print(f"Item {i}: {json.dumps(item, indent=2)[:200]}...")
        
        # Check if we have new recommendations
        found_new = False
        if content_data and len(content_data) > 0:
            for recommendation in reversed(content_data):  # Start with most recent
                # Create a unique ID for this recommendation
                # Handle different data structures in content.json
                context = recommendation.get('context', {})
                popup_data = recommendation.get('popup', {})
                
                # Get trigger type - handle different possible structures
                trigger_type = "unknown"
                if isinstance(context.get('trigger'), dict):
                    trigger_type = context.get('trigger', {}).get('type', 'unknown')
                elif isinstance(context.get('trigger'), str):
                    trigger_type = context.get('trigger', 'unknown')
                
                # Create more robust ID
                user_id = context.get('user_id', 'unknown')
                title = popup_data.get('title', 'No Title')
                timestamp = recommendation.get('timestamp', str(time.time()))
                
                rec_id = f"{user_id}_{title}_{trigger_type}_{timestamp}"
                
                if rec_id not in self.shown_recommendations:
                    # New recommendation found
                    print(f"Found new recommendation: {rec_id}")
                    print(f"Trigger type: {trigger_type}")
                    self.shown_recommendations.add(rec_id)
                    self.display_popup(recommendation)
                    found_new = True
                    break
        
        if not found_new:
            print("No new recommendations found")
            # Don't show info popup every time - it's annoying
            # self.show_info_popup("No New Recommendations", 
            #                    "No new recommendations are available at this time.\n\n" +
            #                    "The system will continue checking automatically.")
    
    def show_info_popup(self, title, message):
        # Create a simple info popup
        popup = tk.Toplevel()
        popup.title(title)
        popup.geometry("350x200")
        popup.configure(bg='white')
        
        # Make window appear on top
        popup.attributes('-topmost', True)
        
        # Place window in center of screen
        screen_width = popup.winfo_screenwidth()
        screen_height = popup.winfo_screenheight()
        popup.geometry(f"+{int(screen_width/2 - 175)}+{int(screen_height/2 - 100)}")
        
        # Add message
        message_label = tk.Label(popup, text=message, font=("Segoe UI", 11), 
                              bg='white', wraplength=300, justify='center')
        message_label.pack(pady=30, padx=20, expand=True)
        
        # Add OK button
        ok_btn = tk.Button(popup, text="OK", command=popup.destroy,
                        bg='#3498db', fg='white', font=("Segoe UI", 10),
                        cursor="hand2", bd=0, padx=20, pady=5)
        ok_btn.pack(pady=20)
        
        # Auto-close after 10 seconds
        popup.after(10000, lambda: popup.destroy() if popup.winfo_exists() else None)
    
    def display_popup(self, recommendation):
        # If there's already a popup, close it
        if self.current_popup and self.current_popup.winfo_exists():
            self.current_popup.destroy()
        
        # Create new popup window
        popup = tk.Toplevel()  # Changed from Tk() to Toplevel() to avoid multiple root windows
        popup.title("Study Assistant")
        popup.geometry("400x600")  # Made taller to accommodate trigger info
        popup.configure(bg='white')
        
        # Make window appear on top
        popup.attributes('-topmost', True)
        
        # Place window in bottom right corner
        screen_width = popup.winfo_screenwidth()
        screen_height = popup.winfo_screenheight()
        popup.geometry(f"+{screen_width - 420}+{screen_height - 650}")
        
        # Get recommendation data
        popup_data = recommendation.get('popup', {})
        context = recommendation.get('context', {})
        title = popup_data.get('title', 'Study Assistant')
        message = popup_data.get('message', '')
        fun_fact = popup_data.get('fun_fact', '')
        
        # Get trigger information - handle different structures
        trigger_info = context.get('trigger', {})
        trigger_type = "Unknown"
        trigger_message = ""
        
        if isinstance(trigger_info, dict):
            trigger_type = trigger_info.get('type', 'Unknown')
            trigger_message = trigger_info.get('message', '')
        elif isinstance(trigger_info, str):
            trigger_type = trigger_info
        
        # Primary recommendation - handle different data structures
        primary_rec = popup_data.get('recommendation', {})
        primary_type = primary_rec.get('type', 'RESOURCE')
        primary_title = primary_rec.get('title', 'Recommended Resource')
        primary_desc = primary_rec.get('description', 'Check out this helpful resource!')
        primary_url = primary_rec.get('url', '')
        
        # If primary recommendation is missing key data, try to extract from URL
        if not primary_title and primary_url:
            if 'youtube.com' in primary_url:
                primary_title = "YouTube Video Recommendation"
                primary_type = "VIDEO"
            elif any(domain in primary_url for domain in ['blog.', 'medium.', 'dev.to']):
                primary_title = "Article Recommendation"
                primary_type = "ARTICLE"
            else:
                primary_title = "Web Resource"
                primary_type = "RESOURCE"
        
        # Alternative recommendation
        alt_rec = popup_data.get('alternative', {})
        alt_type = alt_rec.get('type', 'RESOURCE')
        alt_title = alt_rec.get('title', 'Alternative Resource')
        alt_desc = alt_rec.get('description', 'Try this alternative approach!')
        alt_url = alt_rec.get('url', '')
        
        # Handle alternative with same logic
        if not alt_title and alt_url:
            if 'youtube.com' in alt_url:
                alt_title = "Alternative YouTube Video"
                alt_type = "VIDEO"
            elif any(domain in alt_url for domain in ['blog.', 'medium.', 'dev.to']):
                alt_title = "Alternative Article"
                alt_type = "ARTICLE"
            else:
                alt_title = "Alternative Resource"
                alt_type = "RESOURCE"
        
        # Create the UI elements
        # Title
        title_label = tk.Label(popup, text=title, font=("Segoe UI", 16, "bold"), bg='white')
        title_label.pack(pady=(15, 10), padx=20, anchor='w')
        
        # Separator
        ttk.Separator(popup, orient='horizontal').pack(fill='x', padx=20)
        
        # Message
        if message:
            message_label = tk.Label(popup, text=message, font=("Segoe UI", 11), 
                                    bg='white', wraplength=360, justify='left')
            message_label.pack(pady=(10, 5), padx=20, anchor='w')
        
        # Trigger Information (NEW)
        trigger_frame = tk.Frame(popup, bg='#e8f8f5', padx=10, pady=10)
        trigger_frame.pack(pady=10, padx=20, fill='x')
        
        trigger_header = tk.Label(trigger_frame, text="TRIGGER DETAILS", 
                             font=("Segoe UI", 8), bg='#e8f8f5', fg='#16a085')
        trigger_header.pack(anchor='w')
        
        trigger_type_label = tk.Label(trigger_frame, text=f"Type: {trigger_type.upper()}", 
                                font=("Segoe UI", 10, "bold"), bg='#e8f8f5')
        trigger_type_label.pack(anchor='w')
        
        if trigger_message:
            trigger_msg_label = tk.Label(trigger_frame, text=trigger_message, 
                                    font=("Segoe UI", 9), bg='#e8f8f5',
                                    wraplength=340, justify='left')
            trigger_msg_label.pack(anchor='w', pady=(5, 0))
        
        # Fun Fact
        if fun_fact:
            fun_fact_frame = tk.Frame(popup, bg='#f8f9fa', padx=10, pady=10)
            fun_fact_frame.pack(pady=10, padx=20, fill='x')
            
            fun_fact_label = tk.Label(fun_fact_frame, text=f"🔍 {fun_fact}", 
                                    font=("Segoe UI", 10, "italic"), bg='#f8f9fa',
                                    wraplength=340, justify='left', fg='#555')
            fun_fact_label.pack()
        
        # Primary Recommendation
        rec_frame = tk.Frame(popup, bg='#e8f4fd', padx=10, pady=10)
        rec_frame.pack(pady=10, padx=20, fill='x')
        
        rec_type_label = tk.Label(rec_frame, text=primary_type.upper(), 
                                font=("Segoe UI", 8), bg='#e8f4fd', fg='#3498db')
        rec_type_label.pack(anchor='w')
        
        rec_title_label = tk.Label(rec_frame, text=primary_title, 
                                font=("Segoe UI", 12, "bold"), bg='#e8f4fd')
        rec_title_label.pack(anchor='w')
        
        if primary_desc:
            rec_desc_label = tk.Label(rec_frame, text=primary_desc, 
                                    font=("Segoe UI", 10), bg='#e8f4fd',
                                    wraplength=340, justify='left')
            rec_desc_label.pack(anchor='w', pady=(5, 0))
        
        def open_primary_url():
            if primary_url and primary_url != '#':
                webbrowser.open(primary_url)
        
        rec_url_btn = tk.Button(rec_frame, text="Open Resource", 
                            command=open_primary_url, bg='#3498db', fg='white',
                            font=("Segoe UI", 9), cursor="hand2", bd=0, padx=10, pady=5)
        rec_url_btn.pack(anchor='w', pady=(10, 0))
        
        # Alternative Recommendation - only show if we have valid data
        if alt_url and alt_url != '#':
            alt_frame = tk.Frame(popup, bg='#fef9e7', padx=10, pady=10)
            alt_frame.pack(pady=10, padx=20, fill='x')
            
            alt_type_label = tk.Label(alt_frame, text=alt_type.upper(), 
                                    font=("Segoe UI", 8), bg='#fef9e7', fg='#f1c40f')
            alt_type_label.pack(anchor='w')
            
            alt_title_label = tk.Label(alt_frame, text=alt_title, 
                                    font=("Segoe UI", 12, "bold"), bg='#fef9e7')
            alt_title_label.pack(anchor='w')
            
            if alt_desc:
                alt_desc_label = tk.Label(alt_frame, text=alt_desc, 
                                        font=("Segoe UI", 10), bg='#fef9e7',
                                        wraplength=340, justify='left')
                alt_desc_label.pack(anchor='w', pady=(5, 0))
            
            def open_alt_url():
                if alt_url and alt_url != '#':
                    webbrowser.open(alt_url)
            
            alt_url_btn = tk.Button(alt_frame, text="Open Alternative", 
                                command=open_alt_url, bg='#f1c40f', fg='white',
                                font=("Segoe UI", 9), cursor="hand2", bd=0, padx=10, pady=5)
            alt_url_btn.pack(anchor='w', pady=(10, 0))
        
        # Action buttons
        button_frame = tk.Frame(popup, bg='white')
        button_frame.pack(pady=15, padx=20, fill='x')
        
        dismiss_btn = tk.Button(button_frame, text="Dismiss", 
                            command=popup.destroy, bg='#ecf0f1', 
                            font=("Segoe UI", 10), cursor="hand2", bd=0, padx=15, pady=8)
        dismiss_btn.pack(side='right', padx=(10, 0))
        
        apply_btn = tk.Button(button_frame, text="Try Recommendation", 
                            command=open_primary_url, bg='#3498db', fg='white',
                            font=("Segoe UI", 10), cursor="hand2", bd=0, padx=15, pady=8)
        apply_btn.pack(side='right')
        
        # Store reference to current popup
        self.current_popup = popup
        
        # Auto-close after 5 minutes if not interacted with
        popup.after(300000, lambda: popup.destroy() if popup.winfo_exists() else None)
    
    def clear_shown_recommendations(self):
        """Clear the list of shown recommendations so they can be displayed again"""
        self.shown_recommendations.clear()
        print("Cleared shown recommendations history")

if __name__ == "__main__":
    client = PopupClient()
    
    # Create a simple control interface
    root = tk.Tk()
    root.title("Study Assistant Control")
    root.geometry("300x300")  # Increased height for new button
    
    frame = tk.Frame(root, padx=20, pady=20)
    frame.pack(fill='both', expand=True)
    
    label = tk.Label(frame, text="Study Assistant Running", font=("Segoe UI", 14, "bold"))
    label.pack(pady=(0, 20))
    
    check_btn = tk.Button(frame, text="Check for Recommendations Now", 
                      command=client.check_for_recommendations,
                      bg='#2ecc71', fg='white', font=("Segoe UI", 10),
                      cursor="hand2", bd=0, padx=15, pady=8)
    check_btn.pack(fill='x')
    
    status_label = tk.Label(frame, text="Checking automatically every 5 seconds", 
                        font=("Segoe UI", 9), fg='#7f8c8d')
    status_label.pack(pady=(10, 0))
    
    # Add a separator
    ttk.Separator(frame, orient='horizontal').pack(fill='x', pady=15)
    
    # Add a button to show a test popup
    def show_test_popup():
        test_recommendation = {
            "context": {
                "user_id": "test_user",
                "trigger": {
                    "type": "distraction",
                    "message": "You appear to be distracted based on your recent activity."
                }
            },
            "popup": {
                "title": "Need a Focus Boost?",
                "message": "We noticed your attention might be drifting. Here's something to help you refocus.",
                "fun_fact": "Regular breaks can increase productivity by up to 20%!",
                "recommendation": {
                    "type": "article",
                    "title": "Effective Study Techniques",
                    "description": "Learn science-backed methods to improve your study sessions.",
                    "url": "https://www.google.com/search?q=effective+study+techniques"
                },
                "alternative": {
                    "type": "video",
                    "title": "5-Minute Study Break Exercise",
                    "description": "A quick routine to refresh your mind between study sessions.",
                    "url": "https://www.youtube.com/results?search_query=5+minute+study+break+exercise"
                }
            }
        }
        client.display_popup(test_recommendation)
    
    test_btn = tk.Button(frame, text="Show Test Popup", 
                      command=show_test_popup,
                      bg='#9b59b6', fg='white', font=("Segoe UI", 10),
                      cursor="hand2", bd=0, padx=15, pady=8)
    test_btn.pack(fill='x', pady=(0, 10))
    
    # Add button to clear shown recommendations
    clear_btn = tk.Button(frame, text="Clear History & Show All", 
                      command=client.clear_shown_recommendations,
                      bg='#e74c3c', fg='white', font=("Segoe UI", 10),
                      cursor="hand2", bd=0, padx=15, pady=8)
    clear_btn.pack(fill='x', pady=(0, 10))
    
    root.mainloop()
















# import json
# import os
# import time
# import tkinter as tk
# from tkinter import ttk
# import webbrowser
# from threading import Thread
# import schedule

# class PopupClient:
#     def __init__(self):
#         self.content_path = os.path.join(os.path.dirname(__file__), 'ml', 'data', 'content.json')
#         self.shown_recommendations = set()
#         self.current_popup = None
#         self.check_interval = 5  # seconds - reduced for faster response
#         self.last_check_time = 0  # Track when we last checked the file
        
#         # Start the scheduler in a background thread
#         self.scheduler_thread = Thread(target=self.run_scheduler, daemon=True)
#         self.scheduler_thread.start()
        
#     def run_scheduler(self):
#         schedule.every(self.check_interval).seconds.do(self.check_for_recommendations)
#         while True:
#             schedule.run_pending()
#             time.sleep(1)
    
#     def load_content(self):
#         try:
#             if os.path.exists(self.content_path):
#                 with open(self.content_path, 'r', encoding='utf-8') as f:
#                     content = f.read().strip()
#                     if not content:
#                         print("Content file is empty")
#                         return []
#                     return json.loads(content)
#             else:
#                 print(f"Content file does not exist at: {self.content_path}")
#                 # Create directory if it doesn't exist
#                 os.makedirs(os.path.dirname(self.content_path), exist_ok=True)
#                 # Create empty content file
#                 with open(self.content_path, 'w', encoding='utf-8') as f:
#                     f.write('[]')
#                 return []
#         except json.JSONDecodeError as e:
#             print(f"Error parsing JSON content: {e}")
#             print(f"Content starts with: {open(self.content_path, 'r').read(100)}...")
#             return []
#         except Exception as e:
#             print(f"Error loading content: {e}")
#             return []
    
#     def check_for_recommendations(self):
#         print(f"Checking for recommendations at {time.strftime('%H:%M:%S')}")
#         print(f"Checking file: {self.content_path}")
#         print(f"File exists: {os.path.exists(self.content_path)}")
        
#         # Check if file was modified since last check
#         try:
#             file_mtime = os.path.getmtime(self.content_path) if os.path.exists(self.content_path) else 0
#             if file_mtime <= self.last_check_time:
#                 print("File not modified since last check")
#                 return
#             self.last_check_time = file_mtime
#         except Exception as e:
#             print(f"Error checking file modification time: {e}")
        
#         content_data = self.load_content()
#         print(f"Found {len(content_data)} entries in content.json")
        
#         if content_data:
#             print("Sample of content structure:")
#             for i, item in enumerate(content_data[:2]):  # Show first 2 items
#                 print(f"Item {i}: {json.dumps(item, indent=2)[:200]}...")
        
#         # Check if we have new recommendations
#         found_new = False
#         if content_data and len(content_data) > 0:
#             for recommendation in reversed(content_data):  # Start with most recent
#                 # Create a unique ID for this recommendation
#                 # Handle different data structures in content.json
#                 context = recommendation.get('context', {})
#                 popup_data = recommendation.get('popup', {})
                
#                 # Create more robust ID
#                 user_id = context.get('user_id', 'unknown')
#                 title = popup_data.get('title', 'No Title')
#                 trigger = context.get('trigger', 'unknown')
#                 timestamp = recommendation.get('timestamp', str(time.time()))
                
#                 rec_id = f"{user_id}_{title}_{trigger}_{timestamp}"
                
#                 if rec_id not in self.shown_recommendations:
#                     # New recommendation found
#                     print(f"Found new recommendation: {rec_id}")
#                     self.shown_recommendations.add(rec_id)
#                     self.display_popup(recommendation)
#                     found_new = True
#                     break
        
#         if not found_new:
#             print("No new recommendations found")
#             # Don't show info popup every time - it's annoying
#             # self.show_info_popup("No New Recommendations", 
#             #                    "No new recommendations are available at this time.\n\n" +
#             #                    "The system will continue checking automatically.")
    
#     def show_info_popup(self, title, message):
#         # Create a simple info popup
#         popup = tk.Toplevel()
#         popup.title(title)
#         popup.geometry("350x200")
#         popup.configure(bg='white')
        
#         # Make window appear on top
#         popup.attributes('-topmost', True)
        
#         # Place window in center of screen
#         screen_width = popup.winfo_screenwidth()
#         screen_height = popup.winfo_screenheight()
#         popup.geometry(f"+{int(screen_width/2 - 175)}+{int(screen_height/2 - 100)}")
        
#         # Add message
#         message_label = tk.Label(popup, text=message, font=("Segoe UI", 11), 
#                               bg='white', wraplength=300, justify='center')
#         message_label.pack(pady=30, padx=20, expand=True)
        
#         # Add OK button
#         ok_btn = tk.Button(popup, text="OK", command=popup.destroy,
#                         bg='#3498db', fg='white', font=("Segoe UI", 10),
#                         cursor="hand2", bd=0, padx=20, pady=5)
#         ok_btn.pack(pady=20)
        
#         # Auto-close after 10 seconds
#         popup.after(10000, lambda: popup.destroy() if popup.winfo_exists() else None)
    
#     def display_popup(self, recommendation):
#         # If there's already a popup, close it
#         if self.current_popup and self.current_popup.winfo_exists():
#             self.current_popup.destroy()
        
#         # Create new popup window
#         popup = tk.Toplevel()  # Changed from Tk() to Toplevel() to avoid multiple root windows
#         popup.title("Study Assistant")
#         popup.geometry("400x550")
#         popup.configure(bg='white')
        
#         # Make window appear on top
#         popup.attributes('-topmost', True)
        
#         # Place window in bottom right corner
#         screen_width = popup.winfo_screenwidth()
#         screen_height = popup.winfo_screenheight()
#         popup.geometry(f"+{screen_width - 420}+{screen_height - 600}")
        
#         # Get recommendation data
#         popup_data = recommendation.get('popup', {})
#         title = popup_data.get('title', 'Study Assistant')
#         message = popup_data.get('message', '')
#         fun_fact = popup_data.get('fun_fact', '')
        
#         # Primary recommendation - handle different data structures
#         primary_rec = popup_data.get('recommendation', {})
#         primary_type = primary_rec.get('type', 'RESOURCE')
#         primary_title = primary_rec.get('title', 'Recommended Resource')
#         primary_desc = primary_rec.get('description', 'Check out this helpful resource!')
#         primary_url = primary_rec.get('url', '')
        
#         # If primary recommendation is missing key data, try to extract from URL
#         if not primary_title and primary_url:
#             if 'youtube.com' in primary_url:
#                 primary_title = "YouTube Video Recommendation"
#                 primary_type = "VIDEO"
#             elif any(domain in primary_url for domain in ['blog.', 'medium.', 'dev.to']):
#                 primary_title = "Article Recommendation"
#                 primary_type = "ARTICLE"
#             else:
#                 primary_title = "Web Resource"
#                 primary_type = "RESOURCE"
        
#         # Alternative recommendation
#         alt_rec = popup_data.get('alternative', {})
#         alt_type = alt_rec.get('type', 'RESOURCE')
#         alt_title = alt_rec.get('title', 'Alternative Resource')
#         alt_desc = alt_rec.get('description', 'Try this alternative approach!')
#         alt_url = alt_rec.get('url', '')
        
#         # Handle alternative with same logic
#         if not alt_title and alt_url:
#             if 'youtube.com' in alt_url:
#                 alt_title = "Alternative YouTube Video"
#                 alt_type = "VIDEO"
#             elif any(domain in alt_url for domain in ['blog.', 'medium.', 'dev.to']):
#                 alt_title = "Alternative Article"
#                 alt_type = "ARTICLE"
#             else:
#                 alt_title = "Alternative Resource"
#                 alt_type = "RESOURCE"
        
#         # Create the UI elements
#         # Title
#         title_label = tk.Label(popup, text=title, font=("Segoe UI", 16, "bold"), bg='white')
#         title_label.pack(pady=(15, 10), padx=20, anchor='w')
        
#         # Separator
#         ttk.Separator(popup, orient='horizontal').pack(fill='x', padx=20)
        
#         # Message
#         if message:
#             message_label = tk.Label(popup, text=message, font=("Segoe UI", 11), 
#                                     bg='white', wraplength=360, justify='left')
#             message_label.pack(pady=(10, 5), padx=20, anchor='w')
        
#         # Fun Fact
#         if fun_fact:
#             fun_fact_frame = tk.Frame(popup, bg='#f8f9fa', padx=10, pady=10)
#             fun_fact_frame.pack(pady=10, padx=20, fill='x')
            
#             fun_fact_label = tk.Label(fun_fact_frame, text=f"🔍 {fun_fact}", 
#                                     font=("Segoe UI", 10, "italic"), bg='#f8f9fa',
#                                     wraplength=340, justify='left', fg='#555')
#             fun_fact_label.pack()
        
#         # Primary Recommendation
#         rec_frame = tk.Frame(popup, bg='#e8f4fd', padx=10, pady=10)
#         rec_frame.pack(pady=10, padx=20, fill='x')
        
#         rec_type_label = tk.Label(rec_frame, text=primary_type.upper(), 
#                                 font=("Segoe UI", 8), bg='#e8f4fd', fg='#3498db')
#         rec_type_label.pack(anchor='w')
        
#         rec_title_label = tk.Label(rec_frame, text=primary_title, 
#                                 font=("Segoe UI", 12, "bold"), bg='#e8f4fd')
#         rec_title_label.pack(anchor='w')
        
#         if primary_desc:
#             rec_desc_label = tk.Label(rec_frame, text=primary_desc, 
#                                     font=("Segoe UI", 10), bg='#e8f4fd',
#                                     wraplength=340, justify='left')
#             rec_desc_label.pack(anchor='w', pady=(5, 0))
        
#         def open_primary_url():
#             if primary_url and primary_url != '#':
#                 webbrowser.open(primary_url)
        
#         rec_url_btn = tk.Button(rec_frame, text="Open Resource", 
#                             command=open_primary_url, bg='#3498db', fg='white',
#                             font=("Segoe UI", 9), cursor="hand2", bd=0, padx=10, pady=5)
#         rec_url_btn.pack(anchor='w', pady=(10, 0))
        
#         # Alternative Recommendation - only show if we have valid data
#         if alt_url and alt_url != '#':
#             alt_frame = tk.Frame(popup, bg='#fef9e7', padx=10, pady=10)
#             alt_frame.pack(pady=10, padx=20, fill='x')
            
#             alt_type_label = tk.Label(alt_frame, text=alt_type.upper(), 
#                                     font=("Segoe UI", 8), bg='#fef9e7', fg='#f1c40f')
#             alt_type_label.pack(anchor='w')
            
#             alt_title_label = tk.Label(alt_frame, text=alt_title, 
#                                     font=("Segoe UI", 12, "bold"), bg='#fef9e7')
#             alt_title_label.pack(anchor='w')
            
#             if alt_desc:
#                 alt_desc_label = tk.Label(alt_frame, text=alt_desc, 
#                                         font=("Segoe UI", 10), bg='#fef9e7',
#                                         wraplength=340, justify='left')
#                 alt_desc_label.pack(anchor='w', pady=(5, 0))
            
#             def open_alt_url():
#                 if alt_url and alt_url != '#':
#                     webbrowser.open(alt_url)
            
#             alt_url_btn = tk.Button(alt_frame, text="Open Alternative", 
#                                 command=open_alt_url, bg='#f1c40f', fg='white',
#                                 font=("Segoe UI", 9), cursor="hand2", bd=0, padx=10, pady=5)
#             alt_url_btn.pack(anchor='w', pady=(10, 0))
        
#         # Action buttons
#         button_frame = tk.Frame(popup, bg='white')
#         button_frame.pack(pady=15, padx=20, fill='x')
        
#         dismiss_btn = tk.Button(button_frame, text="Dismiss", 
#                             command=popup.destroy, bg='#ecf0f1', 
#                             font=("Segoe UI", 10), cursor="hand2", bd=0, padx=15, pady=8)
#         dismiss_btn.pack(side='right', padx=(10, 0))
        
#         apply_btn = tk.Button(button_frame, text="Try Recommendation", 
#                             command=open_primary_url, bg='#3498db', fg='white',
#                             font=("Segoe UI", 10), cursor="hand2", bd=0, padx=15, pady=8)
#         apply_btn.pack(side='right')
        
#         # Store reference to current popup
#         self.current_popup = popup
        
#         # Auto-close after 5 minutes if not interacted with
#         popup.after(300000, lambda: popup.destroy() if popup.winfo_exists() else None)
    
#     def clear_shown_recommendations(self):
#         """Clear the list of shown recommendations so they can be displayed again"""
#         self.shown_recommendations.clear()
#         print("Cleared shown recommendations history")

# if __name__ == "__main__":
#     client = PopupClient()
    
#     # Create a simple control interface
#     root = tk.Tk()
#     root.title("Study Assistant Control")
#     root.geometry("300x300")  # Increased height for new button
    
#     frame = tk.Frame(root, padx=20, pady=20)
#     frame.pack(fill='both', expand=True)
    
#     label = tk.Label(frame, text="Study Assistant Running", font=("Segoe UI", 14, "bold"))
#     label.pack(pady=(0, 20))
    
#     check_btn = tk.Button(frame, text="Check for Recommendations Now", 
#                       command=client.check_for_recommendations,
#                       bg='#2ecc71', fg='white', font=("Segoe UI", 10),
#                       cursor="hand2", bd=0, padx=15, pady=8)
#     check_btn.pack(fill='x')
    
#     status_label = tk.Label(frame, text="Checking automatically every 5 seconds", 
#                         font=("Segoe UI", 9), fg='#7f8c8d')
#     status_label.pack(pady=(10, 0))
    
#     # Add a separator
#     ttk.Separator(frame, orient='horizontal').pack(fill='x', pady=15)
    
#     # Add a button to show a test popup
#     def show_test_popup():
#         test_recommendation = {
#             "context": {
#                 "user_id": "test_user",
#                 "trigger": {"type": "test"}
#             },
#             "popup": {
#                 "title": "Test Recommendation",
#                 "message": "This is a test recommendation to verify the popup system is working correctly.",
#                 "fun_fact": "Regular breaks can increase productivity by up to 20%!",
#                 "recommendation": {
#                     "type": "article",
#                     "title": "Effective Study Techniques",
#                     "description": "Learn science-backed methods to improve your study sessions.",
#                     "url": "https://www.google.com/search?q=effective+study+techniques"
#                 },
#                 "alternative": {
#                     "type": "video",
#                     "title": "5-Minute Study Break Exercise",
#                     "description": "A quick routine to refresh your mind between study sessions.",
#                     "url": "https://www.youtube.com/results?search_query=5+minute+study+break+exercise"
#                 }
#             }
#         }
#         client.display_popup(test_recommendation)
    
#     test_btn = tk.Button(frame, text="Show Test Popup", 
#                       command=show_test_popup,
#                       bg='#9b59b6', fg='white', font=("Segoe UI", 10),
#                       cursor="hand2", bd=0, padx=15, pady=8)
#     test_btn.pack(fill='x', pady=(0, 10))
    
#     # Add button to clear shown recommendations
#     clear_btn = tk.Button(frame, text="Clear History & Show All", 
#                       command=client.clear_shown_recommendations,
#                       bg='#e74c3c', fg='white', font=("Segoe UI", 10),
#                       cursor="hand2", bd=0, padx=15, pady=8)
#     clear_btn.pack(fill='x', pady=(0, 15))
    
#     # Add a button to clear shown recommendations
#     clear_btn = tk.Button(frame, text="Clear Shown Recommendations", 
#                       command=client.clear_shown_recommendations,
#                       bg='#e74c3c', fg='white', font=("Segoe UI", 10),
#                       cursor="hand2", bd=0, padx=15, pady=8)
#     clear_btn.pack(fill='x', pady=(0, 10))
    
#     root.mainloop()