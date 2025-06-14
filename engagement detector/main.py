import cv2
import numpy as np
import time
from engagement_analyzer import EngagementAnalyzer
from face_detector import FaceDetector
from utils.helpers import draw_landmarks, calculate_engagement_color


def main():
    print("Starting Engagement Analysis System...")
    
    # Initialize components
    face_detector = FaceDetector()
    engagement_analyzer = EngagementAnalyzer()
    
    # Video capture (0 for webcam, or provide video file path)
    video_source = 0
    cap = cv2.VideoCapture(video_source)
    
    if not cap.isOpened():
        print("Error: Could not open video source")
        return
    
    print("Press 'q' to quit...")
    
    while True:
        # Read frame
        ret, frame = cap.read()
        if not ret:
            break
        
        # Detect faces
        faces = face_detector.detect_faces(frame)
        
        # Process each face
        for face_rect in faces:
            # Get facial landmarks
            landmarks = face_detector.detect_landmarks(frame, face_rect)
            
            # Draw landmarks
            draw_landmarks(frame, landmarks)
            
            # Analyze engagement
            engagement_score = engagement_analyzer.analyze(frame, landmarks)
            
            # Draw face rectangle
            x, y, w, h = face_rect
            color = calculate_engagement_color(engagement_score)
            cv2.rectangle(frame, (x, y), (x+w, y+h), color, 2)
            
            # Display engagement score
            cv2.putText(frame, f"Engagement: {engagement_score:.2f}", 
                       (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)
        
        # Display the frame
        cv2.imshow("Engagement Analysis", frame)
        
        # Break loop on 'q' key
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    
    # Release resources
    cap.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    main()