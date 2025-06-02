import Groq from "groq-sdk";

export default new Groq({
  apiKey:
    process.env["GROQ_API_KEY"] ||
    "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",
});
