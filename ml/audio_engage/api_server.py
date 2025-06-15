from flask import Flask, request, jsonify
import tempfile
import os
import base64
import joblib
import numpy as np
from predict_emotion import predict_emotion_from_audio

app = Flask(__name__)

# Set the default model path
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'emotion_detection_model.joblib')

@app.route('/predict_emotion', methods=['POST'])
def predict_emotion():
    """
    Endpoint to predict emotion from audio data
    
    Expected input:
    {
        "audio_data": "base64 encoded audio data",
        "file_format": "wav"  # Optional, defaults to wav
    }
    
    Returns:
    {
        "emotion": "predicted emotion",
        "success": true/false,
        "message": "error message if any"
    }
    """
    try:
        # Get request data
        data = request.json
        
        if not data or 'audio_data' not in data:
            return jsonify({
                'success': False,
                'message': 'No audio data provided',
                'emotion': 'unknown'
            }), 400
        
        # Get audio data
        audio_data = data['audio_data']
        file_format = data.get('file_format', 'wav')
        
        # Decode base64 audio data
        try:
            audio_bytes = base64.b64decode(audio_data)
        except:
            return jsonify({
                'success': False,
                'message': 'Invalid audio data encoding',
                'emotion': 'unknown'
            }), 400
        
        # Save audio data to temporary file
        with tempfile.NamedTemporaryFile(suffix=f'.{file_format}', delete=False) as temp_file:
            temp_path = temp_file.name
            temp_file.write(audio_bytes)
        
        try:
            # Predict emotion
            emotion = predict_emotion_from_audio(temp_path, MODEL_PATH)
            
            return jsonify({
                'success': True,
                'message': 'Emotion predicted successfully',
                'emotion': emotion
            })
        finally:
            # Always clean up the temporary file
            if os.path.exists(temp_path):
                os.remove(temp_path)
                
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error processing request: {str(e)}',
            'emotion': 'unknown'
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Simple health check endpoint"""
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    # Check if model exists
    if not os.path.exists(MODEL_PATH):
        print(f"Warning: Model file not found at {MODEL_PATH}")
        print("You need to train a model first using train_emotion_model.py")
    
    # Run the Flask app
    app.run(host='0.0.0.0', port=5000)
