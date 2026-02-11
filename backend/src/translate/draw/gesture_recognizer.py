"""
Gesture recognition for draw/write input.
Uses stroke normalization and pattern matching.
"""

import numpy as np
from typing import List, Tuple, Dict, Any, Optional
import json
from pathlib import Path
from sklearn.neighbors import KNeighborsClassifier
import pickle

def normalize_stroke(points: List[Tuple[float, float]]) -> np.ndarray:
    """
    Normalize a stroke to be scale and translation invariant.
    
    Args:
        points: List of (x, y) coordinates
        
    Returns:
        Normalized points as numpy array
    """
    if len(points) < 2:
        return np.array(points)
    
    points = np.array(points)
    
    # Center the stroke
    centroid = np.mean(points, axis=0)
    points = points - centroid
    
    # Scale to unit bounding box
    min_vals = np.min(points, axis=0)
    max_vals = np.max(points, axis=0)
    range_vals = max_vals - min_vals
    
    # Avoid division by zero
    range_vals[range_vals == 0] = 1
    
    points = points / range_vals
    
    return points

def resample_stroke(points: np.ndarray, num_points: int = 64) -> np.ndarray:
    """
    Resample stroke to fixed number of points using linear interpolation.
    
    Args:
        points: Array of (x, y) coordinates
        num_points: Number of points to resample to
        
    Returns:
        Resampled points
    """
    if len(points) < 2:
        return points
    
    # Calculate cumulative arc length
    diffs = np.diff(points, axis=0)
    distances = np.sqrt(np.sum(diffs**2, axis=1))
    cumulative_dist = np.concatenate(([0], np.cumsum(distances)))
    total_length = cumulative_dist[-1]
    
    if total_length == 0:
        return points
    
    # Sample points at regular intervals
    target_distances = np.linspace(0, total_length, num_points)
    resampled = np.zeros((num_points, 2))
    
    for i, target_dist in enumerate(target_distances):
        # Find segment containing this distance
        idx = np.searchsorted(cumulative_dist, target_dist)
        
        if idx == 0:
            resampled[i] = points[0]
        elif idx >= len(points):
            resampled[i] = points[-1]
        else:
            # Interpolate between idx-1 and idx
            t = (target_dist - cumulative_dist[idx-1]) / (cumulative_dist[idx] - cumulative_dist[idx-1])
            resampled[i] = (1 - t) * points[idx-1] + t * points[idx]
    
    return resampled

def extract_features(stroke: List[Tuple[float, float]]) -> np.ndarray:
    """
    Extract features from a stroke for classification.
    
    Args:
        stroke: List of (x, y) coordinates
        
    Returns:
        Feature vector
    """
    # Normalize and resample
    normalized = normalize_stroke(stroke)
    resampled = resample_stroke(normalized, num_points=32)
    
    # Flatten to feature vector
    features = resampled.flatten()
    
    return features

def tremor_filter(points: List[Tuple[float, float]], smoothing: float = 0.3) -> List[Tuple[float, float]]:
    """
    Apply smoothing filter to reduce tremor effects.
    
    Args:
        points: List of (x, y) coordinates
        smoothing: Smoothing factor (0-1, higher = more smoothing)
        
    Returns:
        Filtered points
    """
    if len(points) < 3 or smoothing <= 0:
        return points
    
    filtered = [points[0]]
    
    for i in range(1, len(points) - 1):
        # Simple moving average
        prev_pt = np.array(points[i-1])
        curr_pt = np.array(points[i])
        next_pt = np.array(points[i+1])
        
        avg_pt = (prev_pt + curr_pt + next_pt) / 3
        smoothed_pt = (1 - smoothing) * curr_pt + smoothing * avg_pt
        
        filtered.append(tuple(smoothed_pt))
    
    filtered.append(points[-1])
    
    return filtered

