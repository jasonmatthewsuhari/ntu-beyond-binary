"""
Live ASL alphabet demo using a Hugging Face model.

Model: huzaifanasirrr/realtime-sign-language-translator (ResNet18 + MediaPipe)
Pipeline:
1) MediaPipe Hand Landmarker (task file) -> hand bounding box
2) Crop hand region -> ResNet18 classifier (A-Z)
3) Smooth predictions into a raw letter stream
4) Optional: send raw letters to Gemini to infer natural English

Controls:
- q: quit
- g: send buffer to Gemini and show cleaned text
- c: clear buffer
- s: add space
- backspace: delete last character

Requirements (install as needed):
  pip install torch torchvision mediapipe opencv-python pillow numpy huggingface_hub python-dotenv google-generativeai
"""

from __future__ import annotations

import json
import os
import time
from collections import Counter, deque
from pathlib import Path

import cv2
import numpy as np
from dotenv import load_dotenv
from huggingface_hub import hf_hub_download
from PIL import Image

import torch
import torch.nn as nn
from torchvision import models, transforms

import mediapipe as mp
from mediapipe.tasks import python as mp_python
from mediapipe.tasks.python import vision as mp_vision

try:
    import google.generativeai as genai
except Exception:
    genai = None


REPO_ID = "huzaifanasirrr/realtime-sign-language-translator"


class SignLanguageModel(nn.Module):
    def __init__(self, num_classes: int = 26, pretrained: bool = False) -> None:
        super().__init__()
        self.model = models.resnet18(pretrained=pretrained)
        self.model.fc = nn.Sequential(
            nn.Dropout(0.5),
            nn.Linear(512, 512),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(512, num_classes),
        )

    def forward(self, x):
        return self.model(x)


def load_class_mapping(path: str | None) -> dict[int, str]:
    if path and os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            mapping = json.load(f)
        if isinstance(mapping, dict) and "idx_to_class" in mapping:
            return {int(k): v for k, v in mapping["idx_to_class"].items()}
        return {int(k): v for k, v in mapping.items()}
    # Default A-Z
    return {i: chr(65 + i) for i in range(26)}


def clean_text_with_gemini(raw_text: str, model) -> str:
    prompt = (
        "You are interpreting ASL fingerspelling. "
        "Given a stream of letters, infer the intended natural English sentence. "
        "Fix spacing, punctuation, and obvious spelling errors. "
        "Output only the cleaned English sentence.\n\n"
        f"Raw letters: {raw_text}"
    )
    try:
        resp = model.generate_content(prompt)
        return resp.text.strip()
    except Exception as exc:
        return f"Error: {exc}"


