# Live ASL-focused sign language demo (webcam -> Gemini translation)
# - Uses MediaPipe Hand Landmarker (Tasks API, live stream mode) if available
# - Falls back to full-frame analysis if MediaPipe is unavailable
# - Translates a short rolling window of frames into natural English
# - Shows language hint + confidence
#
# Usage:
#   python backend/src/translate/sign/live_sign_demo.py
#
# Requirements (install as needed):
#   pip install opencv-python pillow numpy google-generativeai mediapipe python-dotenv
#
# MediaPipe model:
#   Download a Hand Landmarker task file (e.g., hand_landmarker.task)
#   and set HAND_LANDMARKER_MODEL to its path, or place it next to this script.
#
# Environment:
#   GOOGLE_API_KEY in .env or environment

import json
import os
import time
import threading
from collections import deque

import cv2
import numpy as np
from PIL import Image
import google.generativeai as genai
from dotenv import load_dotenv

# ---------------------------
# MediaPipe Hand Landmarker (Tasks API)
# ---------------------------
MEDIAPIPE_AVAILABLE = False
try:
    import mediapipe as mp
    from mediapipe.tasks import python as mp_python
    from mediapipe.tasks.python import vision as mp_vision
    MEDIAPIPE_AVAILABLE = True
except Exception:
    MEDIAPIPE_AVAILABLE = False


class HandTracker:
    def __init__(self, model_path: str):
        self._lock = threading.Lock()
        self._last_bbox = None  # (min_x, min_y, max_x, max_y) in pixel coords

        base_options = mp_python.BaseOptions(model_asset_path=model_path)
        options = mp_vision.HandLandmarkerOptions(
            base_options=base_options,
            running_mode=mp_vision.RunningMode.LIVE_STREAM,
            num_hands=2,
            min_hand_detection_confidence=0.5,
            min_hand_presence_confidence=0.5,
            min_tracking_confidence=0.5,
            result_callback=self._on_result,
        )
        self._landmarker = mp_vision.HandLandmarker.create_from_options(options)

    def _on_result(self, result, output_image, timestamp_ms):
        # Compute bounding box from hand landmarks (normalized -> pixel)
        if not result.hand_landmarks:
            with self._lock:
                self._last_bbox = None
            return

        img_h = output_image.height
        img_w = output_image.width
        min_x, min_y = img_w, img_h
        max_x, max_y = 0, 0

        for hand_landmarks in result.hand_landmarks:
            for lm in hand_landmarks:
                x = int(lm.x * img_w)
                y = int(lm.y * img_h)
                min_x, min_y = min(min_x, x), min(min_y, y)
                max_x, max_y = max(max_x, x), max(max_y, y)

        if max_x <= min_x or max_y <= min_y:
            bbox = None
        else:
            pad = 60
            min_x = max(0, min_x - pad)
            min_y = max(0, min_y - pad)
            max_x = min(img_w, max_x + pad)
            max_y = min(img_h, max_y + pad)
            bbox = (min_x, min_y, max_x, max_y)

        with self._lock:
            self._last_bbox = bbox

    def detect_async(self, frame_rgb, timestamp_ms: int):
        mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=frame_rgb)
        self._landmarker.detect_async(mp_image, timestamp_ms)

    def get_last_bbox(self):
        with self._lock:
            return self._last_bbox

    def close(self):
        self._landmarker.close()


# ---------------------------
# Gemini translation
# ---------------------------

def translate_frames(frames, model):
    prompt = (
        "You are a professional sign language interpreter. "
        "You will receive a short sequence of video frames of a signer. "
        "Primary target is ASL. If you are confident it is another sign language, "
        "set lang_guess accordingly; otherwise set lang_guess to ASL. "
        "Return JSON only with keys: translation (string), lang_guess (string), confidence (0-1). "
        "Translation must be a single, natural English sentence. "
        "If you do not see clear signs, set translation to 'No clear signs detected'."
    )
    try:
        response = model.generate_content([*frames, prompt])
        text = response.text.strip()
        data = json.loads(text)
        translation = str(data.get("translation", "")).strip()
        lang_guess = str(data.get("lang_guess", "ASL")).strip()
        confidence = float(data.get("confidence", 0.0))
        return translation, lang_guess, confidence
    except Exception:
        # Fallback: just return raw text if JSON parsing fails
        try:
            return response.text.strip(), "ASL", 0.3
        except Exception as e:
            return f"Error: {e}", "ASL", 0.0


# ---------------------------
# Main loop
# ---------------------------

