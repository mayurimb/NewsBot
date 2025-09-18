import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const QDRANT_URL = process.env.QDRANT_URL;
const QDRANT_API_KEY = process.env.QDRANT_API_KEY;

/**
 * Search Qdrant collection using an embedding vector
 */
export async function searchNews(queryEmbedding, topK = 3) {
  try {
    const response = await axios.post(
      `${QDRANT_URL}/collections/news_articles/points/search`,
      {
        vector: queryEmbedding,
        limit: topK,
        with_payload: true
      },
      {
        headers: {
          "api-key": QDRANT_API_KEY,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data.result || [];
  } catch (err) {
    console.error("❌ Qdrant search error:", err.response?.data || err.message);
    return [];
  }
}
