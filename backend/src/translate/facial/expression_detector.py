"""
Facial expression detection and recognition.
"""

import numpy as np
from typing import Dict, Any, Optional
import json
from pathlib import Path

class ExpressionDetector:
    """Detects facial expressions from facial landmarks."""
    
    def __init__(self, profile_id: str):
        self.profile_id = profile_id
        self.mappings = self._load_mappings()
        self.intensity_thresholds = {
            'smile': 0.3,
            'frown': 0.3,
            'eyebrow_raise': 0.4,
            'mouth_open': 0.5,
            'blink': 0.7,
            'wink_left': 0.6,
            'wink_right': 0.6
        }
    
    def _load_mappings(self) -> Dict[str, str]:
        """Load custom expression mappings."""
        mappings_file = Path(f"../data/gestures/{self.profile_id}/facial_mappings.json")
        
        if mappings_file.exists():
            try:
                with open(mappings_file, 'r') as f:
                    return json.load(f)
            except:
                pass
        
        # Default mappings
        return {
            'smile': 'Yes',
            'frown': 'No',
            'eyebrow_raise': 'Help',
            'mouth_open': 'Wow',
            'blink_double': 'Enter',
            'wink_left': 'Yes',
            'wink_right': 'No',
            'pout': 'Undo'
        }
    
    def detect(self, face_landmarks: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Detect expression from facial landmarks.
        
        Args:
            face_landmarks: Dict containing facial landmark positions
                Expected keys: 'mouth_corners', 'lip_distance', 'eyebrow_height',
                              'left_eye_aspect', 'right_eye_aspect', etc.
                              
        Returns:
            Detection result with expression name and action
        """
        expressions = []
        
        # Detect smile
        mouth_corners_y = face_landmarks.get('mouth_corners_y', 0)
        if mouth_corners_y > self.intensity_thresholds['smile']:
            expressions.append(('smile', mouth_corners_y))
        
        # Detect frown
        if mouth_corners_y < -self.intensity_thresholds['frown']:
            expressions.append(('frown', abs(mouth_corners_y)))
        
        # Detect eyebrow raise
        eyebrow_height = face_landmarks.get('eyebrow_height', 0)
        if eyebrow_height > self.intensity_thresholds['eyebrow_raise']:
            expressions.append(('eyebrow_raise', eyebrow_height))
        
        # Detect mouth open
        lip_distance = face_landmarks.get('lip_distance', 0)
        if lip_distance > self.intensity_thresholds['mouth_open']:
            expressions.append(('mouth_open', lip_distance))
        
        # Detect blinks/winks
        left_eye = face_landmarks.get('left_eye_aspect', 1.0)
        right_eye = face_landmarks.get('right_eye_aspect', 1.0)
        
        # Both eyes closed = blink
        if left_eye < self.intensity_thresholds['blink'] and right_eye < self.intensity_thresholds['blink']:
            expressions.append(('blink', 1.0))
        
        # Left eye closed, right open = left wink
        elif left_eye < self.intensity_thresholds['wink_left'] and right_eye > 0.5:
            expressions.append(('wink_left', 1.0))
        
        # Right eye closed, left open = right wink
        elif right_eye < self.intensity_thresholds['wink_right'] and left_eye > 0.5:
            expressions.append(('wink_right', 1.0))
        
        # Return strongest expression
        if expressions:
            expression, intensity = max(expressions, key=lambda x: x[1])
            action = self.mappings.get(expression)
            
            return {
                'expression': expression,
                'intensity': float(intensity),
                'action': action,
                'confidence': min(float(intensity), 1.0)
            }
        
        return None
    
    def set_mapping(self, expression: str, action: str):
        """Set custom expression mapping."""
        self.mappings[expression] = action
    
    def save_mappings(self) -> bool:
        """Save custom mappings."""
        mappings_dir = Path(f"../data/gestures/{self.profile_id}")
        mappings_dir.mkdir(parents=True, exist_ok=True)
        mappings_file = mappings_dir / "facial_mappings.json"
        
        try:
            with open(mappings_file, 'w') as f:
                json.dump(self.mappings, f, indent=2)
            return True
        except:
            return False

def detect_expression(face_landmarks: Dict[str, Any], profile_id: str) -> Optional[Dict[str, Any]]:
    """
    Detect facial expression from landmarks.
    
    Args:
        face_landmarks: Facial landmark data
        profile_id: User profile ID
        
    Returns:
        Detection result
    """
    detector = ExpressionDetector(profile_id)
    return detector.detect(face_landmarks)

if __name__ == "__main__":
    print("Expression detector ready.")