class GestureRecognizer:
    """Recognizes gestures using trained models."""
    
    def __init__(self, model_path: Optional[str] = None):
        self.model = None
        self.gesture_names = []
        
        if model_path and Path(model_path).exists():
            self.load_model(model_path)
    
    def load_model(self, model_path: str):
        """Load a trained gesture recognition model."""
        with open(model_path, 'rb') as f:
            data = pickle.load(f)
            self.model = data['model']
            self.gesture_names = data['gesture_names']
    
    def save_model(self, model_path: str):
        """Save the trained model."""
        data = {
            'model': self.model,
            'gesture_names': self.gesture_names
        }
        with open(model_path, 'wb') as f:
            pickle.dump(data, f)
    
    def train(self, gestures: List[Dict[str, Any]]):
        """
        Train the recognizer on gesture samples.
        
        Args:
            gestures: List of dicts with 'name', 'strokes', 'query' keys
        """
        X = []
        y = []
        self.gesture_names = []
        
        for gesture in gestures:
            name = gesture['name']
            if name not in self.gesture_names:
                self.gesture_names.append(name)
            
            label = self.gesture_names.index(name)
            
            # Extract features from each training sample
            for stroke in gesture['strokes']:
                features = extract_features(stroke)
                X.append(features)
                y.append(label)
        
        # Train KNN classifier
        self.model = KNeighborsClassifier(n_neighbors=min(3, len(X)))
        self.model.fit(X, y)
    
    def recognize(self, stroke: List[Tuple[float, float]], threshold: float = 0.6) -> Dict[str, Any]:
        """
        Recognize a gesture from a stroke.
        
        Args:
            stroke: List of (x, y) coordinates
            threshold: Confidence threshold (0-1)
            
        Returns:
            Dict with 'name', 'confidence', 'query' keys
        """
        if not self.model:
            return {'name': None, 'confidence': 0.0, 'query': None, 'error': 'No model loaded'}
        
        try:
            features = extract_features(stroke)
            
            # Get prediction probabilities
            probs = self.model.predict_proba([features])[0]
            best_idx = np.argmax(probs)
            confidence = probs[best_idx]
            
            if confidence < threshold:
                return {'name': None, 'confidence': confidence, 'query': None, 'reason': 'Low confidence'}
            
            name = self.gesture_names[best_idx]
            
            return {
                'name': name,
                'confidence': float(confidence),
                'query': None  # Query will be looked up from gesture database
            }
        except Exception as e:
            return {'name': None, 'confidence': 0.0, 'query': None, 'error': str(e)}

def recognize_gesture(stroke: List[Tuple[float, float]], profile_id: str, 
                     smoothing: float = 0.3) -> Dict[str, Any]:
    """
    Recognize a gesture with tremor filtering.
    
    Args:
        stroke: List of (x, y) coordinates
        profile_id: User profile ID
        smoothing: Tremor smoothing factor
        
    Returns:
        Recognition result
    """
    # Apply tremor filtering
    filtered_stroke = tremor_filter(stroke, smoothing)
    
    # Load user's trained model
    model_path = f"../data/gestures/{profile_id}/models/draw_model.pkl"
    
    recognizer = GestureRecognizer(model_path if Path(model_path).exists() else None)
    
    return recognizer.recognize(filtered_stroke)

def train_custom_gesture(profile_id: str, gesture_name: str, 
                        strokes: List[List[Tuple[float, float]]], 
                        query: str) -> bool:
    """
    Train a custom gesture for a user.
    
    Args:
        profile_id: User profile ID
        gesture_name: Name of the gesture
        strokes: List of training strokes (user drew gesture multiple times)
        query: Natural language query to execute for this gesture
        
    Returns:
        Success status
    """
    try:
        # Load existing gestures for this user
        gestures_dir = Path(f"../data/gestures/{profile_id}")
        gestures_dir.mkdir(parents=True, exist_ok=True)
        
        gestures_file = gestures_dir / "draw_gestures.json"
        
        if gestures_file.exists():
            with open(gestures_file, 'r') as f:
                gestures = json.load(f)
        else:
            gestures = []
        
        # Add new gesture
        gesture_data = {
            'name': gesture_name,
            'strokes': strokes,
            'query': query
        }
        
        # Remove old version if exists
        gestures = [g for g in gestures if g['name'] != gesture_name]
        gestures.append(gesture_data)
        
        # Save gestures
        with open(gestures_file, 'w') as f:
            json.dump(gestures, f, indent=2)
        
        # Retrain model
        recognizer = GestureRecognizer()
        recognizer.train(gestures)
        
        # Save model
        model_dir = gestures_dir / "models"
        model_dir.mkdir(exist_ok=True)
        recognizer.save_model(str(model_dir / "draw_model.pkl"))
        
        return True
    except Exception as e:
        print(f"Error training gesture: {e}")
        return False

if __name__ == "__main__":
    # Test basic functionality
    test_stroke = [(0, 0), (1, 0), (2, 0), (3, 0), (4, 0)]
    features = extract_features(test_stroke)
    print(f"Feature vector size: {len(features)}")
    print("Gesture recognizer module ready.")
