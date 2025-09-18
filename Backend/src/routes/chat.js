// src/routes/chat.js
import express from "express";
import { embedText } from "../services/embedder.js";
import { searchNews } from "../services/retriever.js";
import { askLLM } from "../services/llm.js";   

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { sessionId, message } = req.body;

    // ✅ Embed user query
    const queryEmbedding = await embedText(message);
    if (!queryEmbedding) {
      return res.json({ reply: "🤖 Sorry, I couldn’t process your query embedding." });
    }

    // ✅ Search Qdrant
    const hits = await searchNews(queryEmbedding, 3);

    // ✅ Ask Gemini with context docs
    const finalReply = await askLLM(message, hits);

    res.json({ reply: finalReply || "🤖 Sorry, no relevant news found." });
  } catch (err) {
    console.error("❌ Chat error:", err);
    res.status(500).json({ error: "Failed to handle chat." });
  }
});

export default router;
