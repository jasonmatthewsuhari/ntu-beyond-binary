"""
Eye gaze tracker for screen region mapping.
"""

from typing import Tuple, Dict, Any, Optional
from .calibration import EyeGazeCalibration

class GazeTracker:
    """Tracks gaze position and maps to screen regions."""
    
    def __init__(self, profile_id: str, screen_width: int = 1920, screen_height: int = 1080):
        self.profile_id = profile_id
        self.screen_width = screen_width
        self.screen_height = screen_height
        self.calibration = EyeGazeCalibration(profile_id)
        self.calibration.load()
        
        # Define screen regions (customizable)
        self.regions = self._create_default_regions()
    
    def _create_default_regions(self) -> Dict[str, Dict[str, Any]]:
        """Create default screen region mappings."""
        # 3x3 grid
        regions = {}
        region_names = [
            ['top-left', 'top-center', 'top-right'],
            ['center-left', 'center', 'center-right'],
            ['bottom-left', 'bottom-center', 'bottom-right']
        ]
        
        for row in range(3):
            for col in range(3):
                x = col * (self.screen_width / 3)
                y = row * (self.screen_height / 3)
                w = self.screen_width / 3
                h = self.screen_height / 3
                
                regions[region_names[row][col]] = {
                    'x': x,
                    'y': y,
                    'width': w,
                    'height': h,
                    'action': region_names[row][col]  # Default action is region name
                }
        
        return regions
    
    def get_region(self, gaze_pos: Tuple[float, float]) -> Optional[str]:
        """
        Get the screen region for a gaze position.
        
        Args:
            gaze_pos: (x, y) raw gaze position
            
        Returns:
            Region name or None
        """
        # Apply calibration
        screen_pos = self.calibration.transform_gaze(gaze_pos)
        x, y = screen_pos
        
        # Find matching region
        for region_name, region_data in self.regions.items():
            if (region_data['x'] <= x < region_data['x'] + region_data['width'] and
                region_data['y'] <= y < region_data['y'] + region_data['height']):
                return region_name
        
        return None
    
    def get_action(self, gaze_pos: Tuple[float, float]) -> Optional[str]:
        """
        Get the action for a gaze position.
        
        Args:
            gaze_pos: (x, y) raw gaze position
            
        Returns:
            Action string or None
        """
        region = self.get_region(gaze_pos)
        if region:
            return self.regions[region]['action']
        return None
    
    def set_region_action(self, region_name: str, action: str):
        """Set the action for a region."""
        if region_name in self.regions:
            self.regions[region_name]['action'] = action

if __name__ == "__main__":
    print("Gaze tracker ready.")
