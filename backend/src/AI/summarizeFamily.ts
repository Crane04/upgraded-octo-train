import groq_client from "../utils/groq";

const summarizeFamily = async (
  text: string,
  affectedUser: string,
  medicalIssue?: string
) => {
  try {
    if (!text) throw new Error("Input text is required");
    if (!affectedUser) throw new Error("Affected user is required");

    let promptText = `Provide the information in this exact format without any introductory phrases or first-line explanations:\n\n` +
      `**${affectedUser}'s Medical History**\n` +
      `• [Concise bullet points]\n\n` +
      `**Family Members' Medical History**\n` +
      `• [Concise bullet points]\n`;

    if (medicalIssue?.toLowerCase().includes("blood transfusion")) {
      promptText += `\n**Blood Type Matches**\n` +
        `• [Matches with phone numbers or "No matching donors"]\n`;
    }

    promptText += `\nProfiles data:\n${text}`;

    const chatCompletion = await groq_client.chat.completions.create({
      messages: [{
        role: "user",
        content: promptText
      }],
      model: "llama3-8b-8192",
      temperature: 0.2 // Keeps responses very factual
    });

    if (!chatCompletion.choices?.[0]?.message?.content) {
      throw new Error("No response from Groq API");
    }

    // Remove first line regardless of content
    const rawResponse = chatCompletion.choices[0].message.content.trim();
    const cleanedResponse = rawResponse.replace(/^.*?\n/, '').trim();

    return cleanedResponse;
  } catch (error) {
    console.error("Error summarizing family medical history:", error);
    throw error;
  }
};

export default summarizeFamily;