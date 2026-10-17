import { useState } from "react";

export default function ChatBot({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    { text: "Hello! Ask me anything in English or Hindi.", isBot: true },
  ]);
  const [input, setInput] = useState("");

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages = [...messages, { text: input, isBot: false }];
    setMessages(newMessages);
    const userText = input.toLowerCase();
    setInput("");

    setTimeout(() => {
      let botReply = "I didn't understand. Ask about records, QR, or medicines.";

      if (userText.includes("qr") || userText.includes("scan") || userText.includes("क्यूआर")) {
        botReply = "Go to Share tab, generate QR, show to doctor. (QR टैब में जाएं और कोड बनाएं।)";
      } else if (userText.includes("duplicate") || userText.includes("medicine") || userText.includes("दवा")) {
        botReply = "We detect duplicate salts. Crocin and Dolo both have Paracetamol. (हम डुप्लीकेट सॉल्ट पकड़ते हैं।)";
      } else if (userText.includes("doctor") || userText.includes("डॉक्टर")) {
        botReply = "Doctors scan QR to see history, but not your name. (डॉक्टर आपका नाम नहीं देख सकते।)";
      } else if (userText.includes("hi") || userText.includes("hello") || userText.includes("नमस्ते")) {
        botReply = "Namaste! Main aapki kaise madad kar sakta hoon?";
      }

      setMessages((prev) => [...prev, { text: botReply, isBot: true }]);
    }, 800);
  };

  if (!isOpen) return null;

  return (
    <div style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: 1000 }}>
      <div className="chat-container">
        <div className="chat-header">
          <span>🌿 One-Record AI</span>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "white",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            ✖
          </button>
        </div>
        <div className="chat-messages">
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                alignSelf: msg.isBot ? "flex-start" : "flex-end",
                background: msg.isBot ? "var(--cream)" : "var(--terracotta)",
                color: msg.isBot ? "var(--ink)" : "white",
                padding: "10px 14px",
                borderRadius: "12px",
                maxWidth: "80%",
                fontSize: "13px",
                lineHeight: "1.4",
                border: msg.isBot ? "1px solid var(--rule)" : "none",
              }}
            >
              {msg.text}
            </div>
          ))}
        </div>
        <form onSubmit={handleSend} className="chat-form">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your health..."
            className="chat-input"
          />
          <button type="submit" className="chat-send-btn">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}