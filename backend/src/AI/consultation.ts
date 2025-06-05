import groq_client from "../utils/groq";

const consultDoctor = async (convertedAudioToText: string) => {
  const prompt = `
    You are a medical assistant summarizing conversations between doctors and patients.
    
    Instructions:
    - Read the entire conversation.
    - Identify the main symptoms oxr concerns expressed by the patient.
    - Include the doctor's key responses or actions (questions, diagnoses, suggestions).
    - Summarize clearly and concisely.
    - Do not include speaker labels or extra formatting.
    - Be neutral and professional.
    
    Conversation:
    ${convertedAudioToText}
    
    Summary:
    `.trim();

  const chatCompletion = await groq_client.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "llama3-8b-8192",
  });

  const cleanedConversation = chatCompletion.choices[0].message.content.trim();
  console.log(cleanedConversation);
  return cleanedConversation;
};

export default consultDoctor;

consultDoctor(`
 Hi doc I'm feeling really sick I've had a fever for the past two days yeah it's been really bad okay and I've also been having some trouble breathing what do you think it is well let's take a look I've been having some chest pain too okay I'll listen to your lungs and check your temperature
  `);
