# import cv2
# import numpy as np
# import base64
# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import time
# import io
# from PIL import Image

# # Import local modules
# from face_detector import FaceDetector
# from engagement_analyzer import EngagementAnalyzer

# app = Flask(__name__)
# CORS(app)  # Enable CORS for all routes

# # Initialize components
# face_detector = FaceDetector()
# engagement_analyzer = EngagementAnalyzer()

# def analyze_image(image_data):
#     """Analyze a single image and return engagement metrics"""
#     try:
#         # Decode base64 image
#         img_bytes = base64.b64decode(image_data.split(',')[1])
        
#         # Convert to numpy array
#         image = Image.open(io.BytesIO(img_bytes))
#         frame = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
        
#         # Detect faces
#         faces = face_detector.detect_faces(frame)
        
#         # Default response when no faces detected
#         if len(faces) == 0:
#             return {
#                 "attentive": False,
#                 "engagement_score": 0.0,
#                 "face_detected": False,
#                 "message": "No face detected"
#             }
        
#         # Process the first detected face
#         face_rect = faces[0]
#         landmarks = face_detector.detect_landmarks(frame, face_rect)
        
#         # Analyze engagement
#         engagement_score = engagement_analyzer.analyze(frame, landmarks)
        
#         # Determine if attentive based on score
#         is_attentive = engagement_score > 0.5
        
#         # Emotion analysis (simplified since we don't have the emotion model)
#         # Could be extended with a real emotion classifier
#         emotion = "neutral"
#         if engagement_score > 0.75:
#             emotion = "interested"
#         elif engagement_score < 0.3:
#             emotion = "distracted"
        
#         return {
#             "attentive": is_attentive,
#             "emotion": emotion,
#             "engagement_score": float(engagement_score),
#             "face_detected": True
#         }
#     except Exception as e:
#         return {
#             "error": str(e),
#             "engagement_score": 0.0,
#             "attentive": False,
#             "face_detected": False
#         }

# @app.route('/api/analyze-engagement', methods=['POST'])
# def analyze_engagement():
#     if not request.json or 'image' not in request.json:
#         return jsonify({'error': 'No image provided'}), 400
    
#     try:
#         image_data = request.json['image']
#         result = analyze_image(image_data)
#         return jsonify(result)
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

# if __name__ == '__main__':
#     print("Starting Engagement Analysis API on port 5000...")
#     app.run(debug=True, port=5000)

from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import cv2
import base64
import json
import datetime
import os

app = Flask(__name__)
CORS(app)

# Directory to save data
DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'data')

# Create data directory if it doesn't exist
os.makedirs(DATA_DIR, exist_ok=True)

def write_to_json_file(data_type, data):
    """Write data to a JSON file in the data directory"""
    try:
        file_path = os.path.join(DATA_DIR, f"{data_type}.json")
        
        # Read existing data if available
        existing_data = []
        if os.path.exists(file_path):
            with open(file_path, 'r') as f:
                try:
                    existing_data = json.load(f)
                except json.JSONDecodeError:
                    existing_data = []
        
        # Ensure existing_data is a list
        if not isinstance(existing_data, list):
            existing_data = []
        
        # Add timestamp to the data
        data['timestamp'] = datetime.datetime.now().isoformat()
        
        # Append new data
        existing_data.append(data)
        
        # Write updated data back to the file
        with open(file_path, 'w') as f:
            json.dump(existing_data, f, indent=2)
            
        return True
    except Exception as e:
        print(f"Error writing to JSON file: {e}")
        return False

# Load face detector and landmark detector here
class FaceDetector:
    def __init__(self):
        # Use OpenCV's face detector for simplicity
        self.face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    
    def detect(self, image):
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        faces = self.face_cascade.detectMultiScale(gray, 1.1, 4)
        if len(faces) == 0:
            return None
        # Return the largest face detected
        return sorted(faces, key=lambda x: x[2] * x[3], reverse=True)[0]
    
    def detect_landmarks(self, image, face_rect):
        # Simplified landmark detection (actual implementation would use dlib or MediaPipe)
        x, y, w, h = face_rect
        # Just return some basic points for eye and mouth regions
        landmarks = {
            'left_eye': (x + int(w*0.3), y + int(h*0.3)),
            'right_eye': (x + int(w*0.7), y + int(h*0.3)),
            'mouth': (x + int(w*0.5), y + int(h*0.7))
        }
        return landmarks

class EngagementAnalyzer:
    def __init__(self):
        pass
    
    def analyze(self, image, landmarks):
        # Simplified engagement analysis
        # Real implementation would analyze eye gaze, head pose, facial expressions
        return np.random.uniform(0.3, 0.9)  # Random score between 0.3 and 0.9

face_detector = FaceDetector()
engagement_analyzer = EngagementAnalyzer()

def analyze_image(image_data):
    try:
        # Decode image from base64
        image_bytes = base64.b64decode(image_data.split(',')[1] if ',' in image_data else image_data)
        nparr = np.frombuffer(image_bytes, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        # Detect face
        face_rect = face_detector.detect(frame)
        if face_rect is None:
            return {
                "attentive": False,
                "emotion": "unknown",
                "engagement_score": 0.0,
                "face_detected": False
            }
        
        # Get facial landmarks
        landmarks = face_detector.detect_landmarks(frame, face_rect)
        # Analyze engagement
        engagement_score = engagement_analyzer.analyze(frame, landmarks)
        # Determine if attentive based on score
        is_attentive = engagement_score > 0.5
        # Emotion analysis (simplified since we don't have the emotion model)
        # Could be extended with a real emotion classifier
        emotion = "neutral"
        if engagement_score > 0.75:
            emotion = "interested"
        elif engagement_score < 0.3:
            emotion = "distracted"
        
        result = {
            "attentive": is_attentive,
            "emotion": emotion,
            "engagement_score": float(engagement_score),
            "face_detected": True
        }
        
        return result
    except Exception as e:
        return {
            "error": str(e),
            "engagement_score": 0.0,
            "attentive": False,
            "face_detected": False
        }

@app.route('/api/analyze-engagement', methods=['POST'])
def analyze_engagement():
    if not request.json or 'image' not in request.json:
        return jsonify({'error': 'No image provided'}), 400
    
    try:
        image_data = request.json['image']
        result = analyze_image(image_data)
        
        # Save to JSON file
        user_data = {
            'userId': request.json.get('userId', 'unknown'),
            'attentive': result['attentive'],
            'emotion': result['emotion'],
            'engagement_score': result['engagement_score'],
            'face_detected': result['face_detected']
        }
        write_to_json_file('video', user_data)
        
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500