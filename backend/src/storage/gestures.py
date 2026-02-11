"""
Custom gesture management for draw and sign language inputs.
"""

import json
import pickle
from pathlib import Path
from typing import Dict, Any, Optional, List
from datetime import datetime
import numpy as np

class GestureManager:
    """Manages custom gesture definitions and models."""
    
    def __init__(self, data_dir: str = "backend/data/gestures"):
        self.data_dir = Path(data_dir)
        self.data_dir.mkdir(parents=True, exist_ok=True)
    
    def get_gesture(self, profile_id: str, gesture_id: str) -> Optional[Dict[str, Any]]:
        """Get a custom gesture definition."""
        filepath = self.data_dir / profile_id / f"{gesture_id}.json"
        if not filepath.exists():
            return None
        
        try:
            with open(filepath, 'r') as f:
                gesture_data = json.load(f)
            
            # Load training data if exists
            training_file = self.data_dir / profile_id / f"{gesture_id}_training.pkl"
            if training_file.exists():
                with open(training_file, 'rb') as f:
                    gesture_data['training_data'] = pickle.load(f)
            
            return gesture_data
        except Exception as e:
            print(f"Error loading gesture {profile_id}/{gesture_id}: {e}")
            return None
    
    def save_gesture(self, profile_id: str, gesture_id: str, data: Dict[str, Any]) -> bool:
        """Save a custom gesture definition."""
        profile_dir = self.data_dir / profile_id
        profile_dir.mkdir(parents=True, exist_ok=True)
        
        filepath = profile_dir / f"{gesture_id}.json"
        temp_filepath = filepath.with_suffix('.tmp')
        
        try:
            # Separate training data for binary storage
            training_data = data.pop('training_data', None)
            
            # Add metadata
            data['updated_at'] = datetime.utcnow().isoformat()
            if 'created_at' not in data:
                data['created_at'] = data['updated_at']
            
            # Write metadata to JSON
            with open(temp_filepath, 'w') as f:
                json.dump(data, f, indent=2)
            temp_filepath.replace(filepath)
            
            # Write training data to pickle if exists
            if training_data is not None:
                training_file = profile_dir / f"{gesture_id}_training.pkl"
                with open(training_file, 'wb') as f:
                    pickle.dump(training_data, f)
            
            return True
        except Exception as e:
            print(f"Error saving gesture {profile_id}/{gesture_id}: {e}")
            if temp_filepath.exists():
                temp_filepath.unlink()
            return False
    
    def delete_gesture(self, profile_id: str, gesture_id: str) -> bool:
        """Delete a custom gesture."""
        filepath = self.data_dir / profile_id / f"{gesture_id}.json"
        training_file = self.data_dir / profile_id / f"{gesture_id}_training.pkl"
        
        try:
            if filepath.exists():
                filepath.unlink()
            if training_file.exists():
                training_file.unlink()
            return True
        except Exception as e:
            print(f"Error deleting gesture {profile_id}/{gesture_id}: {e}")
            return False
    
    def list_gestures(self, profile_id: str, gesture_type: Optional[str] = None) -> List[Dict[str, Any]]:
        """List all custom gestures for a profile."""
        profile_dir = self.data_dir / profile_id
        if not profile_dir.exists():
            return []
        
        try:
            gestures = []
            for filepath in profile_dir.glob("*.json"):
                if "_training" in filepath.stem:
                    continue
                
                with open(filepath, 'r') as f:
                    gesture_data = json.load(f)
                
                # Filter by type if specified
                if gesture_type and gesture_data.get('type') != gesture_type:
                    continue
                
                gesture_data['id'] = filepath.stem
                gestures.append(gesture_data)
            
            return gestures
        except Exception as e:
            print(f"Error listing gestures for {profile_id}: {e}")
            return []
    
    def save_gesture_model(self, profile_id: str, model_name: str, model_data: bytes) -> bool:
        """Save a trained gesture recognition model."""
        profile_dir = self.data_dir / profile_id / "models"
        profile_dir.mkdir(parents=True, exist_ok=True)
        
        filepath = profile_dir / f"{model_name}.pkl"
        
        try:
            with open(filepath, 'wb') as f:
                f.write(model_data)
            return True
        except Exception as e:
            print(f"Error saving model {profile_id}/{model_name}: {e}")
            return False
    
    def load_gesture_model(self, profile_id: str, model_name: str) -> Optional[bytes]:
        """Load a trained gesture recognition model."""
        filepath = self.data_dir / profile_id / "models" / f"{model_name}.pkl"
        
        if not filepath.exists():
            return None
        
        try:
            with open(filepath, 'rb') as f:
                return f.read()
        except Exception as e:
            print(f"Error loading model {profile_id}/{model_name}: {e}")
            return None
