import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

def translate_haptic_to_english(haptic_pattern: str) -> str:
    """
    Translates a haptic pattern (simulated as pulses or Morse-like strings) to English.
    
    Args:
        haptic_pattern (str): A string representing haptic pulses, e.g., '... --- ...' or '010110'
        
    Returns:
        str: The translated English text.
    """
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        return "Error: GOOGLE_API_KEY not found."

    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-2.0-flash")
    
    prompt = f"""
    You are an expert in accessibility communication. 
    A user is providing haptic input consisting of patterns of vibrations or pulses.
    Translate the following haptic pattern sequence into natural, conversational English.
    If the pattern looks like Morse code, decode it. If it's a binary sequence or a custom pulse pattern, 
    interpret its most likely meaning in a helpful way.
    
    Pattern: {haptic_pattern}
    
    Output only the natural English translation.
    """
    
    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        return f"Error during translation: {str(e)}"

if __name__ == "__main__":
    # Example usage
    sample_pattern = "... --- ..."
    print(f"Haptic Pattern: {sample_pattern}")
    print(f"Translated English: {translate_haptic_to_english(sample_pattern)}")
