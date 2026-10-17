import { useState } from "react";

export default function ChatBot({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    { text: "Hello! I am your health assistant. Ask about records, doctors, or QR.", isBot: true },
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
      let botReply = "I am a health assistant. Please ask about your records, medicines, doctors, or QR sharing.";

      if (userText.includes("qr") || userText.includes("scan") || userText.includes("share") || userText.includes("क्यूआर")) {
        botReply = "Go to the Share tab, click 'Generate QR', and show it to your doctor. (QR शेयर करने के लिए Share टैब में जाएं।)";
      } else if (userText.includes("duplicate") || userText.includes("salt") || userText.includes("medicine") || userText.includes("दवा") || userText.includes("crocin") || userText.includes("dolo")) {
        botReply = "We detect duplicate salts! For example, Crocin and Dolo 650 both contain Paracetamol. (हम दवाओं के डुप्लीकेट सॉल्ट को पकड़ लेते हैं।)";
      } else if (userText.includes("doctor") || userText.includes("prescribe") || userText.includes("डॉक्टर")) {
        botReply = "Doctors can scan your QR to see your medical history, but they cannot see your name or phone number. (डॉक्टर आपका नाम नहीं देख सकते।)";
      } else if (userText.includes("record") || userText.includes("history") || userText.includes("report") || userText.includes("रिकॉर्ड")) {
        botReply = "You can view all your medical history in the 'Records' tab of your dashboard.";
      } else if (userText.includes("profile") || userText.includes("allergy") || userText.includes("blood") || userText.includes("प्रोफाइल")) {
        botReply = "Update your blood group, allergies, and chronic conditions in the 'Profile' tab.";
      } else if (userText.includes("audit") || userText.includes("log") || userText.includes("access")) {
        botReply = "The 'Audit' tab shows you exactly who accessed your records and when.";
      } else if (userText.includes("hi") || userText.includes("hello") || userText.includes("hey") || userText.includes("नमस्ते")) {
        botReply = "Namaste! How can I help you today? (मैं आपकी क्या मदद कर सकता हूँ?)";
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
          <button onClick={onClose} style={{ background: "transparent", border: "none", color: "white", cursor: "pointer", fontSize: "16px" }}>✖</button>
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
                border: msg.isBot ? "1px solid var(--rule)" : "none"
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
          <button type="submit" className="chat-send-btn">Send</button>
        </form>
      </div>
    </div>
  );
}