import os
import json
from pathlib import Path
from typing import List, Dict, Any, Optional
from datetime import datetime
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Pattern recognition constants
SHORT_TAP_MAX = 200  # milliseconds
LONG_TAP_MIN = 200   # milliseconds
PATTERN_TIMEOUT = 2000  # milliseconds - time before pattern resets

def load_pattern_library(profile_id: str) -> Dict[str, str]:
    """Load user's custom haptic patterns."""
    pattern_file = Path(f"../data/gestures/{profile_id}/haptic_patterns.json")
    if pattern_file.exists():
        try:
            with open(pattern_file, 'r') as f:
                return json.load(f)
        except:
            pass
    return get_default_patterns()

def get_default_patterns() -> Dict[str, str]:
    """Get default haptic pattern mappings."""
    return {
        "S": ".",
        "L": "-",
        "S-S": "Yes",
        "L-L": "No",
        "S-S-S": "Help",
        "L-S": "Next",
        "S-L": "Back",
        "S-S-L": "Enter",
        "L-L-S": "Delete",
        "S-L-S": "Space",
        "... --- ...": "SOS",  # Morse SOS
    }

def save_pattern_library(profile_id: str, patterns: Dict[str, str]) -> bool:
    """Save user's custom haptic patterns."""
    pattern_dir = Path(f"../data/gestures/{profile_id}")
    pattern_dir.mkdir(parents=True, exist_ok=True)
    pattern_file = pattern_dir / "haptic_patterns.json"
    
    try:
        with open(pattern_file, 'w') as f:
            json.dump(patterns, f, indent=2)
        return True
    except:
        return False

def recognize_pattern(tap_times: List[int], threshold_short: int = SHORT_TAP_MAX) -> str:
    """
    Recognize a tap pattern based on timing.
    
    Args:
        tap_times: List of tap durations in milliseconds
        threshold_short: Threshold for short vs long tap
        
    Returns:
        Pattern string (e.g., "S-S-L" for short-short-long)
    """
    if not tap_times:
        return ""
    
    pattern_parts = []
    for duration in tap_times:
        if duration < threshold_short:
            pattern_parts.append("S")
        else:
            pattern_parts.append("L")
    
    return "-".join(pattern_parts)

def debounce_taps(tap_times: List[int], min_interval: int = 50) -> List[int]:
    """
    Remove accidental double-taps caused by tremor.
    
    Args:
        tap_times: List of tap durations
        min_interval: Minimum time between distinct taps
        
    Returns:
        Filtered tap times
    """
    if len(tap_times) <= 1:
        return tap_times
    
    # For now, just return as-is
    # In production, this would filter rapid consecutive taps
    return tap_times

def translate_haptic_to_english(haptic_pattern: str, profile_id: Optional[str] = None) -> Dict[str, Any]:
    """
    Translates a haptic pattern to natural language.
    
    Args:
        haptic_pattern (str): Pattern string (e.g., "S-S-L" or tap times)
        profile_id (str, optional): User profile for custom patterns
        
    Returns:
        Dict with translation result
    """
    # First check custom patterns
    if profile_id:
        patterns = load_pattern_library(profile_id)
    else:
        patterns = get_default_patterns()
    
    # Direct pattern match
    if haptic_pattern in patterns:
        return {
            "text": patterns[haptic_pattern],
            "confidence": 1.0,
            "method": "pattern_match",
            "pattern": haptic_pattern
        }
    
    # Try LLM translation for unknown patterns
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        return {
            "text": "",
            "confidence": 0.0,
            "error": "GOOGLE_API_KEY not found"
        }

    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-2.0-flash")
    
    prompt = f"""
    You are an expert in accessibility communication. 
    A user is providing haptic input consisting of patterns of vibrations or pulses.
    Translate the following haptic pattern sequence into natural, conversational English.
    If the pattern looks like Morse code, decode it. If it's a binary sequence or a custom pulse pattern, 
    interpret its most likely meaning in a helpful way.
    
    Pattern: {haptic_pattern}
    
    Known patterns for reference:
    S = short tap, L = long tap
    S-S = Yes, L-L = No, S-S-S = Help
    
    Output only the natural English translation as a single word or short phrase.
    """
    
    try:
        response = model.generate_content(prompt)
        return {
            "text": response.text.strip(),
            "confidence": 0.7,  # Lower confidence for LLM interpretation
            "method": "llm",
            "pattern": haptic_pattern
        }
    except Exception as e:
        return {
            "text": "",
            "confidence": 0.0,
            "error": str(e)
        }

def add_custom_pattern(profile_id: str, pattern: str, meaning: str) -> bool:
    """
    Add a custom haptic pattern for a user.
    
    Args:
        profile_id: User profile ID
        pattern: Pattern string (e.g., "S-L-S")
        meaning: Natural language meaning
        
    Returns:
        Success status
    """
    patterns = load_pattern_library(profile_id)
    patterns[pattern] = meaning
    return save_pattern_library(profile_id, patterns)

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1:
        pattern = sys.argv[1]
        profile_id = sys.argv[2] if len(sys.argv) > 2 else None
        result = translate_haptic_to_english(pattern, profile_id)
        print(json.dumps(result, indent=2))
    else:
        # Example usage
        sample_pattern = "S-S-L"
        print(f"Haptic Pattern: {sample_pattern}")
        result = translate_haptic_to_english(sample_pattern)
        print(f"Result: {json.dumps(result, indent=2)}")
