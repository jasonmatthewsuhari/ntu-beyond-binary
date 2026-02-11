"""
Head motion tracking and gesture detection.
"""

import numpy as np
from typing import Dict, Any, List, Tuple, Optional
from collections import deque
from datetime import datetime
import json
from pathlib import Path

class HeadTracker:
    """Tracks head pose and detects gestures."""
    
    def __init__(self, profile_id: str, sensitivity: float = 15.0):
        self.profile_id = profile_id
        self.sensitivity = sensitivity  # Degrees threshold
        self.pose_history = deque(maxlen=30)  # 1 second at 30fps
        self.gesture_counts = {}
        self.last_gesture = None
        self.last_gesture_time = None
        self.gesture_window = 2.0  # seconds
        
        # Load custom mappings
        self.mappings = self._load_mappings()
    
    def _load_mappings(self) -> Dict[str, str]:
        """Load custom gesture-to-action mappings."""
        mappings_file = Path(f"../data/gestures/{self.profile_id}/head_mappings.json")
        
        if mappings_file.exists():
            try:
                with open(mappings_file, 'r') as f:
                    return json.load(f)
            except:
                pass
        
        # Default mappings
        return {
            'nod_up_1': 'Yes',
            'nod_down_1': 'No',
            'tilt_left_1': 'Previous',
            'tilt_right_1': 'Next',
            'nod_up_2': 'Confirm',
            'nod_down_2': 'Cancel',
            'shake_1': 'Clear'
        }
    
    def update_pose(self, pitch: float, yaw: float, roll: float) -> Optional[Dict[str, Any]]:
        """
        Update head pose and detect gestures.
        
        Args:
            pitch: Head pitch angle (up/down)
            yaw: Head yaw angle (left/right)
            roll: Head roll angle (tilt)
            
        Returns:
            Detected gesture if any
        """
        current_time = datetime.now()
        
        # Add to history
        self.pose_history.append({
            'pitch': pitch,
            'yaw': yaw,
            'roll': roll,
            'time': current_time
        })
        
        # Detect gesture
        gesture = self._detect_gesture(pitch, yaw, roll)
        
        if gesture:
            # Check if same gesture repeated
            if self.last_gesture == gesture:
                time_diff = (current_time - self.last_gesture_time).total_seconds()
                
                if time_diff < self.gesture_window:
                    # Increment count
                    count = self.gesture_counts.get(gesture, 0) + 1
                    self.gesture_counts[gesture] = count
                else:
                    # Reset count (too much time passed)
                    self.gesture_counts = {gesture: 1}
            else:
                # New gesture
                self.gesture_counts = {gesture: 1}
            
            self.last_gesture = gesture
            self.last_gesture_time = current_time
            
            # Get count
            count = self.gesture_counts[gesture]
            
            # Build gesture key with count
            gesture_key = f"{gesture}_{count}"
            
            # Get action
            action = self.mappings.get(gesture_key)
            
            if action:
                return {
                    'gesture': gesture,
                    'count': count,
                    'action': action,
                    'confidence': 0.9
                }
        
        return None
    
    def _detect_gesture(self, pitch: float, yaw: float, roll: float) -> Optional[str]:
        """
        Detect basic head gestures.
        
        Args:
            pitch: Pitch angle
            yaw: Yaw angle
            roll: Roll angle
            
        Returns:
            Gesture name or None
        """
        # Nod up
        if pitch < -self.sensitivity:
            return 'nod_up'
        
        # Nod down
        if pitch > self.sensitivity:
            return 'nod_down'
        
        # Tilt left
        if roll < -self.sensitivity:
            return 'tilt_left'
        
        # Tilt right
        if roll > self.sensitivity:
            return 'tilt_right'
        
        # Shake (rapid yaw changes)
        if len(self.pose_history) >= 10:
            recent_yaws = [p['yaw'] for p in list(self.pose_history)[-10:]]
            yaw_changes = np.diff(recent_yaws)
            
            # Detect oscillation
            if np.std(yaw_changes) > 10:
                return 'shake'
        
        return None
    
    def save_mappings(self) -> bool:
        """Save custom mappings."""
        mappings_dir = Path(f"../data/gestures/{self.profile_id}")
        mappings_dir.mkdir(parents=True, exist_ok=True)
        mappings_file = mappings_dir / "head_mappings.json"
        
        try:
            with open(mappings_file, 'w') as f:
                json.dump(self.mappings, f, indent=2)
            return True
        except:
            return False
    
    def set_mapping(self, gesture: str, count: int, action: str):
        """Set a custom gesture mapping."""
        gesture_key = f"{gesture}_{count}"
        self.mappings[gesture_key] = action
    
    def reset_counts(self):
        """Reset gesture counts."""
        self.gesture_counts = {}

def detect_head_gesture(pitch: float, yaw: float, roll: float, 
                       profile_id: str, sensitivity: float = 15.0) -> Optional[Dict[str, Any]]:
    """
    Detect a head gesture from pose angles.
    
    Args:
        pitch: Head pitch angle
        yaw: Head yaw angle
        roll: Head roll angle
        profile_id: User profile ID
        sensitivity: Detection sensitivity
        
    Returns:
        Gesture result if detected
    """
    tracker = HeadTracker(profile_id, sensitivity)
    return tracker.update_pose(pitch, yaw, roll)

if __name__ == "__main__":
    print("Head tracker ready.")
