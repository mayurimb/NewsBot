import { useEffect, useState } from "react";
import Header from "./components/Header";
import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";
import { getSession, sendMessage, resetSession } from "./api";

function App() {
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Create a session when app loads
  useEffect(() => {
    const initSession = async () => {
      const id = await getSession();
      setSessionId(id);
    };
    initSession();
  }, []);

  // Handle sending a message
  const handleSend = async (message) => {
    if (!message.trim()) return;

    // Show user message
    setMessages((prev) => [...prev, { sender: "user", text: message }]);

    setLoading(true);
    try {
      const res = await sendMessage(sessionId, message);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: res.reply }
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Error: Could not get reply." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Reset chat
  const handleReset = async () => {
    if (sessionId) await resetSession(sessionId);
    setMessages([]);
    const id = await getSession();
    setSessionId(id);
  };

  return (
    <div className="app">
      <Header onReset={handleReset} />
      <div className="chat-window">
        <ChatWindow messages={messages} />
        {loading && <div className="bubble bot loading">...</div>} 
      </div>
      <ChatInput onSend={handleSend} />
    </div>
  );
}

export default App;
