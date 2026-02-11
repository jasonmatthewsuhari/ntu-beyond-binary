"""
FastAPI WebSocket server for accessibility input processing.
"""

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import Dict, Any, Optional
from contextlib import asynccontextmanager
import asyncio
import json
import logging
from datetime import datetime

from agent_interface import get_agent_interface
from storage import ProfileManager, CalibrationManager, GestureManager

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize storage managers
profile_manager = ProfileManager()
calibration_manager = CalibrationManager()
gesture_manager = GestureManager()

# Track active WebSocket connections
active_connections: Dict[str, WebSocket] = {}

# Initialize agent interface
agent = get_agent_interface()

# ─── Lifespan Events ─────────────────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for startup and shutdown events."""
    # Startup
    logger.info("Starting Fluent Accessibility Server...")
    logger.info("Desktop agent interface initialized")
    
    yield
    
    # Shutdown
    logger.info("Shutting down Fluent Accessibility Server...")
    agent.stop()
    logger.info("Desktop agent interface stopped")

# Initialize FastAPI app with lifespan
app = FastAPI(
    title="Fluent Accessibility Server",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration for Electron app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── Health Check ────────────────────────────────────────────────────────────

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "agent_status": agent.get_status()
    }


# ─── Profile Management ──────────────────────────────────────────────────────

@app.get("/api/profiles")
async def list_profiles():
    """List all user profiles."""
    profiles = profile_manager.list_profiles()
    return {"profiles": profiles}

