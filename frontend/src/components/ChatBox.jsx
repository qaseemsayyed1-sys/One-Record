import { useState } from "react";

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! Ask me anything in English or Hindi.", isBot: true }
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

  return (
    <div style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: 1000 }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{ width: "60px", height: "60px", borderRadius: "50%", background: "var(--terracotta)", color: "white", border: "none", fontSize: "24px", boxShadow: "0 4px 12px rgba(0,0,0,0.2)", cursor: "pointer" }}
      >
        💬
      </button>

      {isOpen && (
        <div style={{ position: "absolute", bottom: "70px", right: "0", width: "320px", background: "white", borderRadius: "16px", boxShadow: "0 8px 24px rgba(0,0,0,0.15)", overflow: "hidden", border: "1px solid var(--rule)" }}>
          <div style={{ background: "var(--terracotta)", color: "white", padding: "16px", fontWeight: "bold" }}>
            One-Record AI Assistant
          </div>
          <div style={{ height: "300px", overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ alignSelf: msg.isBot ? "flex-start" : "flex-end", background: msg.isBot ? "#f0f0f0" : "var(--terracotta)", color: msg.isBot ? "#333" : "white", padding: "10px 14px", borderRadius: "12px", maxWidth: "80%", fontSize: "13px", lineHeight: "1.4" }}>
                {msg.text}
              </div>
            ))}
          </div>
          <form onSubmit={handleSend} style={{ display: "flex", borderTop: "1px solid #eee" }}>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something..."
              style={{ flex: 1, padding: "12px", border: "none", outline: "none" }}
            />
            <button type="submit" style={{ background: "var(--terracotta)", color: "white", border: "none", padding: "0 16px", cursor: "pointer" }}>Send</button>
          </form>
        </div>
      )}
    </div>
  );
}