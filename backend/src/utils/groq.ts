import Groq from "groq-sdk";
require("dotenv").config();

const GROQ_API_KEY = process.env.GROQ_API_KEY;
export default new Groq({
  apiKey:
    GROQ_API_KEY || "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",
});
