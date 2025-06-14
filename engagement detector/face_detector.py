import cv2
import numpy as np


class FaceDetector:
    def __init__(self):
        # Initialize face detector using Haar Cascade
        self.face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 
                                                 'haarcascade_frontalface_default.xml')
        
        # Initialize eye detector
        self.eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 
                                               'haarcascade_eye.xml')
        
    def detect_faces(self, frame):
        """
        Detect faces in the input frame
        
        Args:
            frame: Input image frame
            
        Returns:
            List of face rectangles (x, y, w, h)
        """
        # Convert to grayscale for face detection
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        
        # Detect faces
        faces = self.face_cascade.detectMultiScale(
            gray,
            scaleFactor=1.1,
            minNeighbors=5,
            minSize=(30, 30)
        )
        
        return faces
    
    def detect_landmarks(self, frame, face_rect):
        """
        Detect eyes and estimate key facial points
        
        Args:
            frame: Input image frame
            face_rect: Face rectangle (x, y, w, h)
            
        Returns:
            Simplified facial landmarks as numpy array
        """
        x, y, w, h = face_rect
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        
        # Extract the region of interest (face)
        roi_gray = gray[y:y+h, x:x+w]
        
        # Detect eyes
        eyes = self.eye_cascade.detectMultiScale(roi_gray)
        
        # Create a simplified landmark representation
        landmarks = []
        
        # Face center point
        face_center_x = x + w // 2
        face_center_y = y + h // 2
        landmarks.append((face_center_x, face_center_y))
        
        # Estimate nose position (center of face)
        nose_x = face_center_x
        nose_y = face_center_y
        landmarks.append((nose_x, nose_y))
        
        # Add eye centers if detected
        for (ex, ey, ew, eh) in eyes:
            # Convert to global coordinates
            eye_center_x = x + ex + ew // 2
            eye_center_y = y + ey + eh // 2
            landmarks.append((eye_center_x, eye_center_y))
            
            # Add corners as estimated points
            landmarks.append((x + ex, y + ey))
            landmarks.append((x + ex + ew, y + ey))
            landmarks.append((x + ex, y + ey + eh))
            landmarks.append((x + ex + ew, y + ey + eh))
        
        # Estimate mouth corners (at 2/3 of face height)
        mouth_y = y + int(2 * h / 3)
        mouth_left_x = x + int(w / 3)
        mouth_right_x = x + int(2 * w / 3)
        landmarks.append((mouth_left_x, mouth_y))
        landmarks.append((mouth_right_x, mouth_y))
        
        return np.array(landmarks)