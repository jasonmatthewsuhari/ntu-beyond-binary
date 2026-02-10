import asyncio
import sys
from translate.haptic.take_haptic_input import translate_haptic_to_english
from translate.sign.take_sign_input import translate_sign_to_english, translate_sign_stream
from translate.text.take_text_input import translate_text_to_english
from translate.voice.take_voice_input import translate_voice_to_english

async def run_demo():
    print("\n=== Beyond Binary: Accessibility Translation Demo ===")
    print("1. Text Translation (Auto-correct)")
    print("2. Haptic Translation (Morse-like)")
    print("3. Sign Language Translation (Webcam Stream)")
    print("4. Voice Translation (Audio File)")
    print("5. Exit")
    
    choice = input("\nSelect an option (1-5): ")
    
    if choice == "1":
        raw_text = "hw r u? i nd hlp"
        print(f"\n[TEXT INPUT]: {raw_text}")
        print(f"[ENGLISH]: {translate_text_to_english(raw_text)}")
    elif choice == "2":
        haptic_pattern = "... --- ..."
        print(f"\n[HAPTIC INPUT]: {haptic_pattern}")
        print(f"[ENGLISH]: {translate_haptic_to_english(haptic_pattern)}")
    elif choice == "3":
        print("\nStarting Sign Language Streaming... (Press 'q' in the window to stop)")
        translate_sign_stream()
    elif choice == "4":
        print("\n[VOICE INPUT]: Requires an audio file path (not yet implemented in demo menu)")
    elif choice == "5":
        sys.exit()
    else:
        print("Invalid choice.")

if __name__ == "__main__":
    while True:
        asyncio.run(run_demo())
