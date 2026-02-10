"""
VLM (Vision Language Model) client for the Desktop Agent.
Wraps the Google Gemini API for multimodal reasoning over screenshots.
"""

import json
import os
import re
from PIL import Image
from google import genai
from google.genai import types


class VLMClient:
    """Client for Gemini VLM with structured JSON output."""

    def __init__(self, model: str = "gemini-2.5-flash"):
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError(
                "GOOGLE_API_KEY is not set. "
                "Please set it in your .env file or environment variables."
            )
        self.client = genai.Client(api_key=api_key)
        self.model = model

    def analyze(
        self,
        system_prompt: str,
        screenshot: Image.Image,
        user_message: str,
    ) -> dict:
        """
        Send a screenshot + message to the VLM and get a structured action response.

        Args:
            system_prompt: The system-level instructions.
            screenshot: Current desktop screenshot as a PIL Image.
            user_message: The user's task + action history.

        Returns:
            Parsed JSON dict with keys: thinking, plan, current_step, action, done, summary.
        """
        response = self.client.models.generate_content(
            model=self.model,
            contents=[screenshot, user_message],
            config=types.GenerateContentConfig(
                system_instruction=system_prompt,
                response_mime_type="application/json",
                temperature=0.2,  # low temp for deterministic actions
            ),
        )

        return self._parse_response(response.text)

    @staticmethod
    def _parse_response(text: str) -> dict:
        """
        Robustly parse the VLM's JSON response.
        Handles cases where the response is wrapped in markdown code blocks,
        or contains minor formatting issues.
        """
        # Strip markdown code fences if present
        cleaned = text.strip()
        if cleaned.startswith("```"):
            # Remove opening fence (possibly ```json)
            cleaned = re.sub(r"^```(?:json)?\s*\n?", "", cleaned)
            # Remove closing fence
            cleaned = re.sub(r"\n?```\s*$", "", cleaned)

        try:
            data = json.loads(cleaned)
        except json.JSONDecodeError as e:
            # Last resort: try to find a JSON object in the text
            match = re.search(r"\{.*\}", cleaned, re.DOTALL)
            if match:
                try:
                    data = json.loads(match.group())
                except json.JSONDecodeError:
                    raise ValueError(
                        f"Could not parse VLM response as JSON:\n{text}"
                    ) from e
            else:
                raise ValueError(
                    f"Could not parse VLM response as JSON:\n{text}"
                ) from e

        # Validate required fields with defaults
        return {
            "thinking": data.get("thinking", ""),
            "plan": data.get("plan", []),
            "current_step": data.get("current_step", 0),
            "action": data.get("action", {"type": "wait", "seconds": 1}),
            "done": data.get("done", False),
            "summary": data.get("summary", None),
        }
