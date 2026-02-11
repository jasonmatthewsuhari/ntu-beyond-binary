"""
Custom sign gesture management for personalized sign language.
"""

import json
import numpy as np
from pathlib import Path
from typing import List, Dict, Any, Optional
from sklearn.neighbors import KNeighborsClassifier
import pickle

class CustomSignManager:
    """Manages custom sign gestures for a user."""
    
    def __init__(self, profile_id: str):
        self.profile_id = profile_id
        self.signs_dir = Path(f"../data/gestures/{profile_id}/signs")
        self.signs_dir.mkdir(parents=True, exist_ok=True)
        self.signs_file = self.signs_dir / "custom_signs.json"
        self.model_file = self.signs_dir / "sign_model.pkl"
        self.model = None
        self.sign_names = []
    
    def add_sign(self, name: str, landmarks_list: List[List[float]], query: str) -> bool:
        """
        Add a custom sign gesture.
        
        Args:
            name: Name of the sign
            landmarks_list: List of hand landmark arrays from multiple photos
            query: Natural language query to execute
            
        Returns:
            Success status
        """
        try:
            # Load existing signs
            signs = self._load_signs()
            
            # Remove old version if exists
            signs = [s for s in signs if s['name'] != name]
            
            # Add new sign
            signs.append({
                'name': name,
                'landmarks': landmarks_list,
                'query': query
            })
            
            # Save
            with open(self.signs_file, 'w') as f:
                json.dump(signs, f, indent=2)
            
            # Retrain model
            self._train_model(signs)
            
            return True
        except Exception as e:
            print(f"Error adding sign: {e}")
            return False
    
    def recognize_sign(self, landmarks: List[float]) -> Dict[str, Any]:
        """
        Recognize a sign from hand landmarks.
        
        Args:
            landmarks: Flattened hand landmark array
            
        Returns:
            Recognition result
        """
        if not self.model:
            self._load_model()
        
        if not self.model:
            return {'name': None, 'confidence': 0.0, 'query': None}
        
        try:
            # Get prediction
            features = np.array(landmarks).reshape(1, -1)
            probs = self.model.predict_proba(features)[0]
            best_idx = np.argmax(probs)
            confidence = probs[best_idx]
            
            if confidence < 0.6:
                return {'name': None, 'confidence': float(confidence), 'query': None}
            
            name = self.sign_names[best_idx]
            
            # Get query
            signs = self._load_signs()
            query = next((s['query'] for s in signs if s['name'] == name), None)
            
            return {
                'name': name,
                'confidence': float(confidence),
                'query': query
            }
        except Exception as e:
            return {'name': None, 'confidence': 0.0, 'query': None, 'error': str(e)}
    
    def _load_signs(self) -> List[Dict[str, Any]]:
        """Load custom signs from file."""
        if self.signs_file.exists():
            with open(self.signs_file, 'r') as f:
                return json.load(f)
        return []
    
    def _train_model(self, signs: List[Dict[str, Any]]):
        """Train KNN model on custom signs."""
        if not signs:
            return
        
        X = []
        y = []
        self.sign_names = []
        
        for sign in signs:
            name = sign['name']
            if name not in self.sign_names:
                self.sign_names.append(name)
            
            label = self.sign_names.index(name)
            
            for landmarks in sign['landmarks']:
                X.append(landmarks)
                y.append(label)
        
        # Train KNN
        self.model = KNeighborsClassifier(n_neighbors=min(3, len(X)))
        self.model.fit(X, y)
        
        # Save model
        with open(self.model_file, 'wb') as f:
            pickle.dump({
                'model': self.model,
                'sign_names': self.sign_names
            }, f)
    
    def _load_model(self):
        """Load trained model."""
        if self.model_file.exists():
            try:
                with open(self.model_file, 'rb') as f:
                    data = pickle.load(f)
                    self.model = data['model']
                    self.sign_names = data['sign_names']
            except:
                pass
    
    def list_signs(self) -> List[Dict[str, str]]:
        """List all custom signs."""
        signs = self._load_signs()
        return [{'name': s['name'], 'query': s['query']} for s in signs]
    
    def delete_sign(self, name: str) -> bool:
        """Delete a custom sign."""
        try:
            signs = [s for s in self._load_signs() if s['name'] != name]
            
            with open(self.signs_file, 'w') as f:
                json.dump(signs, f, indent=2)
            
            if signs:
                self._train_model(signs)
            
            return True
        except:
            return False

if __name__ == "__main__":
    print("Custom sign manager ready.")