def main():
    load_dotenv()
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        print("Error: GOOGLE_API_KEY not found in environment or .env")
        return

    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-2.0-flash")

    # Hand Landmarker model path
    model_path = os.getenv("HAND_LANDMARKER_MODEL")
    if not model_path:
        # Default to local file next to this script
        model_path = os.path.join(os.path.dirname(__file__), "hand_landmarker.task")

    tracker = None
    if MEDIAPIPE_AVAILABLE and os.path.exists(model_path):
        tracker = HandTracker(model_path)
        print("[Live Sign Demo] MediaPipe Hand Landmarker: ACTIVE")
    elif MEDIAPIPE_AVAILABLE:
        print("[Live Sign Demo] MediaPipe available but model not found.")
        print(f"[Live Sign Demo] Expected model at: {model_path}")
        print("[Live Sign Demo] Falling back to full-frame analysis.")
    else:
        print("[Live Sign Demo] MediaPipe not available. Falling back to full-frame analysis.")

    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Error: Could not open webcam.")
        return

    print("[Live Sign Demo] Press 'q' to quit or close the window.")

    window_name = "Live Sign Demo"
    cv2.namedWindow(window_name, cv2.WINDOW_NORMAL)

    # Clip-based translation settings
    frame_buffer = deque(maxlen=24)  # ~0.8s at 30fps
    last_translate = time.time()
    translate_interval = 2.5  # seconds between clip translations
    translating = False

    current_translation = "Waiting for signs..."
    current_lang = "ASL"
    current_conf = 0.0
    hint_text = ""

    def async_translate(frames_copy):
        nonlocal current_translation, current_lang, current_conf, translating, hint_text
        translation, lang_guess, conf = translate_frames(frames_copy, model)
        current_translation = translation
        current_lang = lang_guess
        current_conf = conf
        if conf < 0.5:
            hint_text = "Low confidence — try slower, clearer signing."
        else:
            hint_text = ""
        translating = False

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        timestamp_ms = int(time.time() * 1000)
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        # Feed tracker (live stream)
        if tracker:
            tracker.detect_async(frame_rgb, timestamp_ms)

        # Crop around hands if we have a bbox
        bbox = tracker.get_last_bbox() if tracker else None
        if bbox:
            min_x, min_y, max_x, max_y = bbox
            crop = frame[min_y:max_y, min_x:max_x]
        else:
            crop = frame

        crop_rgb = cv2.cvtColor(crop, cv2.COLOR_BGR2RGB)
        pil = Image.fromarray(crop_rgb)
        frame_buffer.append(pil)

        # Periodic translation (clip-based)
        if not translating and time.time() - last_translate > translate_interval and len(frame_buffer) >= 12:
            last_translate = time.time()
            translating = True
            # Sample every other frame to reduce payload size
            frames_copy = list(frame_buffer)[::2]
            threading.Thread(target=async_translate, args=(frames_copy,), daemon=True).start()

        # UI panel
        ui = np.zeros((frame.shape[0], 520, 3), dtype=np.uint8)
        cv2.putText(ui, "BEYOND BINARY - LIVE SIGN", (20, 40), cv2.FONT_HERSHEY_DUPLEX, 0.9, (255, 255, 255), 2)
        cv2.line(ui, (20, 55), (500, 55), (120, 120, 120), 1)
        cv2.putText(ui, "STATUS:", (20, 90), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (200, 200, 200), 1)
        status = "Hands tracked" if bbox else "Full-frame analysis"
        cv2.putText(ui, status, (20, 115), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
        cv2.putText(ui, "LANG:", (20, 150), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (200, 200, 200), 1)
        cv2.putText(ui, f"{current_lang} ({current_conf:.2f})", (80, 150), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
        cv2.putText(ui, "TRANSLATION:", (20, 185), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (200, 200, 200), 1)
        if hint_text:
            cv2.putText(ui, hint_text, (20, 210), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (0, 200, 255), 1)

        # Word wrap translation
        y = 240 if hint_text else 220
        line = ""
        for word in current_translation.split():
            if len(line + word) < 28:
                line += word + " "
            else:
                cv2.putText(ui, line, (20, y), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)
                y += 30
                line = word + " "
        cv2.putText(ui, line, (20, y), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)

        combined = np.hstack((frame, ui))
        cv2.imshow(window_name, combined)

        # Allow closing the window with the X button
        if cv2.getWindowProperty(window_name, cv2.WND_PROP_VISIBLE) < 1:
            break

        if cv2.waitKey(1) & 0xFF == ord("q"):
            break

    cap.release()
    cv2.destroyAllWindows()
    if tracker:
        tracker.close()


if __name__ == "__main__":
    main()
