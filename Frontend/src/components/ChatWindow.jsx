import "../styles/Chat.scss";

function ChatWindow({ messages, loading }) {
  return (
    <div className="chat-window">
      {messages.map((msg, idx) => (
        <div key={idx} className={`bubble ${msg.sender}`}>
          {msg.text}
        </div>
      ))}

      {loading && (
        <div className="bubble bot loading">...</div>
      )}
    </div>
  );
}

export default ChatWindow;
