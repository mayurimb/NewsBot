📰 NewsBot – AI-Powered News Q&A Chatbot

An intelligent chatbot that answers questions about the latest news articles using Retrieval-Augmented Generation (RAG).
It fetches news from RSS feeds, embeds them with Jina embeddings, stores them in Qdrant vector database, and generates answers using Google Gemini.

Website - https://news-bot-azure.vercel.app

--Features
i. Fetches and ingests ~50 fresh articles from BBC RSS feed
ii. Stores embeddings in Qdrant for semantic search
iii. Natural language question-answering using Gemini LLM
iv. Clean React + Vite frontend with SCSS styling
v. Session handling with reset functionality
vi. Deployable with Render (backend) + Vercel (frontend)

⚙️Setup Instructions
1. Clone Repo
git clone https://github.com/mayurimb/NewsBot.git
cd NewsBot

2. Backend Setup
cd Backend
npm install
cp .env.example .env   
npm run dev     

3. Frontend Setup
cd Frontend
npm install
npm run dev

🔑Environment Variables
Create .env files in both Backend/ and Frontend/.

Backend .env
QDRANT_URL=your_qdrant_url
QDRANT_API_KEY=your_qdrant_key
JINA_API_KEY=your_jina_key
GEMINI_API_KEY=your_gemini_key
REDIS_URL=your_redis_url
PORT=8080

Frontend .env
VITE_API_BASE=https://your-backend.onrender.com

🌟 Future Improvements
i. Add support for multiple news sources (Reuters, CNN, etc.)
ii. Improve answer accuracy with better prompt engineering
iii. Add streaming responses
iv. Support saving chat history in MySQL/Postgres