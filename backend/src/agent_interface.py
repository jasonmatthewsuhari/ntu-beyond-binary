"""
Interface to the desktop agent for executing natural language queries.
"""

import subprocess
import asyncio
from typing import Dict, Any, Optional
from queue import Queue
from threading import Thread, Lock
import logging
from datetime import datetime
import sys
from pathlib import Path

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DesktopAgentInterface:
    """Interface to execute natural language queries via the desktop agent."""
    
    def __init__(self, agent_path: str = "agent.py"):
        self.agent_path = Path(agent_path)
        self.command_queue = Queue()
        self.is_running = False
        self.current_task = None
        self.task_lock = Lock()
        self.worker_thread = None
        self.context_history = []
        self.max_history = 10
    
    def start(self):
        """Start the agent interface worker thread."""
        if self.is_running:
            logger.warning("Agent interface already running")
            return
        
        self.is_running = True
        self.worker_thread = Thread(target=self._worker, daemon=True)
        self.worker_thread.start()
        logger.info("Desktop agent interface started")
    
    def stop(self):
        """Stop the agent interface."""
        self.is_running = False
        if self.worker_thread:
            self.worker_thread.join(timeout=5)
        logger.info("Desktop agent interface stopped")
    
    def _worker(self):
        """Worker thread to process commands sequentially."""
        import time
        while self.is_running:
            try:
                # Get command from queue (with timeout to check is_running)
                if not self.command_queue.empty():
                    command_data = self.command_queue.get(timeout=1)
                    self._execute_command(command_data)
                else:
                    time.sleep(0.1)
            except Exception as e:
                logger.error(f"Error in worker thread: {e}")
    
    def _execute_command(self, command_data: Dict[str, Any]):
        """Execute a single command via the desktop agent."""
        query = command_data['query']
        callback = command_data.get('callback')
        input_method = command_data.get('input_method', 'unknown')
        
        with self.task_lock:
            self.current_task = {
                'query': query,
                'input_method': input_method,
                'started_at': datetime.utcnow().isoformat()
            }
        
        try:
            # Add context from history if available
            context_query = self._build_contextual_query(query)
            
            # Execute agent.py with the query
            logger.info(f"Executing query from {input_method}: {query}")
            
            # Build command
            cmd = [
                sys.executable,
                str(self.agent_path),
                context_query,
                "--max-steps", "50",
                "--delay", "1.5"
            ]
            
            # Execute with timeout
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=120  # 2 minute timeout
            )
            
            # Parse result
            success = result.returncode == 0
            output = result.stdout if success else result.stderr
            
            # Add to context history
            self._add_to_history(query, output, success)
            
            response = {
                'success': success,
                'query': query,
                'output': output,
                'input_method': input_method,
                'completed_at': datetime.utcnow().isoformat()
            }
            
            logger.info(f"Command completed: {success}")
            
            # Call callback if provided
            if callback:
                callback(response)
            
        except subprocess.TimeoutExpired:
            logger.error(f"Command timeout: {query}")
            response = {
                'success': False,
                'query': query,
                'output': 'Command execution timed out',
                'error': 'timeout',
                'input_method': input_method
            }
            if callback:
                callback(response)
        
        except Exception as e:
            logger.error(f"Command execution error: {e}")
            response = {
                'success': False,
                'query': query,
                'output': str(e),
                'error': 'execution_error',
                'input_method': input_method
            }
            if callback:
                callback(response)
        
        finally:
            with self.task_lock:
                self.current_task = None
    
    def _build_contextual_query(self, query: str) -> str:
        """Build a query with context from recent history."""
        if not self.context_history:
            return query
        
        # Add context hint for the agent
        recent = self.context_history[-3:]  # Last 3 commands
        context = "; ".join([h['query'] for h in recent if h['success']])
        
        if context:
            return f"{query} (Previous context: {context})"
        return query
    
    def _add_to_history(self, query: str, output: str, success: bool):
        """Add command to context history."""
        self.context_history.append({
            'query': query,
            'output': output[:200],  # Truncate output
            'success': success,
            'timestamp': datetime.utcnow().isoformat()
        })
        
        # Trim history
        if len(self.context_history) > self.max_history:
            self.context_history = self.context_history[-self.max_history:]
    
    async def execute_query(
        self,
        query: str,
        input_method: str = 'unknown',
        callback: Optional[callable] = None
    ) -> Dict[str, Any]:
        """
        Queue a natural language query for execution.
        
        Args:
            query: Natural language command to execute
            input_method: Source input method (voice, sign, etc.)
            callback: Optional callback function for async notification
        
        Returns:
            Dict with execution status
        """
        if not self.is_running:
            return {
                'success': False,
                'error': 'Agent interface not running',
                'query': query
            }
        
        # Add to queue
        command_data = {
            'query': query,
            'input_method': input_method,
            'callback': callback,
            'queued_at': datetime.utcnow().isoformat()
        }
        
        self.command_queue.put(command_data)
        
        return {
            'success': True,
            'queued': True,
            'queue_size': self.command_queue.qsize(),
            'query': query
        }
    
    def get_status(self) -> Dict[str, Any]:
        """Get current agent status."""
        with self.task_lock:
            return {
                'running': self.is_running,
                'queue_size': self.command_queue.qsize(),
                'current_task': self.current_task,
                'history_size': len(self.context_history)
            }
    
    def clear_queue(self):
        """Clear the command queue."""
        while not self.command_queue.empty():
            try:
                self.command_queue.get_nowait()
            except:
                break
        logger.info("Command queue cleared")
    
    def get_history(self, limit: int = 10) -> list:
        """Get recent command history."""
        return self.context_history[-limit:]


# Global instance
_agent_interface = None

def get_agent_interface() -> DesktopAgentInterface:
    """Get or create the global agent interface instance."""
    global _agent_interface
    if _agent_interface is None:
        _agent_interface = DesktopAgentInterface()
        _agent_interface.start()
    return _agent_interface
