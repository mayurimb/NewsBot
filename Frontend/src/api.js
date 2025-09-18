import axios from "axios";

const API_BASE = "http://localhost:8080"; 

// Create a new session
export async function getSession() {
  try {
    const res = await axios.get(`${API_BASE}/session`);
    return res.data.sessionId;
  } catch (err) {
    console.error("Session error:", err);
    return null;
  }
}

// Send a chat message
export async function sendMessage(sessionId, message) {
  try {
    const res = await axios.post(`${API_BASE}/api/chat`, {
      sessionId,
      message,
    });
    return res.data;
  } catch (err) {
    console.error("Send message error:", err);
    throw err;
  }
}

// Reset/clear a session
export async function resetSession(sessionId) {
  try {
    await axios.delete(`${API_BASE}/session/${sessionId}`);
    return true;
  } catch (err) {
    console.error("Reset error:", err);
    return false;
  }
}
