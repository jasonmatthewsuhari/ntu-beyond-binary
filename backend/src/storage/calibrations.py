"""
Calibration data management for input methods.
"""

import json
from pathlib import Path
from typing import Dict, Any, Optional
from datetime import datetime

class CalibrationManager:
    """Manages calibration data for various input methods."""
    
    def __init__(self, data_dir: str = "backend/data/calibrations"):
        self.data_dir = Path(data_dir)
        self.data_dir.mkdir(parents=True, exist_ok=True)
    
    def get_calibration(self, profile_id: str, input_method: str) -> Optional[Dict[str, Any]]:
        """Get calibration data for a specific input method."""
        filepath = self.data_dir / profile_id / f"{input_method}.json"
        if not filepath.exists():
            return None
        
        try:
            with open(filepath, 'r') as f:
                return json.load(f)
        except Exception as e:
            print(f"Error loading calibration {profile_id}/{input_method}: {e}")
            return None
    
    def save_calibration(self, profile_id: str, input_method: str, data: Dict[str, Any]) -> bool:
        """Save calibration data for a specific input method."""
        profile_dir = self.data_dir / profile_id
        profile_dir.mkdir(parents=True, exist_ok=True)
        
        filepath = profile_dir / f"{input_method}.json"
        temp_filepath = filepath.with_suffix('.tmp')
        
        try:
            # Add metadata
            data['calibrated_at'] = datetime.utcnow().isoformat()
            data['input_method'] = input_method
            
            # Write to temp file first
            with open(temp_filepath, 'w') as f:
                json.dump(data, f, indent=2)
            
            # Atomic rename
            temp_filepath.replace(filepath)
            return True
        except Exception as e:
            print(f"Error saving calibration {profile_id}/{input_method}: {e}")
            if temp_filepath.exists():
                temp_filepath.unlink()
            return False
    
    def delete_calibration(self, profile_id: str, input_method: str) -> bool:
        """Delete calibration data for a specific input method."""
        filepath = self.data_dir / profile_id / f"{input_method}.json"
        try:
            if filepath.exists():
                filepath.unlink()
            return True
        except Exception as e:
            print(f"Error deleting calibration {profile_id}/{input_method}: {e}")
            return False
    
    def list_calibrations(self, profile_id: str) -> list:
        """List all calibrated input methods for a profile."""
        profile_dir = self.data_dir / profile_id
        if not profile_dir.exists():
            return []
        
        try:
            return [f.stem for f in profile_dir.glob("*.json")]
        except Exception as e:
            print(f"Error listing calibrations for {profile_id}: {e}")
            return []
    
    def validate_calibration(self, profile_id: str, input_method: str) -> bool:
        """Check if calibration exists and is valid."""
        calibration = self.get_calibration(profile_id, input_method)
        if not calibration:
            return False
        
        # Check if calibration is recent (within 30 days for eye gaze, head tracking)
        if input_method in ['eye_gaze', 'head', 'facial']:
            try:
                calibrated_at = datetime.fromisoformat(calibration['calibrated_at'])
                age_days = (datetime.utcnow() - calibrated_at).days
                if age_days > 30:
                    return False
            except:
                return False
        
        return True
