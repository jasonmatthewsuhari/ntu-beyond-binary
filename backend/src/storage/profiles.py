"""
User profile management with file-based storage.
"""

import json
import os
import sys
from pathlib import Path
from typing import Dict, Any, Optional
from datetime import datetime
from contextlib import contextmanager
import time

# Cross-platform file locking
if sys.platform == 'win32':
    import msvcrt
    def acquire_lock(f):
        msvcrt.locking(f.fileno(), msvcrt.LK_LOCK, 1)
    def release_lock(f):
        msvcrt.locking(f.fileno(), msvcrt.LK_UNLCK, 1)
else:
    import fcntl
    def acquire_lock(f):
        fcntl.flock(f.fileno(), fcntl.LOCK_EX)
    def release_lock(f):
        fcntl.flock(f.fileno(), fcntl.LOCK_UN)

class ProfileManager:
    """Manages user profiles with atomic file operations."""
    
    def __init__(self, data_dir: str = "backend/data/profiles"):
        self.data_dir = Path(data_dir)
        self.data_dir.mkdir(parents=True, exist_ok=True)
    
    @contextmanager
    def _lock_file(self, filepath: Path):
        """Context manager for cross-platform file locking."""
        lock_filepath = filepath.with_suffix('.lock')
        f = None
        try:
            # Create lock file and acquire lock
            f = open(lock_filepath, 'w')
            max_retries = 10
            for _ in range(max_retries):
                try:
                    acquire_lock(f)
                    break
                except (OSError, IOError):
                    time.sleep(0.1)
            yield
        finally:
            if f:
                try:
                    release_lock(f)
                except:
                    pass
                f.close()
            if lock_filepath.exists():
                try:
                    lock_filepath.unlink()
                except:
                    pass
    
    def get_profile(self, profile_id: str) -> Optional[Dict[str, Any]]:
        """Get a user profile by ID."""
        filepath = self.data_dir / f"{profile_id}.json"
        if not filepath.exists():
            return None
        
        try:
            with open(filepath, 'r') as f:
                return json.load(f)
        except Exception as e:
            print(f"Error loading profile {profile_id}: {e}")
            return None
    
    def save_profile(self, profile_id: str, data: Dict[str, Any]) -> bool:
        """Save a user profile with atomic write."""
        filepath = self.data_dir / f"{profile_id}.json"
        temp_filepath = filepath.with_suffix('.tmp')
        
        try:
            # Add metadata
            data['updated_at'] = datetime.utcnow().isoformat()
            if 'created_at' not in data:
                data['created_at'] = data['updated_at']
            
            # Write to temp file first
            with open(temp_filepath, 'w') as f:
                json.dump(data, f, indent=2)
            
            # Atomic rename
            temp_filepath.replace(filepath)
            return True
        except Exception as e:
            print(f"Error saving profile {profile_id}: {e}")
            if temp_filepath.exists():
                temp_filepath.unlink()
            return False
    
    def delete_profile(self, profile_id: str) -> bool:
        """Delete a user profile."""
        filepath = self.data_dir / f"{profile_id}.json"
        try:
            if filepath.exists():
                filepath.unlink()
            return True
        except Exception as e:
            print(f"Error deleting profile {profile_id}: {e}")
            return False
    
    def list_profiles(self) -> list:
        """List all profile IDs."""
        try:
            return [f.stem for f in self.data_dir.glob("*.json")]
        except Exception as e:
            print(f"Error listing profiles: {e}")
            return []
    
    def backup_profile(self, profile_id: str) -> bool:
        """Create a backup of a profile."""
        filepath = self.data_dir / f"{profile_id}.json"
        if not filepath.exists():
            return False
        
        backup_dir = self.data_dir / "backups"
        backup_dir.mkdir(exist_ok=True)
        
        timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
        backup_filepath = backup_dir / f"{profile_id}_{timestamp}.json"
        
        try:
            with open(filepath, 'r') as src:
                data = json.load(src)
            with open(backup_filepath, 'w') as dst:
                json.dump(data, dst, indent=2)
            return True
        except Exception as e:
            print(f"Error backing up profile {profile_id}: {e}")
            return False
