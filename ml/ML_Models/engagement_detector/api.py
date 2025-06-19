import cv2
import numpy as np
import base64
from flask import Flask, request, jsonify
from flask_cors import CORS
import time
import io
from PIL import Image

# Import local modules
from face_detector import FaceDetector
from engagement_analyzer import EngagementAnalyzer

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize components
face_detector = FaceDetector()
engagement_analyzer = EngagementAnalyzer()

def analyze_image(image_data):
    """Analyze a single image and return engagement metrics"""
    try:
        # Decode base64 image
        img_bytes = base64.b64decode(image_data.split(',')[1])
        
        # Convert to numpy array
        image = Image.open(io.BytesIO(img_bytes))
        frame = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
        
        # Detect faces
        faces = face_detector.detect_faces(frame)
        
        # Default response when no faces detected
        if len(faces) == 0:
            return {
                "attentive": False,
                "engagement_score": 0.0,
                "face_detected": False,
                "message": "No face detected"
            }
        
        # Process the first detected face
        face_rect = faces[0]
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
        
        return {
            "attentive": is_attentive,
            "emotion": emotion,
            "engagement_score": float(engagement_score),
            "face_detected": True
        }
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
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("Starting Engagement Analysis API on port 5000...")
    app.run(debug=True, port=5000)