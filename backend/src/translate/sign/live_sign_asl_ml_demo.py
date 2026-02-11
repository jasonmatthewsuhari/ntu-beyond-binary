"""
Live ASL fingerspelling demo using smart_gestures + MediaPipe Hands.

Pipeline:
1) MediaPipe Hands -> 21 landmarks
2) smart_gestures ASL model -> letter + confidence
3) Buffer letters into a raw string
4) On demand, send raw string to Gemini to infer natural English

Controls:
- q: quit
- g: send buffer to Gemini and show cleaned text
- c: clear buffer
- s: add space
- backspace: delete last character
"""

import os
import time
from collections import Counter, deque

import cv2
import numpy as np
from dotenv import load_dotenv
import google.generativeai as genai

import mediapipe as mp
from smart_gestures.alphabet.asl_model import ASLModel, get_classes


def landmarks_from_hand(hand_landmarks):
    """Convert MediaPipe landmarks to smart_gestures format."""
    return [{"x": lm.x, "y": lm.y, "z": lm.z} for lm in hand_landmarks.landmark]


def clean_text_with_gemini(raw_text, model):
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


def main():
    load_dotenv()
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        print("Error: GOOGLE_API_KEY not found in environment or .env")
        return

    genai.configure(api_key=api_key)
    llm = genai.GenerativeModel("gemini-2.0-flash")

    # Initialize ASL model
    _ = get_classes()
    asl_model = ASLModel()

    mp_hands = mp.solutions.hands
    hands = mp_hands.Hands(
        static_image_mode=False,
        max_num_hands=1,
        min_detection_confidence=0.6,
        min_tracking_confidence=0.6,
    )

    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Error: Could not open webcam.")
        return

    # Letter smoothing and debounce
    pred_window = deque(maxlen=8)
    last_added = ""
    last_add_time = 0.0
    add_cooldown = 0.9
    conf_threshold = 0.7
    stable_ratio = 0.7

    # Word boundary by silence
    last_hand_time = time.time()
    gap_for_space = 1.4

    raw_buffer = ""
    cleaned_text = ""

    print("[ASL ML Demo] Press q to quit, g to send to Gemini, or close the window.")

    window_name = "ASL ML Demo"
    cv2.namedWindow(window_name, cv2.WINDOW_NORMAL)

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = hands.process(rgb)

        current_letter = ""
        current_conf = 0.0
        hand_found = False

        if results.multi_hand_landmarks:
            hand_found = True
            last_hand_time = time.time()
            hand_landmarks = results.multi_hand_landmarks[0]
            landmarks = landmarks_from_hand(hand_landmarks)

            try:
                pred, conf = asl_model.predict(landmarks)
                current_letter = str(pred)
                current_conf = float(conf)
            except Exception:
                current_letter = ""
                current_conf = 0.0

            # Smoothing window
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

        # Add space after a brief pause with no hand
        if not hand_found and (time.time() - last_hand_time) > gap_for_space:
            if raw_buffer and not raw_buffer.endswith(" "):
                raw_buffer += " "
            last_hand_time = time.time()

        # UI panel
        ui = np.zeros((frame.shape[0], 520, 3), dtype=np.uint8)
        cv2.putText(ui, "ASL ML DEMO", (20, 40), cv2.FONT_HERSHEY_DUPLEX, 0.9, (255, 255, 255), 2)
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

        combined = np.hstack((frame, ui))
        cv2.imshow(window_name, combined)

        # Allow closing the window with the X button
        if cv2.getWindowProperty(window_name, cv2.WND_PROP_VISIBLE) < 1:
            break

        key = cv2.waitKey(1) & 0xFF
        if key == ord("q"):
            break
        if key == ord("g"):
            cleaned_text = clean_text_with_gemini(raw_buffer, llm)
        if key == ord("c"):
            raw_buffer = ""
            cleaned_text = ""
        if key == ord("s"):
            raw_buffer += " "
        if key == 8:  # backspace
            raw_buffer = raw_buffer[:-1]

    cap.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    main()
