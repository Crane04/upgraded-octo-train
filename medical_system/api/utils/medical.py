from groq import Groq

from dotenv import load_dotenv
load_dotenv()

import os
groq_client = Groq(api_key= os.getenv('GROQ_API_KEY'))

print(groq_client)

MEDICAL_SYSTEM_PROMPT = """You are Dr. Llama, a clinical AI medical assistant. Respond with concise, factual medical information only.
Format responses as:
1. Definition (if applicable)
2. Key facts
3. Clinical recommendations
Omit greetings, flattery, or non-medical commentary.
If unsure, state "Insufficient medical evidence."""

# Emergency keywords
EMERGENCY_KEYWORDS = {
    "emergency", "911", "urgent", "chest pain", "shortness of breath",
    "severe pain", "bleeding", "stroke", "heart attack", "unconscious"
}

# Medical disclaimer
MEDICAL_DISCLAIMER = "\n\nDisclaimer: This information is not a substitute for professional medical advice, diagnosis, or treatment."
