import cv2
import numpy as np
import time


class EngagementAnalyzer:
    def __init__(self):
        # Parameters
        self.attention_history = []
        self.max_history = 30  # frames to keep for smoothing
        self.last_blink_time = time.time()
        self.blink_interval = 0.0  # time between blinks
        
    def analyze(self, frame, landmarks):
        """
        Analyze engagement based on simplified facial landmarks
        
        Args:
            frame: Input image frame
            landmarks: Facial landmarks as numpy array
            
        Returns:
            Engagement score (0.0 to 1.0)
        """
        if landmarks is None or len(landmarks) < 3:
            return 0.0
        
        # Calculate engagement based on eye detection
        eyes_detected = len(landmarks) > 5
        
        # Check if the person is facing forward by comparing eye positions
        facing_forward = True
        if len(landmarks) >= 7:  # We have at least two eyes
            # Simple check if eyes are roughly at the same height
            eye1 = landmarks[2]  # First eye center
            eye2 = landmarks[6]  # Second eye center (if detected)
            
            # If eyes have very different y positions, person may not be facing forward
            if abs(eye1[1] - eye2[1]) > 20:
                facing_forward = False
        
        # Calculate position stability (less movement indicates more engagement)
        stable_position = 1.0
        if len(self.attention_history) > 0:
            # Only do this check if we have previous data
            if len(landmarks) > 0 and 'last_landmarks' in dir(self):
                if len(self.last_landmarks) > 0:
                    # Calculate average movement of landmarks
                    movement = 0
                    points_to_compare = min(len(landmarks), len(self.last_landmarks))
                    for i in range(points_to_compare):
                        if i < len(landmarks) and i < len(self.last_landmarks):
                            movement += np.linalg.norm(landmarks[i] - self.last_landmarks[i])
                    
                    avg_movement = movement / points_to_compare if points_to_compare > 0 else 0
                    
                    # Normalize: less movement = higher stability score
                    stable_position = max(0, 1.0 - avg_movement / 50.0)
        
        # Store current landmarks for next frame comparison
        self.last_landmarks = landmarks
        
        # Calculate raw engagement score
        engagement_score = 0.4 * float(eyes_detected) + 0.3 * float(facing_forward) + 0.3 * stable_position
        
        # Add to history for smoothing
        self.attention_history.append(engagement_score)
        if len(self.attention_history) > self.max_history:
            self.attention_history.pop(0)
        
        # Return smoothed engagement score
        return sum(self.attention_history) / len(self.attention_history)