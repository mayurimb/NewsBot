import { useState } from "react";
import "../styles/Input.scss";

function ChatInput({ onSend }) {
  const [input, setInput] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (input.trim()) {
      onSend(input);
      setInput("");
    }
  }

  return (
    <form className="chat-input" onSubmit={handleSubmit}>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask me about the news..."
      />
      <button type="submit">Send</button>
    </form>
  );
}
export default ChatInput;