@app.get("/api/profiles/{profile_id}")
async def get_profile(profile_id: str):
    """Get a specific user profile."""
    profile = profile_manager.get_profile(profile_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@app.post("/api/profiles/{profile_id}")
async def save_profile(profile_id: str, data: Dict[str, Any]):
    """Save or update a user profile."""
    success = profile_manager.save_profile(profile_id, data)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to save profile")
    return {"success": True, "profile_id": profile_id}

@app.delete("/api/profiles/{profile_id}")
async def delete_profile(profile_id: str):
    """Delete a user profile."""
    success = profile_manager.delete_profile(profile_id)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to delete profile")
    return {"success": True}


# ─── Calibration Management ──────────────────────────────────────────────────

@app.get("/api/calibrations/{profile_id}/{input_method}")
async def get_calibration(profile_id: str, input_method: str):
    """Get calibration data for an input method."""
    calibration = calibration_manager.get_calibration(profile_id, input_method)
    if not calibration:
        raise HTTPException(status_code=404, detail="Calibration not found")
    return calibration

@app.post("/api/calibrations/{profile_id}/{input_method}")
async def save_calibration(profile_id: str, input_method: str, data: Dict[str, Any]):
    """Save calibration data for an input method."""
    success = calibration_manager.save_calibration(profile_id, input_method, data)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to save calibration")
    return {"success": True}


# ─── Gesture Management ──────────────────────────────────────────────────────

@app.get("/api/gestures/{profile_id}")
async def list_gestures(profile_id: str, gesture_type: Optional[str] = None):
    """List custom gestures for a profile."""
    gestures = gesture_manager.list_gestures(profile_id, gesture_type)
    return {"gestures": gestures}

@app.post("/api/gestures/{profile_id}/{gesture_id}")
async def save_gesture(profile_id: str, gesture_id: str, data: Dict[str, Any]):
    """Save a custom gesture."""
    success = gesture_manager.save_gesture(profile_id, gesture_id, data)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to save gesture")
    return {"success": True, "gesture_id": gesture_id}

@app.delete("/api/gestures/{profile_id}/{gesture_id}")
async def delete_gesture(profile_id: str, gesture_id: str):
    """Delete a custom gesture."""
    success = gesture_manager.delete_gesture(profile_id, gesture_id)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to delete gesture")
    return {"success": True}


# ─── Desktop Agent Execution ─────────────────────────────────────────────────

@app.post("/api/execute")
async def execute_query(data: Dict[str, Any]):
    """Execute a natural language query via the desktop agent."""
    query = data.get('query')
    input_method = data.get('input_method', 'unknown')
    
    if not query:
        raise HTTPException(status_code=400, detail="Query is required")
    
    result = await agent.execute_query(query, input_method)
    return result

@app.get("/api/agent/status")
async def get_agent_status():
    """Get desktop agent status."""
    return agent.get_status()

@app.get("/api/agent/history")
async def get_agent_history(limit: int = 10):
    """Get recent command history."""
    history = agent.get_history(limit)
    return {"history": history}


# ─── WebSocket Endpoints ─────────────────────────────────────────────────────

class ConnectionManager:
    """Manages WebSocket connections."""
    
    def __init__(self):
        self.active_connections: Dict[str, Dict[str, Any]] = {}
    
    async def connect(self, websocket: WebSocket, client_id: str, input_method: str):
        """Accept and register a new WebSocket connection."""
        await websocket.accept()
        self.active_connections[client_id] = {
            'websocket': websocket,
            'input_method': input_method,
            'connected_at': datetime.utcnow().isoformat()
        }
        logger.info(f"Client {client_id} connected for {input_method}")
    
    def disconnect(self, client_id: str):
        """Remove a WebSocket connection."""
        if client_id in self.active_connections:
            del self.active_connections[client_id]
            logger.info(f"Client {client_id} disconnected")
    
    async def send_message(self, client_id: str, message: Dict[str, Any]):
        """Send a message to a specific client."""
        if client_id in self.active_connections:
            websocket = self.active_connections[client_id]['websocket']
            await websocket.send_json(message)
    
    async def broadcast(self, message: Dict[str, Any], input_method: Optional[str] = None):
        """Broadcast a message to all or specific input method clients."""
        for client_id, conn_data in self.active_connections.items():
            if input_method is None or conn_data['input_method'] == input_method:
                try:
                    await conn_data['websocket'].send_json(message)
                except:
                    logger.error(f"Failed to send to {client_id}")

manager = ConnectionManager()


@app.websocket("/ws/{input_method}/{client_id}")
async def websocket_endpoint(websocket: WebSocket, input_method: str, client_id: str):
    """
    WebSocket endpoint for real-time input processing.
    
    Supported input methods: voice, draw, haptic, sign, eye-gaze, head, facial, sip-puff
    """
    await manager.connect(websocket, client_id, input_method)
    
    try:
        # Send initial connection confirmation
        await websocket.send_json({
            'type': 'connected',
            'input_method': input_method,
            'client_id': client_id,
            'timestamp': datetime.utcnow().isoformat()
        })
        
        # Main message loop
        while True:
            # Receive data from client
            data = await websocket.receive_json()
            message_type = data.get('type')
            
            logger.info(f"Received {message_type} from {client_id} ({input_method})")
            
            # Handle different message types
            if message_type == 'ping':
                await websocket.send_json({'type': 'pong', 'timestamp': datetime.utcnow().isoformat()})
            
            elif message_type == 'execute_query':
                # Execute natural language query
                query = data.get('query')
                if query:
                    result = await agent.execute_query(query, input_method)
                    await websocket.send_json({
                        'type': 'execution_result',
                        'result': result,
                        'timestamp': datetime.utcnow().isoformat()
                    })
            
            elif message_type == 'save_calibration':
                # Save calibration data
                profile_id = data.get('profile_id')
                calibration_data = data.get('data')
                if profile_id and calibration_data:
                    success = calibration_manager.save_calibration(profile_id, input_method, calibration_data)
                    await websocket.send_json({
                        'type': 'calibration_saved',
                        'success': success,
                        'timestamp': datetime.utcnow().isoformat()
                    })
            
            elif message_type == 'save_gesture':
                # Save custom gesture
                profile_id = data.get('profile_id')
                gesture_id = data.get('gesture_id')
                gesture_data = data.get('data')
                if profile_id and gesture_id and gesture_data:
                    gesture_data['type'] = input_method
                    success = gesture_manager.save_gesture(profile_id, gesture_id, gesture_data)
                    await websocket.send_json({
                        'type': 'gesture_saved',
                        'success': success,
                        'gesture_id': gesture_id,
                        'timestamp': datetime.utcnow().isoformat()
                    })
            
            else:
                # Echo unhandled message types for debugging
                await websocket.send_json({
                    'type': 'echo',
                    'original': data,
                    'timestamp': datetime.utcnow().isoformat()
                })
    
    except WebSocketDisconnect:
        manager.disconnect(client_id)
    except Exception as e:
        logger.error(f"WebSocket error for {client_id}: {e}")
        manager.disconnect(client_id)


# ─── Run Server ──────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "server:app",
        host="127.0.0.1",
        port=8000,
        reload=True,
        log_level="info"
    )
