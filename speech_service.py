"""
Local Speech Recognition Service using OpenAI Whisper
Provides real-time speech-to-text transcription without requiring internet connection
"""

import os
import io
import wave
import tempfile
import torch
from flask import Flask, request, jsonify
from flask_cors import CORS
import whisper
import numpy as np
import gc
from threading import Lock

app = Flask(__name__)
CORS(app)  # Allow requests from Electron app

# Set environment variables to prevent crashes
os.environ['OMP_NUM_THREADS'] = '1'
os.environ['MKL_NUM_THREADS'] = '1'

# Force CPU usage to avoid CUDA issues
device = "cpu"
print(f"Using device: {device}")

# Load Whisper model (using 'base' for speed/accuracy balance)
# Options: tiny (fastest), base (balanced), small (slower but accurate)
print("Loading Whisper 'base' model (74MB) - optimized for speed...")
model = whisper.load_model("base", device=device)
print("Whisper model loaded!")

# Lock to prevent concurrent transcriptions (which can cause segfaults)
transcription_lock = Lock()

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'ok',
        'model': 'whisper-base',
        'ready': True
    })

@app.route('/transcribe', methods=['POST'])
def transcribe():
    """
    Transcribe audio from request
    Accepts: audio/webm, audio/wav, or raw PCM data
    Returns: { text: string, confidence: float }
    """
    # Only allow one transcription at a time to prevent segfaults
    if not transcription_lock.acquire(blocking=False):
        return jsonify({'error': 'Server busy, try again'}), 503
    
    try:
        # Get audio data from request
        if 'audio' not in request.files:
            return jsonify({'error': 'No audio file provided'}), 400
        
        audio_file = request.files['audio']
        
        # Save to temporary file
        with tempfile.NamedTemporaryFile(suffix='.webm', delete=False) as temp_audio:
            audio_file.save(temp_audio.name)
            temp_path = temp_audio.name
        
        try:
            file_size = os.path.getsize(temp_path)
            print(f"Transcribing audio file: {file_size} bytes")
            
            # Skip tiny files (likely silent)
            if file_size < 5000:
                print("Skipping - file too small (likely silent)")
                return jsonify({'text': '', 'confidence': 0.0, 'language': 'en'})
            
            # Transcribe using Whisper with speed optimizations
            with torch.no_grad():  # Disable gradient computation for inference
                result = model.transcribe(
                    temp_path,
                    language='en',  # Force English for faster processing
                    fp16=False,  # Disable FP16 for CPU compatibility
                    verbose=False,
                    condition_on_previous_text=False,  # Disable context to reduce memory
                    temperature=0.0,  # Deterministic output
                    beam_size=1,  # Greedy decoding (faster)
                    best_of=1  # Don't generate alternatives
                )
            
            text = result['text'].strip()
            
            # Calculate confidence from segment data
            segments = result.get('segments', [])
            if segments:
                # Average the no_speech_prob across segments (lower = more confident)
                avg_no_speech = np.mean([seg.get('no_speech_prob', 0.5) for seg in segments])
                confidence = 1.0 - avg_no_speech
            else:
                confidence = 0.8 if text else 0.0
            
            print(f"Transcribed: '{text}' (confidence: {confidence:.2f})")
            
            # Clean up memory
            del result
            del segments
            gc.collect()
            
            return jsonify({
                'text': text,
                'confidence': float(confidence),
                'language': 'en'
            })
        
        finally:
            # Clean up temp file
            try:
                if os.path.exists(temp_path):
                    os.unlink(temp_path)
            except Exception as e:
                print(f"Failed to delete temp file: {e}")
    
    except Exception as e:
        print(f"Transcription error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500
    
    finally:
        # Always release the lock
        transcription_lock.release()

@app.route('/transcribe-chunk', methods=['POST'])
def transcribe_chunk():
    """
    Transcribe a small audio chunk for real-time recognition
    Optimized for low latency
    """
    try:
        data = request.get_json()
        
        if not data or 'audio' not in data:
            return jsonify({'error': 'No audio data provided'}), 400
        
        # For now, just return empty - we'll implement streaming later if needed
        return jsonify({
            'text': '',
            'confidence': 0.0,
            'interim': True
        })
    
    except Exception as e:
        print(f"Chunk transcription error: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("=" * 60)
    print("🎤 Speech Recognition Service Starting...")
    print("Using OpenAI Whisper (BASE model - optimized for speed)")
    print("Server will run on http://localhost:5050")
    print("=" * 60)
    app.run(host='localhost', port=5050, debug=False, threaded=True)
