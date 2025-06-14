import numpy as np
import cv2


def draw_landmarks(frame, landmarks):
    """
    Draw facial landmarks on the frame
    
    Args:
        frame: Input image frame
        landmarks: Facial landmarks as numpy array
    """
    for (x, y) in landmarks:
        cv2.circle(frame, (x, y), 2, (0, 255, 0), -1)


def calculate_engagement_color(score):
    """
    Calculate color based on engagement score
    
    Args:
        score: Engagement score (0.0 to 1.0)
        
    Returns:
        BGR color tuple
    """
    # Red for low engagement, green for high engagement
    if score < 0.3:
        return (0, 0, 255)  # Red
    elif score < 0.7:
        return (0, 165, 255)  # Orange
    else:
        return (0, 255, 0)  # Green