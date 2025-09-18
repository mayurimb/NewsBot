import express from "express";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import Redis from "ioredis";
import chatRoutes from "./routes/chat.js";
import cors from "cors";

dotenv.config();
const app = express();

const allowedOrigins = [
  "http://localhost:5173",                // local dev
  "https://newsbot-frontend.vercel.app"   // deployed frontend
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like curl, Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("CORS not allowed"), false);
    }
  },
  methods: ["GET", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// handle preflight requests for all routes
app.options(/.*/, cors());


app.use(express.json());

// Redis
const redis = new Redis(process.env.REDIS_URL);

// Routes
app.use("/api/chat", chatRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.get("/session", (req, res) => {
  const sessionId = uuidv4();
  res.json({ sessionId });
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
