import os
import sys
import time
from datetime import datetime
import base64
from io import BytesIO
from PIL import Image
import cv2
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS

# Add shared directory to sys.path
shared_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../shared'))
sys.path.append(shared_path)

# Import Mac-specific modules
from mac_capture import capture_screen
from mac_window import get_active_app
from idle_tracker import get_idle_time

# Import shared modules
try:
    from ocr import extract_text
    from context import detect_context
    from sentiment import analyze_sentiment
    from chrome_tab import get_chrome_tab_info
except ImportError:
    # Fallback implementations if shared modules aren't available
    def extract_text(image):
        """Extract text from image using OCR"""
        # Simplified implementation
        return "Sample text extraction (OCR module not available)"
    
    def detect_context(text):
        """Detect the context from text"""
        # Simplified implementation
        contexts = ["coding", "reading", "video_lecture", "browsing", "writing", "unknown"]
        # Just return a default value
        return "unknown"
    
    def analyze_sentiment(text):
        """Analyze sentiment of text"""
        # Simplified implementation
        return "neutral"
    
    def get_chrome_tab_info():
        """Get Chrome tab info"""
        # Simplified implementation
        return "Unknown Tab", "Unknown URL"

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Store session data
session_data = {
    "start_time": time.time(),
    "contexts": {},
    "current_context": None,
    "current_context_start": time.time(),
    "screenshots": []
}

@app.route('/api/status', methods=['GET'])
def get_status():
    """Get current system status"""
    try:
        timestamp = datetime.utcnow().isoformat()
        app_name = get_active_app()
        idle_seconds = get_idle_time()
        
        # Chrome-specific info
        title, url = None, None
        if "chrome" in app_name.lower():
            title, url = get_chrome_tab_info()
            
        # Session duration
        session_duration = time.time() - session_data["start_time"]
        
        # Current context duration
        current_context_duration = 0
        if session_data["current_context"]:
            current_context_duration = time.time() - session_data["current_context_start"]
        
        return jsonify({
            "timestamp": timestamp,
            "active_app": app_name,
            "idle_time": idle_seconds,
            "chrome_title": title,
            "chrome_url": url,
            "session_duration": session_duration,
            "current_context": session_data["current_context"],
            "context_duration": current_context_duration
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/analyze-screen', methods=['GET'])
def analyze_screen():
    """Capture and analyze current screen"""
    try:
        # Capture screen - on Mac this returns a cv2/numpy array
        screen = capture_screen()
        
        # Extract text using OCR
        text = extract_text(screen)
        
        # Detect context
        context = detect_context(text)
        
        # Analyze sentiment
        sentiment = analyze_sentiment(text)
        
        # Convert screen to base64 for frontend display
        # Convert from BGR to RGB for display
        img_display = Image.fromarray(cv2.cvtColor(screen, cv2.COLOR_BGR2RGB))
        
        buffered = BytesIO()
        img_display.save(buffered, format="JPEG", quality=30)  # Lower quality for faster transfer
        img_base64 = base64.b64encode(buffered.getvalue()).decode('utf-8')
        
        # Track context changes
        if session_data["current_context"] != context:
            if session_data["current_context"]:
                duration = time.time() - session_data["current_context_start"]
                # Add to context durations
                if session_data["current_context"] in session_data["contexts"]:
                    session_data["contexts"][session_data["current_context"]] += duration
                else:
                    session_data["contexts"][session_data["current_context"]] = duration
            
            # Update current context
            session_data["current_context"] = context
            session_data["current_context_start"] = time.time()
        
        # Get active app
        app_name = get_active_app()
        
        # Get idle time
        idle_seconds = get_idle_time()
        
        # Store screenshot (limited to last 5)
        timestamp = datetime.utcnow().isoformat()
        session_data["screenshots"].append({
            "timestamp": timestamp,
            "context": context,
            "app": app_name
        })
        if len(session_data["screenshots"]) > 5:
            session_data["screenshots"].pop(0)
        
        # Generate insights
        insights = []
        if idle_seconds > 90:
            insights.append("Long period of inactivity detected")
        if sentiment == "negative":
            insights.append("Negative sentiment detected in screen content")
        if "youtube.com/watch" in text.lower():
            insights.append("Video lecture or educational content detected")
        
        return jsonify({
            "timestamp": timestamp,
            "screenshot": f"data:image/jpeg;base64,{img_base64}",
            "text_sample": text[:500] + ("..." if len(text) > 500 else ""),
            "context": context,
            "sentiment": sentiment,
            "active_app": app_name,
            "idle_time": idle_seconds,
            "insights": insights
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/session-stats', methods=['GET'])
def get_session_stats():
    """Get current session statistics"""
    try:
        # Calculate current context duration and add to tracking
        contexts_with_current = dict(session_data["contexts"])
        if session_data["current_context"]:
            current_duration = time.time() - session_data["current_context_start"]
            if session_data["current_context"] in contexts_with_current:
                contexts_with_current[session_data["current_context"]] += current_duration
            else:
                contexts_with_current[session_data["current_context"]] = current_duration
        
        # Create sorted list of contexts by duration
        context_list = [
            {"context": k, "duration": v} 
            for k, v in sorted(contexts_with_current.items(), key=lambda x: x[1], reverse=True)
        ]
        
        return jsonify({
            "session_duration": time.time() - session_data["start_time"],
            "context_durations": context_list,
            "screenshot_history": session_data["screenshots"]
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/reset-session', methods=['POST'])
def reset_session():
    """Reset the session data"""
    try:
        # Reset session data
        session_data["start_time"] = time.time()
        session_data["contexts"] = {}
        session_data["current_context"] = None
        session_data["current_context_start"] = time.time()
        session_data["screenshots"] = []
        
        return jsonify({
            "success": True,
            "message": "Session data reset successfully"
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("Screen Analysis API Server starting...")
    print("Running on macOS")
    app.run(debug=True, port=5001)  # Use port 5001 to avoid conflicts