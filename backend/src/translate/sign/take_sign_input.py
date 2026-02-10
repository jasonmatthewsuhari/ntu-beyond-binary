import os
import time
import google.generativeai as genai
from dotenv import load_dotenv
import cv2
from PIL import Image
import io
import numpy as np

# Optional Mediapipe import with robust error handling
MEDIAPIPE_AVAILABLE = False
try:
    import mediapipe as mp
    try:
        mp_hands = mp.solutions.hands
        mp_draw = mp.solutions.drawing_utils
        hands = mp_hands.Hands(
            static_image_mode=False,
            max_num_hands=2,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )
        MEDIAPIPE_AVAILABLE = True
    except AttributeError:
        # Some versions of mediapipe (especially on Windows 3.11) 
        # have deprecated the 'solutions' path or installed it differently.
        pass
except ImportError:
    pass

load_dotenv()

def translate_sign_to_english(video_path: str) -> str:
    """
    Translates sign language from a video file into natural English using Gemini.
    """
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        return "Error: GOOGLE_API_KEY not found."

    genai.configure(api_key=api_key)
    
    try:
        if not os.path.exists(video_path):
            return f"Error: Video file not found at {video_path}"

        model = genai.GenerativeModel("gemini-2.0-flash")
        
        print(f"Uploading video: {video_path}...")
        video_file = genai.upload_file(path=video_path)
        
        while video_file.state.name == "PROCESSING":
            print("Processing video...")
            time.sleep(2)
            video_file = genai.get_file(video_file.name)

        if video_file.state.name == "FAILED":
            return "Error: Video processing failed."

        prompt = """
        You are an expert American Sign Language (ASL) and global sign language interpreter.
        Analyze the provided video and translate the signs into natural, correct, and conversational English sentences.
        Ensure the output is grammatically correct English, not just a list of glosses.
        Provide only the translated English text.
        """
        
        response = model.generate_content([video_file, prompt])
        genai.delete_file(video_file.name)
        
        return response.text.strip()
        
    except Exception as e:
        return f"Error during sign language translation: {str(e)}"

def translate_sign_stream():
    """
    Captures video from the camera, tracks hands if possible, 
    and translates sign language in real-time using Gemini.
    """
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        print("Error: GOOGLE_API_KEY not found.")
        return

    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-2.0-flash")
    
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Error: Could not open webcam.")
        return

    print("\n[SIGN STREAM] Beyond Binary: Advanced Sign Language Interpreter")
    if MEDIAPIPE_AVAILABLE:
        print("[SIGN STREAM] Hand Tracking: ACTIVE (Skeleton Overlay enabled)")
    else:
        print("[SIGN STREAM] Hand Tracking: FALLBACK (Full-frame analysis enabled)")
    print("[SIGN STREAM] Press 'q' to quit.")

    crop_buffer = []
    last_translation_time = time.time()
    translation_interval = 3  # Seconds between translations
    current_translation = "Waiting for signs..."
    status_text = "Scanning for hands..."
    
    gui_supported = True

    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                break

            h, w, c = frame.shape
            
            # Create a "Blackboard" for the UI
            blackboard = np.zeros((h, 600, 3), dtype=np.uint8)
            cv2.putText(blackboard, "BEYOND BINARY", (50, 50), cv2.FONT_HERSHEY_DUPLEX, 1.2, (255, 255, 255), 2)
            cv2.line(blackboard, (20, 70), (580, 70), (100, 100, 100), 1)
            
            hand_detected = False
            
            if MEDIAPIPE_AVAILABLE:
                rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                results = hands.process(rgb_frame)
                
                if results.multi_hand_landmarks:
                    hand_detected = True
                    status_text = "Hands Detected - Interpreting..."
                    
                    min_x, min_y = w, h
                    max_x, max_y = 0, 0
                    
                    for hand_landmarks in results.multi_hand_landmarks:
                        mp_draw.draw_landmarks(frame, hand_landmarks, mp_hands.HAND_CONNECTIONS)
                        for lm in hand_landmarks.landmark:
                            cx, cy = int(lm.x * w), int(lm.y * h)
                            min_x, min_y = min(min_x, cx), min(min_y, cy)
                            max_x, max_y = max(max_x, cx), max(max_y, cy)
                    
                    padding = 50
                    min_x, min_y = max(0, min_x - padding), max(0, min_y - padding)
                    max_x, max_y = min(w, max_x + padding), min(h, max_y + padding)
                    
                    hand_crop = frame[min_y:max_y, min_x:max_x]
                    if hand_crop.size > 0:
                        hand_crop_rgb = cv2.cvtColor(hand_crop, cv2.COLOR_BGR2RGB)
                        pil_crop = Image.fromarray(hand_crop_rgb)
                        
                        if len(crop_buffer) < 10:
                            crop_buffer.append(pil_crop)
                        else:
                            crop_buffer.pop(0)
                            crop_buffer.append(pil_crop)
                else:
                    status_text = "Searching for hands..."
            else:
                # Fallback: Just use the center of the frame as the "hand area" 
                # or send the whole frame. Gemini 2.0 is smart enough.
                hand_detected = True # Force translation interval to run
                status_text = "AI Vision: Scanning Scene..."
                
                rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                pil_frame = Image.fromarray(rgb_frame)
                
                if len(crop_buffer) < 5:
                    crop_buffer.append(pil_frame)
                else:
                    crop_buffer.pop(0)
                    crop_buffer.append(pil_frame)

            # UI: Status and Translation
            cv2.putText(blackboard, "STATUS:", (30, 130), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (200, 200, 200), 1)
            cv2.putText(blackboard, status_text, (30, 160), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0) if hand_detected else (0, 0, 255), 2)
            
            cv2.putText(blackboard, "TRANSLATION:", (30, 250), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (200, 200, 200), 1)
            
            # Wrap text for the blackboard
            y0, dy = 300, 35
            words = current_translation.split()
            line = ""
            for word in words:
                if len(line + word) < 30:
                    line += word + " "
                else:
                    cv2.putText(blackboard, line, (30, y0), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (255, 255, 255), 2)
                    y0 += dy
                    line = word + " "
            cv2.putText(blackboard, line, (30, y0), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (255, 255, 255), 2)

            # Periodically translate the buffer
            if hand_detected and time.time() - last_translation_time > translation_interval:
                last_translation_time = time.time()
                
                def get_translation(frames):
                    nonlocal current_translation
                    try:
                        prompt = """
                        You are a professional sign language interpreter. 
                        I am providing a sequence of frames from a camera.
                        Translate the gestures into a single, natural English sentence.
                        If you don't see any clear gestures, say "No clear signs detected".
                        Only output the translated text.
                        """
                        response = model.generate_content([*frames, prompt])
                        current_translation = response.text.strip()
                        print(f"\r[AI] Predicted: {current_translation} ", end="", flush=True)
                    except Exception as e:
                        pass

                import threading
                threading.Thread(target=get_translation, args=(crop_buffer.copy(),)).start()

            # Combine frame and blackboard
            res = np.hstack((frame, blackboard))

            if gui_supported:
                try:
                    cv2.imshow('Beyond Binary: Sign Language Interpreter', res)
                    if cv2.waitKey(1) & 0xFF == ord('q'):
                        break
                except cv2.error:
                    gui_supported = False
            
            if not gui_supported:
                time.sleep(0.01)

    except KeyboardInterrupt:
        print("\n[SIGN STREAM] Session Ended.")
    finally:
        cap.release()
        if gui_supported:
            try:
                cv2.destroyAllWindows()
            except:
                pass

if __name__ == "__main__":
    translate_sign_stream()
