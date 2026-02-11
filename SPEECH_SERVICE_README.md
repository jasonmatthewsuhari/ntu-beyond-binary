# Local Speech Recognition Service

This service provides **offline speech-to-text** using OpenAI's Whisper model, eliminating the need for internet connectivity or external APIs.

## Quick Start

### 1. Install Dependencies

```bash
# Double-click this file or run:
start-speech-service.bat
```

This will:
- Create a Python virtual environment
- Install Whisper and dependencies
- Start the service on `http://localhost:5050`

### 2. Start Your Electron App

The app will automatically detect and use the local speech service when available.

## Manual Setup

If the batch file doesn't work:

```bash
# Create virtual environment
python -m venv venv

# Activate it
venv\Scripts\activate  # Windows
# or
source venv/bin/activate  # Mac/Linux

# Install dependencies
pip install -r requirements-speech.txt

# Run the service
python speech_service.py
```

## How It Works

1. **Frontend**: The app records 3-second audio chunks using `MediaRecorder`
2. **Backend**: Whisper transcribes the audio locally (no internet needed)
3. **Frontend**: Receives transcription and uses it for input detection

## Model Information

The service uses the **base** Whisper model by default, which provides:
- Good accuracy for English
- Fast processing (~1-2 seconds per 3-second chunk)
- ~140MB model size

### Available Models

You can change the model in `speech_service.py`:

| Model  | Size | Speed | Accuracy |
|--------|------|-------|----------|
| tiny   | 39M  | ⚡⚡⚡  | ⭐⭐     |
| base   | 74M  | ⚡⚡   | ⭐⭐⭐   |
| small  | 244M | ⚡     | ⭐⭐⭐⭐ |
| medium | 769M | 🐌    | ⭐⭐⭐⭐⭐|

## Troubleshooting

### Service won't start
- Make sure Python 3.8+ is installed
- Check if port 5050 is available
- Try installing dependencies manually

### "Service not running" in app
- Start the speech service first
- Check console for errors
- Verify service is running at `http://localhost:5050/health`

### Slow transcription
- Try using the `tiny` model for faster processing
- Check CPU usage - Whisper is CPU-intensive
- Consider using GPU acceleration (requires CUDA setup)

## API Endpoints

### `GET /health`
Check if service is running
```json
{
  "status": "ok",
  "model": "whisper-base",
  "ready": true
}
```

### `POST /transcribe`
Transcribe audio file
- Body: `multipart/form-data` with `audio` file
- Returns: `{ "text": string, "confidence": float }`

## Performance Tips

1. **GPU Acceleration** (optional):
   - Install CUDA toolkit
   - Install `torch` with CUDA support
   - 10x faster transcription

2. **Model Selection**:
   - Use `tiny` for fastest results
   - Use `base` for balanced speed/accuracy (default)
   - Use `small` if accuracy is critical

3. **Audio Quality**:
   - Clear audio = better results
   - Reduce background noise
   - Speak clearly and at normal pace
