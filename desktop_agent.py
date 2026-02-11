"""
Desktop Agent — Vision-driven desktop automation using AI
Supports both Google Gemini and OpenAI GPT-4 Vision
"""

import os
import time
import base64
from io import BytesIO
from typing import Optional, Literal
import pyautogui
from PIL import Image, ImageDraw, ImageFont

# Check which AI provider to use
AI_PROVIDER = os.getenv("AI_PROVIDER", "gemini").lower()  # "gemini" or "openai"

if AI_PROVIDER == "openai":
    import openai
    openai.api_key = os.getenv("OPENAI_API_KEY")
    if not openai.api_key:
        raise ValueError("OPENAI_API_KEY not found in environment. Please set it in .env file.")
else:  # Default to Gemini
    import google.generativeai as genai
    GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
    if not GOOGLE_API_KEY:
        raise ValueError("GOOGLE_API_KEY not found in environment. Please set it in .env file.")
    genai.configure(api_key=GOOGLE_API_KEY)


class DesktopAgent:
    """
    Vision-driven desktop automation agent.
    Takes screenshots, overlays coordinate grid, asks AI what to do next,
    executes actions (click, type, scroll, etc.).
    """
    
    def __init__(
        self,
        model: str = "gemini-2.0-flash-exp",
        max_steps: int = 50,
        grid_spacing: int = 100,
        action_delay: float = 1.5,
        save_screenshots: bool = False,
    ):
        self.model_name = model
        self.max_steps = max_steps
        self.grid_spacing = grid_spacing
        self.action_delay = action_delay
        self.save_screenshots = save_screenshots
        self.step_count = 0
        
        # Initialize AI model
        if AI_PROVIDER == "openai":
            self.model = None  # OpenAI uses API calls directly
            print(f"🤖 Using OpenAI GPT-4 Vision")
        else:
            self.model = genai.GenerativeModel(model_name=model)
            print(f"🤖 Using Google Gemini: {model}")
        
        # Fail-safe: move mouse to top-left to abort
        pyautogui.FAILSAFE = True
        pyautogui.PAUSE = 0.5
    
    def run(self, task: str) -> str:
        """
        Execute a natural language task.
        
        Args:
            task: Natural language description of what to do
            
        Returns:
            Final result/status message
        """
        print(f"\n🎯 Task: {task}\n")
        print("=" * 60)
        
        for step in range(1, self.max_steps + 1):
            self.step_count = step
            print(f"\n📸 Step {step}/{self.max_steps}")
            
            # Take screenshot with coordinate grid
            screenshot = self._capture_screen_with_grid()
            
            # Ask AI what to do next
            action = self._get_next_action(task, screenshot, step)
            
            # Parse and execute action
            if action.lower().startswith("done"):
                result = action[5:].strip() or "Task completed"
                print(f"\n✅ {result}")
                return result
            
            if action.lower().startswith("error"):
                error = action[6:].strip() or "Task failed"
                print(f"\n❌ {error}")
                return error
            
            # Execute the action
            self._execute_action(action)
            
            # Wait for UI to respond
            time.sleep(self.action_delay)
        
        print(f"\n⚠️  Maximum steps ({self.max_steps}) reached")
        return f"Task incomplete after {self.max_steps} steps"
    
    def _capture_screen_with_grid(self) -> Image.Image:
        """Capture screenshot and overlay coordinate grid."""
        screenshot = pyautogui.screenshot()
        
        # Draw coordinate grid
        draw = ImageDraw.Draw(screenshot)
        width, height = screenshot.size
        
        # Try to load a font, fall back to default if not available
        try:
            font = ImageFont.truetype("arial.ttf", 14)
        except:
            font = ImageFont.load_default()
        
        # Draw vertical lines
        for x in range(0, width, self.grid_spacing):
            draw.line([(x, 0), (x, height)], fill=(255, 0, 0, 128), width=1)
            draw.text((x + 2, 2), str(x), fill=(255, 0, 0), font=font)
        
        # Draw horizontal lines
        for y in range(0, height, self.grid_spacing):
            draw.line([(0, y), (width, y)], fill=(255, 0, 0, 128), width=1)
            draw.text((2, y + 2), str(y), fill=(255, 0, 0), font=font)
        
        # Save if requested
        if self.save_screenshots:
            screenshot.save(f"screenshot_step_{self.step_count}.png")
            print(f"  💾 Saved screenshot_step_{self.step_count}.png")
        
        return screenshot
    
    def _get_next_action(self, task: str, screenshot: Image.Image, step: int) -> str:
        """
        Ask AI what action to take next based on the screenshot.
        
        Returns:
            Action string (e.g., "CLICK 500 300", "TYPE hello", "DONE task completed")
        """
        # Convert image to base64
        buffer = BytesIO()
        screenshot.save(buffer, format="PNG")
        image_b64 = base64.b64encode(buffer.getvalue()).decode()
        
        # Build prompt
        prompt = f"""You are a desktop automation agent. Your task: {task}

Current step: {step}
The screenshot shows the current desktop state with a RED coordinate grid overlay.

Available actions:
- CLICK X Y - Click at coordinates (use grid numbers)
- DOUBLE_CLICK X Y - Double click at coordinates
- RIGHT_CLICK X Y - Right click at coordinates
- TYPE text - Type the text (use quotes if spaces)
- PRESS key - Press a key (enter, tab, esc, ctrl+c, alt+f4, etc.)
- SCROLL direction amount - Scroll up/down/left/right (e.g., SCROLL down 3)
- WAIT seconds - Wait for a specific amount of time
- DONE message - Task completed successfully
- ERROR message - Task failed or impossible

Instructions:
1. Look at the current screenshot
2. Determine the next action to complete the task
3. Respond with ONLY the action command (e.g., "CLICK 500 300" or "TYPE hello world")
4. Use the RED grid coordinates visible in the screenshot
5. Be precise with coordinates - check the grid numbers
6. If the task is complete, respond with "DONE task completed"
7. If the task is impossible, respond with "ERROR reason"

What's the next action?"""
        
        if AI_PROVIDER == "openai":
            return self._call_openai(prompt, image_b64)
        else:
            return self._call_gemini(prompt, screenshot)
    
    def _call_gemini(self, prompt: str, screenshot: Image.Image) -> str:
        """Call Google Gemini API."""
        try:
            response = self.model.generate_content([prompt, screenshot])
            action = response.text.strip()
            print(f"  🤖 AI says: {action}")
            return action
        except Exception as e:
            print(f"  ❌ Gemini API error: {e}")
            return f"ERROR Gemini API failed: {e}"
    
    def _call_openai(self, prompt: str, image_b64: str) -> str:
        """Call OpenAI GPT-4 Vision API."""
        try:
            response = openai.chat.completions.create(
                model="gpt-4-vision-preview",  # or "gpt-4o" if available
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": prompt},
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": f"data:image/png;base64,{image_b64}"
                                }
                            }
                        ]
                    }
                ],
                max_tokens=300
            )
            action = response.choices[0].message.content.strip()
            print(f"  🤖 AI says: {action}")
            return action
        except Exception as e:
            print(f"  ❌ OpenAI API error: {e}")
            return f"ERROR OpenAI API failed: {e}"
    
    def _execute_action(self, action: str):
        """Execute the action command."""
        parts = action.split(maxsplit=2)
        command = parts[0].upper()
        
        try:
            if command == "CLICK":
                x, y = int(parts[1]), int(parts[2])
                print(f"  🖱️  Clicking at ({x}, {y})")
                pyautogui.click(x, y)
            
            elif command == "DOUBLE_CLICK":
                x, y = int(parts[1]), int(parts[2])
                print(f"  🖱️  Double-clicking at ({x}, {y})")
                pyautogui.doubleClick(x, y)
            
            elif command == "RIGHT_CLICK":
                x, y = int(parts[1]), int(parts[2])
                print(f"  🖱️  Right-clicking at ({x}, {y})")
                pyautogui.rightClick(x, y)
            
            elif command == "TYPE":
                text = " ".join(parts[1:]).strip('"').strip("'")
                print(f"  ⌨️  Typing: {text}")
                pyautogui.write(text, interval=0.05)
            
            elif command == "PRESS":
                key = parts[1].lower()
                print(f"  ⌨️  Pressing: {key}")
                # Handle special key combinations
                if "+" in key:
                    keys = key.split("+")
                    pyautogui.hotkey(*keys)
                else:
                    pyautogui.press(key)
            
            elif command == "SCROLL":
                direction = parts[1].lower()
                amount = int(parts[2]) if len(parts) > 2 else 3
                print(f"  🔄 Scrolling {direction} by {amount}")
                if direction in ["up", "down"]:
                    scroll_amount = amount * 100 if direction == "up" else -amount * 100
                    pyautogui.scroll(scroll_amount)
                elif direction in ["left", "right"]:
                    # Horizontal scroll (not all systems support this)
                    pyautogui.hscroll(amount if direction == "right" else -amount)
            
            elif command == "WAIT":
                seconds = float(parts[1])
                print(f"  ⏳ Waiting {seconds} seconds")
                time.sleep(seconds)
            
            else:
                print(f"  ⚠️  Unknown command: {command}")
        
        except Exception as e:
            print(f"  ❌ Error executing action: {e}")
