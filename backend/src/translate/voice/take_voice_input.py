import os
import time
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

def translate_voice_to_english(audio_path: str) -> str:
    """
    Translates spoken audio from a file into clear natural English text using Gemini.
    
    Args:
        audio_path (str): The absolute path to the audio file (wav, mp3, etc.).
        
    Returns:
        str: The transcribed and refined English text.
    """
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        return "Error: GOOGLE_API_KEY not found."

    genai.configure(api_key=api_key)
    
    try:
        # Check if file exists
        if not os.path.exists(audio_path):
            return f"Error: Audio file not found at {audio_path}"

        model = genai.GenerativeModel("gemini-2.0-flash")
        
        # Upload the audio file
        print(f"Uploading audio: {audio_path}...")
        audio_file = genai.upload_file(path=audio_path)
        
        # Wait for processing (audio is usually fast, but for consistency)
        while audio_file.state.name == "PROCESSING":
            print("Processing audio...")
            time.sleep(1)
            audio_file = genai.get_file(audio_file.name)

        if audio_file.state.name == "FAILED":
            return "Error: Audio processing failed."

        prompt = """
        You are a highly accurate speech-to-text and translation expert. 
        Transcribe the provided audio and convert it into clear, natural, and properly formatted English.
        If the speaker has a heavy accent, speech impediment, or uses non-standard phrasing,
        ensure the final output reflects their intended meaning in natural English.
        Provide only the final English text.
        """
        
        response = model.generate_content([audio_file, prompt])
        
        # Clean up the cloud file
        genai.delete_file(audio_file.name)
        
        return response.text.strip()
        
    except Exception as e:
        return f"Error during voice translation: {str(e)}"

if __name__ == "__main__":
    # Example usage (commented out as it requires a real audio file)
    # print(translate_voice_to_english("path/to/voice_input.wav"))
    print("Script ready. Call translate_voice_to_english(audio_path) to use.")