def main() -> None:
    load_dotenv()

    # Optional Gemini
    llm = None
    if genai and os.getenv("GOOGLE_API_KEY"):
        genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
        llm = genai.GenerativeModel("gemini-2.0-flash")

    # Download model artifacts from HF (cached)
    model_path = hf_hub_download(repo_id=REPO_ID, filename="best_model.pth")
    mediapipe_path = hf_hub_download(repo_id=REPO_ID, filename="hand_landmarker.task")
    class_map_path = hf_hub_download(repo_id=REPO_ID, filename="class_mapping.json")

    idx_to_class = load_class_mapping(class_map_path)

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = SignLanguageModel(num_classes=26)
    checkpoint = torch.load(model_path, map_location=device)
    model.load_state_dict(checkpoint["model_state_dict"])
    model.to(device)
    model.eval()

    preprocess = transforms.Compose(
        [
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(
                mean=[0.485, 0.456, 0.406],
                std=[0.229, 0.224, 0.225],
            ),
        ]
    )

    # MediaPipe Hand Landmarker (VIDEO mode)
    base_options = mp_python.BaseOptions(model_asset_path=mediapipe_path)
    options = mp_vision.HandLandmarkerOptions(
        base_options=base_options,
        running_mode=mp_vision.RunningMode.VIDEO,
        num_hands=1,
    )
    hands = mp_vision.HandLandmarker.create_from_options(options)

    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Error: Could not open webcam.")
        return

    # Smoothing and debounce
    pred_window = deque(maxlen=8)
    last_added = ""
    last_add_time = 0.0
    add_cooldown = 0.9
    conf_threshold = 0.7
    stable_ratio = 0.7

    last_hand_time = time.time()
    gap_for_space = 1.4

    raw_buffer = ""
    cleaned_text = ""

    timestamp_ms = 0

    print("[ASL HF Demo] Press q to quit, g to send to Gemini, or close the window.")

    window_name = "ASL HF Demo"
    cv2.namedWindow(window_name, cv2.WINDOW_NORMAL)

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=frame_rgb)
        results = hands.detect_for_video(mp_image, timestamp_ms)
        timestamp_ms += 33

        current_letter = ""
        current_conf = 0.0
        bbox = None

        if results.hand_landmarks:
            last_hand_time = time.time()
            landmarks = results.hand_landmarks[0]

            h, w = frame.shape[:2]
            x_coords = [lm.x * w for lm in landmarks]
            y_coords = [lm.y * h for lm in landmarks]
            x_min = max(0, int(min(x_coords)) - 40)
            y_min = max(0, int(min(y_coords)) - 40)
            x_max = min(w, int(max(x_coords)) + 40)
            y_max = min(h, int(max(y_coords)) + 40)
            bbox = (x_min, y_min, x_max, y_max)

            hand_crop = frame[y_min:y_max, x_min:x_max]
            if hand_crop.size > 0:
                pil_image = Image.fromarray(cv2.cvtColor(hand_crop, cv2.COLOR_BGR2RGB))
                tensor = preprocess(pil_image).unsqueeze(0).to(device)
                with torch.no_grad():
                    outputs = model(tensor)
                    probs = torch.softmax(outputs, dim=1)
                    top_prob, top_idx = torch.max(probs, dim=1)
                    current_letter = idx_to_class.get(top_idx.item(), "")
                    current_conf = float(top_prob.item())

                if current_letter and current_conf >= conf_threshold:
                    pred_window.append(current_letter)
                    most_common, count = Counter(pred_window).most_common(1)[0]
                    stability = count / len(pred_window)
                    if (
                        stability >= stable_ratio
                        and (time.time() - last_add_time) >= add_cooldown
                        and most_common != last_added
                    ):
                        raw_buffer += most_common
                        last_added = most_common
                        last_add_time = time.time()

        if (time.time() - last_hand_time) > gap_for_space:
            if raw_buffer and not raw_buffer.endswith(" "):
                raw_buffer += " "
            last_hand_time = time.time()

        # UI panel
        ui = np.zeros((frame.shape[0], 520, 3), dtype=np.uint8)
        cv2.putText(ui, "ASL HF DEMO", (20, 40), cv2.FONT_HERSHEY_DUPLEX, 0.9, (255, 255, 255), 2)
        cv2.line(ui, (20, 55), (500, 55), (120, 120, 120), 1)
        cv2.putText(ui, "LETTER:", (20, 90), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (200, 200, 200), 1)
        cv2.putText(ui, f"{current_letter} ({current_conf:.2f})", (120, 90), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
        cv2.putText(ui, "RAW:", (20, 130), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (200, 200, 200), 1)

        raw_lines = []
        line = ""
        for ch in raw_buffer:
            if len(line) < 30:
                line += ch
            else:
                raw_lines.append(line)
                line = ch
        raw_lines.append(line)

        y = 155
        for l in raw_lines[:4]:
            cv2.putText(ui, l, (20, y), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
            y += 28

        cv2.putText(ui, "CLEAN:", (20, y + 10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (200, 200, 200), 1)
        y += 35
        clean_words = cleaned_text.split()
        line = ""
        for w in clean_words:
            if len(line + w) < 28:
                line += w + " "
            else:
                cv2.putText(ui, line, (20, y), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
                y += 28
                line = w + " "
        cv2.putText(ui, line, (20, y), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)

        if bbox:
            x_min, y_min, x_max, y_max = bbox
            cv2.rectangle(frame, (x_min, y_min), (x_max, y_max), (0, 255, 0), 2)

        combined = np.hstack((frame, ui))
        cv2.imshow(window_name, combined)

        # Allow closing the window with the X button
        if cv2.getWindowProperty(window_name, cv2.WND_PROP_VISIBLE) < 1:
            break

        key = cv2.waitKey(1) & 0xFF
        if key == ord("q"):
            break
        if key == ord("g"):
            if llm:
                cleaned_text = clean_text_with_gemini(raw_buffer, llm)
            else:
                cleaned_text = "Gemini not configured (missing GOOGLE_API_KEY)."
        if key == ord("c"):
            raw_buffer = ""
            cleaned_text = ""
        if key == ord("s"):
            raw_buffer += " "
        if key == 8:
            raw_buffer = raw_buffer[:-1]

    cap.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    main()
