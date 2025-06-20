import cv2
import numpy as np
from keras.models import load_model
from keras.preprocessing.image import img_to_array
import imutils
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import sys

app = Flask(__name__)
#CORS(app, origins=["http://localhost:5173"], supports_credentials=True)
CORS(app, resources={r"/*": {"origins": "*"}})

# Paths (relative to project root)
HAAR_FACE = os.path.join('haarcascades', 'haarcascade_frontalface_default.xml')
HAAR_EYE = os.path.join('haarcascades', 'haarcascade_eye.xml')
MODEL_PATH = os.path.join('models', 'model_num.hdf5')

# Debug: Check if Haar cascade XML files exist
print("Face cascade path:", HAAR_FACE)
print("Exists?", os.path.exists(HAAR_FACE))
print("Eye cascade path:", HAAR_EYE)
print("Exists?", os.path.exists(HAAR_EYE))

# Load Haarcascades
face_cascade = cv2.CascadeClassifier(HAAR_FACE)
eye_cascade = cv2.CascadeClassifier(HAAR_EYE)

# Load emotion model with error handling
if not os.path.exists(MODEL_PATH):
    print(f"ERROR: Model file '{MODEL_PATH}' not found. Please add your trained model to this path.")
    sys.exit(1)
else:
    emotion_classifier = load_model(MODEL_PATH, compile=False)

EMOTIONS = ["angry", "disgust", "fear", "happy", "sad", "surprised", "neutral"]

def analyze_image(image_data):
    """Analyze a single image and return engagement metrics"""
    # Decode base64 image
    img_bytes = base64.b64decode(image_data.split(',')[1])
    nparr = np.frombuffer(img_bytes, np.uint8)
    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    # Process the image
    frame = imutils.resize(frame, width=400)
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30), flags=cv2.CASCADE_SCALE_IMAGE)
    
    # Default response when no faces detected
    if len(faces) == 0:
        return {
            "attentive": False,
            "emotion": "unknown",
            "engagement_score": 0.0,
            "emotions_data": {emotion: 0.0 for emotion in EMOTIONS}
        }
    
    # Process detected face
    for (x, y, w, h) in faces:
        roi = gray[y:y + h, x:x + w]
        eyes = eye_cascade.detectMultiScale(roi)
        
        # Analyze emotion
        roi_resized = cv2.resize(roi, (48, 48))
        roi_resized = roi_resized.astype("float") / 255.0
        roi_resized = img_to_array(roi_resized)
        roi_resized = np.expand_dims(roi_resized, axis=0)
        preds = emotion_classifier.predict(roi_resized)[0]
        
        dominant_emotion = EMOTIONS[preds.argmax()]
        is_attentive = len(eyes) >= 1
        
        # Calculate engagement score based on attention and emotion
        # Higher score for attentive and positive emotions like happy or neutral
        base_score = 0.5 if is_attentive else 0.2
        emotion_multiplier = {
            "happy": 1.5, 
            "neutral": 1.2, 
            "surprised": 1.1, 
            "sad": 0.8, 
            "fear": 0.7, 
            "angry": 0.6, 
            "disgust": 0.5
        }
        engagement_score = min(1.0, base_score * emotion_multiplier.get(dominant_emotion, 1.0))
        
        # Return data for the first face detected
        return {
            "attentive": is_attentive,
            "emotion": dominant_emotion,
            "engagement_score": float(engagement_score),
            "emotions_data": {emotion: float(prob) for emotion, prob in zip(EMOTIONS, preds)}
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
    app.run(debug=True, port=5000)