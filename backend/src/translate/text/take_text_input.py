import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

def translate_text_to_english(raw_text: str) -> str:
    """
    Refines messy, abbreviated, or shorthand text into natural English.
    
    Args:
        raw_text (str): The raw text input, possibly including shorthand, typos, or slang.
        
    Returns:
        str: The refined natural English text.
    """
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        return "Error: GOOGLE_API_KEY not found."

    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-2.0-flash")
    
    prompt = f"""
    You are an expert in accessible communication and linguistics.
    A user has provided text input that might be written in shorthand, contain typos, 
    or use abbreviations typical for someone with limited dexterity or using assistive devices.
    
    Convert the following raw input into natural, clear, and perfectly formatted English.
    
    Raw Input: {raw_text}
    
    Output only the refined natural English text.
    """
    
    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        return f"Error during text refinement: {str(e)}"

if __name__ == "__main__":
    # Example usage
    sample_text = "hw r u doin? i nd hlp w ths"
    print(f"Raw Text: {sample_text}")
    print(f"Refined English: {translate_text_to_english(sample_text)}")
