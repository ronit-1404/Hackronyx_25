# Engagement Analysis System

This project implements a real-time engagement analysis system using computer vision. The system detects faces, analyzes facial features, and estimates engagement levels based on eye movements and head pose.

## Features

- Face detection using OpenCV
- Facial landmark detection using dlib
- Eye aspect ratio calculation for blink detection
- Head pose estimation
- Real-time engagement analysis

## Setup

1. Install dependencies:
```
pip install -r requirements.txt
```

2. Download the required model:
```
# Download the shape_predictor_68_face_landmarks.dat file from dlib
# Place it in the models/ directory
```

3. Run the application:
```
python main.py
```

## Usage

- The application will open your webcam by default
- Press 'q' to quit the application
- The engagement score is displayed above each detected face

## Requirements

- Python 3.6+
- OpenCV
- dlib
- NumPy