# Fluent Accessibility Backend

Privacy-first accessibility input processing backend with WebSocket support for real-time communication.

## Architecture

```
backend/
├── src/
│   ├── server.py              # FastAPI WebSocket server
│   ├── agent_interface.py     # Desktop agent integration
│   ├── storage/               # File-based storage layer
│   │   ├── profiles.py        # User profile management
│   │   ├── calibrations.py    # Calibration data
│   │   └── gestures.py        # Custom gesture storage
│   └── translate/             # Input translation modules
│       ├── voice/             # Voice transcription
│       ├── draw/              # Gesture recognition
│       ├── haptic/            # Haptic pattern recognition
│       ├── text/              # Text refinement
│       ├── sign/              # Sign language recognition
│       ├── eye_gaze/          # Eye gaze tracking
│       ├── head/              # Head motion tracking
│       ├── facial/            # Facial expression detection
│       └── sip_puff/          # Breath detection
├── data/                      # User data (gitignored)
│   ├── profiles/              # User profiles
│   ├── calibrations/          # Calibration data
│   └── gestures/              # Custom gestures & models
└── requirements.txt           # Python dependencies
```

## Setup

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Environment Variables

Create a `.env` file in the backend directory:

```env
GOOGLE_API_KEY=your_gemini_api_key_here
```

### 3. Start the Server

**Windows:**
```bash
start_server.bat
```

**Linux/Mac:**
```bash
chmod +x start_server.sh
./start_server.sh
```

**Manual:**
```bash
cd src
python server.py
```

The server will start on `http://127.0.0.1:8000`

## API Endpoints

### REST API

- `GET /health` - Health check
- `GET /api/profiles` - List all profiles
- `GET /api/profiles/{profile_id}` - Get a profile
- `POST /api/profiles/{profile_id}` - Save/update a profile
- `DELETE /api/profiles/{profile_id}` - Delete a profile
- `GET /api/calibrations/{profile_id}/{input_method}` - Get calibration
- `POST /api/calibrations/{profile_id}/{input_method}` - Save calibration
- `GET /api/gestures/{profile_id}` - List gestures
- `POST /api/gestures/{profile_id}/{gesture_id}` - Save gesture
- `DELETE /api/gestures/{profile_id}/{gesture_id}` - Delete gesture
- `POST /api/execute` - Execute a natural language query
- `GET /api/agent/status` - Get desktop agent status
- `GET /api/agent/history` - Get command history

### WebSocket API

**Endpoint:** `ws://127.0.0.1:8000/ws/{input_method}/{client_id}`

**Supported Input Methods:**
- `voice`
- `draw`
- `haptic`
- `sign`
- `eye-gaze`
- `head`
- `facial`
- `sip-puff`

**Message Types:**

```json
{
  "type": "ping",
  "timestamp": "2026-02-11T12:00:00.000Z"
}

{
  "type": "execute_query",
  "query": "Open calculator",
  "timestamp": "2026-02-11T12:00:00.000Z"
}

{
  "type": "save_calibration",
  "profile_id": "user123",
  "data": {...}
}

{
  "type": "save_gesture",
  "profile_id": "user123",
  "gesture_id": "wave",
  "data": {...}
}
```

## Input Modules

### Voice
- Gemini-based transcription
- Noise reduction support
- Accent/speech impediment calibration
- Confidence scoring

### Draw/Gesture
- Stroke normalization
- Custom gesture training
- Tremor filtering
- Pattern matching with KNN

### Haptic
- Timing-based pattern recognition (short/long taps)
- Custom pattern library
- Debouncing for tremor
- Default patterns (S-S = Yes, L-L = No, etc.)

### Sign Language
- MediaPipe hand tracking integration
- Custom sign photo capture
- Sign buffering and LLM compilation
- Multiple sign language support (ASL, BSL, ISL)

### Eye Gaze
- 9-point calibration
- Screen region mapping
- Gaze coordinate transformation
- Drift correction

### Head Motion
- Pitch/yaw/roll tracking
- Gesture detection (nod, shake, tilt)
- Quantity-based actions (2 nods = different action)
- Customizable sensitivity

### Facial Expression
- Expression detection (smile, frown, eyebrow raise, etc.)
- Customizable mappings
- Intensity thresholds
- Partial facial paralysis support

### Sip/Puff
- FFT-based breath detection
- Sip (high freq) vs Puff (low freq) classification
- Calibration for user's breath characteristics
- Pattern support

## Desktop Agent Integration

The backend integrates with the desktop agent (`agent.py`) to execute natural language queries:

```python
# Example flow:
1. User says "Open calculator"
2. Voice module transcribes to text
3. Backend sends to desktop agent
4. Agent executes system command
5. Response returned to frontend
```

**Features:**
- Sequential command queueing
- Context awareness (previous queries)
- Execution timeout (2 minutes)
- Error handling and logging

## Privacy & Security

- **Client-Side Processing**: Video/audio analyzed in browser
- **Minimal Data Transfer**: Only natural language queries sent to backend
- **Local Storage**: All user data stored locally in `data/` directory
- **No Telemetry**: No usage tracking
- **No Cloud**: User data never leaves the device except final queries

## Development

### Running Tests

```bash
# Test individual modules
cd src/translate/voice
python take_voice_input.py test_audio.wav

cd ../haptic
python take_haptic_input.py "S-S-L"
```

### Adding a New Input Method

1. Create module directory: `backend/src/translate/your_method/`
2. Implement translation function
3. Add WebSocket handler in `server.py`
4. Create frontend component
5. Update `INPUT_MODES` in `frontend/components/app-shell.tsx`

## Troubleshooting

**Server won't start:**
- Check Python version (3.9+)
- Verify all dependencies installed
- Check if port 8000 is available

**WebSocket connection fails:**
- Ensure server is running
- Check firewall settings
- Verify client ID is unique

**Desktop agent not responding:**
- Check `GOOGLE_API_KEY` is set
- Verify `agent.py` is in root directory
- Check agent logs for errors

## License

See root LICENSE file.
