import axios from "axios";
import dotenv from "dotenv";
import Parser from "rss-parser";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const QDRANT_URL = process.env.QDRANT_URL;
const QDRANT_API_KEY = process.env.QDRANT_API_KEY;
const JINA_API_KEY = process.env.JINA_API_KEY;

const parser = new Parser();
const RSS_FEED = "http://feeds.bbci.co.uk/news/rss.xml"; // BBC Top News RSS

// --- Step 1: Fetch ~50 BBC articles ---
async function fetchArticles(limit = 50) {
  const feed = await parser.parseURL(RSS_FEED);
  return feed.items.slice(0, limit).map((item) => ({
    id: uuidv4(),
    title: item.title || "Untitled",
    text: item.contentSnippet || item.title,
    link: item.link,
    date: item.pubDate || new Date().toISOString()
  }));
}

// --- Step 2: Embed text using Jina ---
async function embedText(text) {
  try {
    const response = await axios.post(
      "https://api.jina.ai/v1/embeddings",
      { model: "jina-embeddings-v2-base-en", input: text },
      { headers: { Authorization: `Bearer ${JINA_API_KEY}`, "Content-Type": "application/json" } }
    );
    return response.data.data[0].embedding;
  } catch (err) {
    console.error("Embedding error:", err.response?.data || err.message);
    return null;
  }
}

// --- Step 3: Insert into Qdrant ---
async function insertIntoQdrant(article, embedding) {
  try {
    await axios.put(
      `${QDRANT_URL}/collections/news_articles/points?wait=true`,
      {
        points: [
          {
            id: article.id,
            vector: embedding,
            payload: {
              title: article.title,
              text: article.text,
              link: article.link,
              date: article.date
            }
          }
        ]
      },
      { headers: { "api-key": QDRANT_API_KEY, "Content-Type": "application/json" } }
    );
    console.log(`Inserted: ${article.title}`);
  } catch (err) {
    console.error("Qdrant insert error:", err.response?.data || err.message);
  }
}

// --- Step 4: Run pipeline ---
(async () => {
  console.log("Fetching BBC RSS...");
  const articles = await fetchArticles(50);
  console.log(`Got ${articles.length} articles`);

  for (const article of articles) {
    const embedding = await embedText(article.text);
    if (!embedding) continue;
    await insertIntoQdrant(article, embedding);
  }

  console.log("Ingestion complete!");
})();
