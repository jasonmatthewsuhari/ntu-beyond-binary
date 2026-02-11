"""
Gesture database for storing and retrieving custom gestures.
"""

import json
from pathlib import Path
from typing import List, Dict, Any, Optional

class GestureDatabase:
    """Database for managing custom gestures."""
    
    def __init__(self, profile_id: str):
        self.profile_id = profile_id
        self.gestures_dir = Path(f"../data/gestures/{profile_id}")
        self.gestures_dir.mkdir(parents=True, exist_ok=True)
        self.gestures_file = self.gestures_dir / "draw_gestures.json"
        self._gestures = None
    
    def _load_gestures(self) -> List[Dict[str, Any]]:
        """Load gestures from file."""
        if self.gestures_file.exists():
            with open(self.gestures_file, 'r') as f:
                return json.load(f)
        return []
    
    def _save_gestures(self, gestures: List[Dict[str, Any]]):
        """Save gestures to file."""
        with open(self.gestures_file, 'w') as f:
            json.dump(gestures, f, indent=2)
    
    @property
    def gestures(self) -> List[Dict[str, Any]]:
        """Get all gestures (cached)."""
        if self._gestures is None:
            self._gestures = self._load_gestures()
        return self._gestures
    
    def add_gesture(self, name: str, strokes: List[List[tuple]], query: str) -> bool:
        """
        Add or update a gesture.
        
        Args:
            name: Gesture name
            strokes: Training strokes
            query: Natural language query
            
        Returns:
            Success status
        """
        try:
            gestures = self.gestures
            
            # Remove existing gesture with same name
            gestures = [g for g in gestures if g['name'] != name]
            
            # Add new gesture
            gestures.append({
                'name': name,
                'strokes': strokes,
                'query': query
            })
            
            self._save_gestures(gestures)
            self._gestures = gestures
            
            return True
        except Exception as e:
            print(f"Error adding gesture: {e}")
            return False
    
    def get_gesture(self, name: str) -> Optional[Dict[str, Any]]:
        """Get a gesture by name."""
        for gesture in self.gestures:
            if gesture['name'] == name:
                return gesture
        return None
    
    def delete_gesture(self, name: str) -> bool:
        """Delete a gesture by name."""
        try:
            gestures = [g for g in self.gestures if g['name'] != name]
            self._save_gestures(gestures)
            self._gestures = gestures
            return True
        except Exception as e:
            print(f"Error deleting gesture: {e}")
            return False
    
    def list_gestures(self) -> List[Dict[str, str]]:
        """List all gestures (name and query only)."""
        return [
            {'name': g['name'], 'query': g['query']}
            for g in self.gestures
        ]
    
    def get_query_for_gesture(self, name: str) -> Optional[str]:
        """Get the query associated with a gesture."""
        gesture = self.get_gesture(name)
        return gesture['query'] if gesture else None
    
    def clear_all(self) -> bool:
        """Clear all gestures."""
        try:
            self._save_gestures([])
            self._gestures = []
            return True
        except Exception as e:
            print(f"Error clearing gestures: {e}")
            return False

if __name__ == "__main__":
    # Test functionality
    db = GestureDatabase("test_profile")
    print(f"Gesture database initialized for test_profile")
    print(f"Current gestures: {len(db.gestures)}")
