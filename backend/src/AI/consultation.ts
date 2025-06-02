import groq_client from "../utils/groq";

const consultDoctor = async (convertedAudioToText: string) => {
  const prompt = `
    You are a medical assistant formatting transcripts of doctor-patient conversations.
    
    Instructions:
    - Label each line as either "Doctor:" or "Patient:" based on context.
    - The doctor usually asks questions or gives guidance.
    - The patient usually describes symptoms, feelings, or conditions.
    - Detect who is speaking first based on context (do NOT assume it's always the patient).
    - Do NOT add extra commentary or explanations — only output the formatted conversation.
    
    Example 1 (Doctor starts):
    
    Unformatted:
    Hello, what brings you in today?
    I've been coughing a lot lately.
    Do you have a fever?
    Yes, and my chest hurts sometimes.
    
    Formatted:
    Doctor: Hello, what brings you in today?
    Patient: I've been coughing a lot lately.
    Doctor: Do you have a fever?
    Patient: Yes, and my chest hurts sometimes.
    
    Example 2 (Patient starts):
    
    Unformatted:
    Hey doc, I've had terrible headaches all week.
    How severe are they on a scale from 1 to 10?
    Maybe around 7 or 8. They're really distracting.
    
    Formatted:
    Patient: Hey doc, I've had terrible headaches all week.
    Doctor: How severe are they on a scale from 1 to 10?
    Patient: Maybe around 7 or 8. They're really distracting.
    
    Now format the following conversation:
    
    ${convertedAudioToText}
    
    Formatted:
    `.trim();

  const chatCompletion = await groq_client.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "llama3-8b-8192",
  });

  const cleanedConversation = chatCompletion.choices[0].message.content.trim();
  return cleanedConversation;
};

export default consultDoctor;
