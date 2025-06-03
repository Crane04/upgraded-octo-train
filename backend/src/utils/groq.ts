import Groq from "groq-sdk";
require("dotenv").config();

export const GROQ_API_KEY = process.env.GROQ_API_KEY;
export default new Groq({
  apiKey: GROQ_API_KEY,
});
