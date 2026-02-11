"""
Eye gaze calibration system.
"""

import numpy as np
from typing import List, Tuple, Dict, Any, Optional
import json
from pathlib import Path
from datetime import datetime

class EyeGazeCalibration:
    """Handles eye gaze calibration for screen mapping."""
    
    def __init__(self, profile_id: str):
        self.profile_id = profile_id
        self.calibration_points: List[Tuple[float, float]] = []
        self.gaze_points: List[Tuple[float, float]] = []
        self.transformation_matrix: Optional[np.ndarray] = None
        
    def add_calibration_point(self, screen_pos: Tuple[float, float], 
                             gaze_pos: Tuple[float, float]):
        """
        Add a calibration point.
        
        Args:
            screen_pos: (x, y) position on screen
            gaze_pos: (x, y) detected gaze position
        """
        self.calibration_points.append(screen_pos)
        self.gaze_points.append(gaze_pos)
    
    def calibrate(self) -> bool:
        """
        Compute calibration transformation matrix.
        
        Returns:
            Success status
        """
        if len(self.calibration_points) < 9:
            return False
        
        try:
            # Use homography transformation for calibration
            src_points = np.array(self.gaze_points, dtype=np.float32)
            dst_points = np.array(self.calibration_points, dtype=np.float32)
            
            # Compute affine transformation
            # For simplicity, using polynomial regression
            # In production, use cv2.findHomography
            
            # Simple affine transform: [x', y'] = M * [x, y, 1]
            A = np.column_stack([src_points, np.ones(len(src_points))])
            
            # Solve for x coordinates
            x_coeffs, _, _, _ = np.linalg.lstsq(A, dst_points[:, 0], rcond=None)
            
            # Solve for y coordinates
            y_coeffs, _, _, _ = np.linalg.lstsq(A, dst_points[:, 1], rcond=None)
            
            # Build transformation matrix
            self.transformation_matrix = np.array([
                [x_coeffs[0], x_coeffs[1], x_coeffs[2]],
                [y_coeffs[0], y_coeffs[1], y_coeffs[2]],
                [0, 0, 1]
            ])
            
            return True
        except Exception as e:
            print(f"Calibration error: {e}")
            return False
    
    def transform_gaze(self, gaze_pos: Tuple[float, float]) -> Tuple[float, float]:
        """
        Transform gaze position to screen coordinates.
        
        Args:
            gaze_pos: (x, y) raw gaze position
            
        Returns:
            Calibrated (x, y) screen position
        """
        if self.transformation_matrix is None:
            return gaze_pos
        
        # Apply transformation
        gaze_vec = np.array([gaze_pos[0], gaze_pos[1], 1])
        screen_vec = self.transformation_matrix @ gaze_vec
        
        return (float(screen_vec[0]), float(screen_vec[1]))
    
    def save(self) -> bool:
        """Save calibration data."""
        calib_dir = Path(f"../data/calibrations/{self.profile_id}")
        calib_dir.mkdir(parents=True, exist_ok=True)
        calib_file = calib_dir / "eye_gaze.json"
        
        try:
            data = {
                'calibration_points': self.calibration_points,
                'gaze_points': self.gaze_points,
                'transformation_matrix': self.transformation_matrix.tolist() if self.transformation_matrix is not None else None,
                'calibrated_at': datetime.utcnow().isoformat()
            }
            
            with open(calib_file, 'w') as f:
                json.dump(data, f, indent=2)
            
            return True
        except Exception as e:
            print(f"Error saving calibration: {e}")
            return False
    
    def load(self) -> bool:
        """Load calibration data."""
        calib_file = Path(f"../data/calibrations/{self.profile_id}/eye_gaze.json")
        
        if not calib_file.exists():
            return False
        
        try:
            with open(calib_file, 'r') as f:
                data = json.load(f)
            
            self.calibration_points = [tuple(p) for p in data['calibration_points']]
            self.gaze_points = [tuple(p) for p in data['gaze_points']]
            
            if data['transformation_matrix']:
                self.transformation_matrix = np.array(data['transformation_matrix'])
            
            return True
        except Exception as e:
            print(f"Error loading calibration: {e}")
            return False

if __name__ == "__main__":
    print("Eye gaze calibration module ready.")
