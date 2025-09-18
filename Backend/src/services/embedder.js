import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const JINA_API_KEY = process.env.JINA_API_KEY;

/**
 * Get an embedding vector from Jina for text
 */
export async function embedText(text) {
  try {
    const response = await axios.post(
      "https://api.jina.ai/v1/embeddings",
      {
        model: "jina-embeddings-v2-base-en", // 768-dim model
        input: text
      },
      {
        headers: {
          Authorization: `Bearer ${JINA_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data.data[0].embedding;
  } catch (err) {
    console.error("❌ Embedding error:", err.response?.data || err.message);
    return null;
  }
}
