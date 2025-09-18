// src/services/llm.js
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

/**
 * Ask Gemini LLM with a question + retrieved context
 */
export async function askLLM(userQuery, contextDocs) {
  // Build context string from Qdrant docs
  const contextText = (contextDocs || [])
    .map((doc, i) => `Doc ${i + 1}: ${doc.payload?.title} - ${doc.payload?.text}`)
    .join("\n\n");

  const prompt = `
You are a helpful assistant that answers user questions based only on the provided news context.
Question: ${userQuery}
Context: ${contextText || "No relevant context"}
Answer (concise, factual, news-style):
`;

  try {
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }]
          }
        ]
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": GEMINI_API_KEY
        }
      }
    );

    return (
      response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn’t generate an answer."
    );
  } catch (err) {
    console.error("❌ LLM error:", err.response?.data || err.message);
    return "Sorry, LLM API failed.";
  }
}
