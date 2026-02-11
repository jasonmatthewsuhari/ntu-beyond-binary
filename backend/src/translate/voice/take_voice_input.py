import os
import time
import numpy as np
import google.generativeai as genai
from dotenv import load_dotenv
from typing import Dict, Any, Optional
from pathlib import Path
import json

load_dotenv()

def reduce_noise(audio_data: np.ndarray, sample_rate: int) -> np.ndarray:
    """
    Simple noise reduction using spectral gating.
    For production, consider using libraries like noisereduce.
    """
    # For now, return as-is. In production, implement proper noise reduction
    # using noisereduce library or similar
    return audio_data

def normalize_audio(audio_data: np.ndarray) -> np.ndarray:
    """Normalize audio to -1 to 1 range."""
    max_val = np.max(np.abs(audio_data))
    if max_val > 0:
        return audio_data / max_val
    return audio_data

def load_calibration(profile_id: str) -> Optional[Dict[str, Any]]:
    """Load voice calibration data for a user."""
    calibration_path = Path(f"../data/calibrations/{profile_id}/voice.json")
    if calibration_path.exists():
        try:
            with open(calibration_path, 'r') as f:
                return json.load(f)
        except:
            pass
    return None

def save_calibration(profile_id: str, calibration_data: Dict[str, Any]) -> bool:
    """Save voice calibration data for a user."""
    calibration_dir = Path(f"../data/calibrations/{profile_id}")
    calibration_dir.mkdir(parents=True, exist_ok=True)
    calibration_path = calibration_dir / "voice.json"
    
    try:
        with open(calibration_path, 'w') as f:
            json.dump(calibration_data, f, indent=2)
        return True
    except:
        return False

def translate_voice_to_english(audio_path: str, profile_id: Optional[str] = None) -> Dict[str, Any]:
    """
    Translates spoken audio from a file into clear natural English text using Gemini.
    
    Args:
        audio_path (str): The absolute path to the audio file (wav, mp3, etc.).
        profile_id (str, optional): User profile ID for calibration data.
        
    Returns:
        Dict containing:
            - text: The transcribed and refined English text
            - confidence: Confidence score (0-1)
            - raw_text: Raw transcription before refinement
            - processing_time: Time taken to process
    """
    start_time = time.time()
    
    # Load calibration if available
    calibration = None
    if profile_id:
        calibration = load_calibration(profile_id)
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        return {
            "text": "",
            "confidence": 0.0,
            "error": "GOOGLE_API_KEY not found",
            "processing_time": 0
        }

    genai.configure(api_key=api_key)
    
    try:
        # Check if file exists
        if not os.path.exists(audio_path):
            return {
                "text": "",
                "confidence": 0.0,
                "error": f"Audio file not found at {audio_path}",
                "processing_time": 0
            }

        model = genai.GenerativeModel("gemini-2.0-flash")
        
        # Upload the audio file
        print(f"Uploading audio: {audio_path}...")
        audio_file = genai.upload_file(path=audio_path)
        
        # Wait for processing (audio is usually fast, but for consistency)
        while audio_file.state.name == "PROCESSING":
            print("Processing audio...")
            time.sleep(1)
            audio_file = genai.get_file(audio_file.name)

        if audio_file.state.name == "FAILED":
            return {
                "text": "",
                "confidence": 0.0,
                "error": "Audio processing failed",
                "processing_time": time.time() - start_time
            }

        # Build prompt with calibration hints if available
        prompt = """
        You are a highly accurate speech-to-text and translation expert. 
        Transcribe the provided audio and convert it into clear, natural, and properly formatted English.
        If the speaker has a heavy accent, speech impediment, or uses non-standard phrasing,
        ensure the final output reflects their intended meaning in natural English.
        """
        
        if calibration:
            accent = calibration.get('accent', '')
            impediment = calibration.get('speech_impediment', '')
            common_phrases = calibration.get('common_phrases', [])
            
            if accent:
                prompt += f"\nNote: Speaker has a {accent} accent."
            if impediment:
                prompt += f"\nNote: Speaker has a {impediment}."
            if common_phrases:
                prompt += f"\nCommon phrases this speaker uses: {', '.join(common_phrases[:5])}"
        
        prompt += "\n\nProvide the transcription in this format:\nTEXT: [transcribed text]\nCONFIDENCE: [0.0-1.0 score based on audio clarity]"
        
        response = model.generate_content([audio_file, prompt])
        
        # Clean up the cloud file
        genai.delete_file(audio_file.name)
        
        # Parse response
        response_text = response.text.strip()
        text = ""
        confidence = 0.8  # Default confidence
        
        # Try to parse structured response
        lines = response_text.split('\n')
        for line in lines:
            if line.startswith('TEXT:'):
                text = line.replace('TEXT:', '').strip()
            elif line.startswith('CONFIDENCE:'):
                try:
                    confidence = float(line.replace('CONFIDENCE:', '').strip())
                except:
                    confidence = 0.8
        
        # If no structured response, use whole text
        if not text:
            text = response_text
        
        processing_time = time.time() - start_time
        
        return {
            "text": text,
            "confidence": confidence,
            "raw_text": response_text,
            "processing_time": processing_time,
            "calibration_used": calibration is not None
        }
        
    except Exception as e:
        return {
            "text": "",
            "confidence": 0.0,
            "error": str(e),
            "processing_time": time.time() - start_time
        }

def calibrate_voice(profile_id: str, accent: str = "", speech_impediment: str = "", 
                   common_phrases: list = None) -> bool:
    """
    Calibrate voice recognition for a specific user.
    
    Args:
        profile_id: User profile ID
        accent: User's accent (e.g., "British", "Indian", "Southern US")
        speech_impediment: Any speech impediments
        common_phrases: List of phrases the user commonly says
    
    Returns:
        bool: Success status
    """
    calibration_data = {
        "accent": accent,
        "speech_impediment": speech_impediment,
        "common_phrases": common_phrases or [],
        "calibrated_at": time.time()
    }
    
    return save_calibration(profile_id, calibration_data)

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1:
        audio_path = sys.argv[1]
        profile_id = sys.argv[2] if len(sys.argv) > 2 else None
        
        result = translate_voice_to_english(audio_path, profile_id)
        print(json.dumps(result, indent=2))
    else:
        print("Usage: python take_voice_input.py <audio_path> [profile_id]")
        print("Script ready. Call translate_voice_to_english(audio_path, profile_id) to use.")
