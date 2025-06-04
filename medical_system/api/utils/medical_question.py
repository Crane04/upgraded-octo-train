from ..services.groqAI import groq_client

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


def get_medical_response(user_message):
    emergency_flag = any(
        keyword in user_message.lower() 
        for keyword in EMERGENCY_KEYWORDS
    )

    try:
        # Create chat completion
        chat_completion = groq_client.chat.completions.create(
            messages=[
                {"role": "system", "content": MEDICAL_SYSTEM_PROMPT},
                {"role": "user", "content": user_message},
            ],
            model="llama3-70b-8192",
            temperature=0.2,  # Lower for clinical precision
            max_tokens=500    # Limit response length
        )

        # Extract and clean the response
        response = chat_completion.choices[0].message.content.strip()
        
        if emergency_flag:
            response = (
                "EMERGENCY WARNING: " + response +
                "\n\n→ Seek immediate medical attention or call emergency services."
                "\nDo not delay treatment based on this information."
            )
        
        response += MEDICAL_DISCLAIMER

        return response
    except Exception as e:
        print(f"An error occurred: {e}")
        return f"An error occurred: {e}"