import React, { useState, useEffect, useRef } from 'react';

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your AI Tutor. Ask me things like \"Why does this step work?\" or \"What happens if the token expires?\"", sender: "ai" }
  ]);
  const [input, setInput] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isMinimized]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages(prev => [...prev, { text: input, sender: "user" }]);
    setInput("");
    
    // Send to backend
    fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
    })
    .then(res => res.json())
    .then(data => {
        setMessages(prev => [...prev, { text: data.answer, sender: "ai" }]);
    })
    .catch(err => {
        console.error(err);
        setMessages(prev => [...prev, { text: "Sorry, I couldn't reach the server.", sender: "ai" }]);
    });
  };

  if (isMinimized) {
    return (
      <div 
        onClick={() => setIsMinimized(false)}
        style={{
          position: 'fixed',
          top: '20px',
          left: '20px',
          background: 'rgba(0, 0, 0, 0.8)',
          borderRadius: '50px',
          padding: '10px 20px',
          color: 'white',
          cursor: 'pointer',
          zIndex: 1000,
          boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
          fontFamily: 'sans-serif',
          fontWeight: 'bold',
          border: '1px solid rgba(255,255,255,0.1)'
        }}
      >
        💬 Chat
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      left: '20px',
      width: '320px',
      height: '450px',
      background: 'rgba(0, 0, 0, 0.9)', // Slightly darker for better contrast
      borderRadius: '12px',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 1000,
      color: 'white',
      fontFamily: 'sans-serif',
      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      border: '1px solid rgba(255,255,255,0.1)',
      transition: 'all 0.3s ease'
    }}>
      <div style={{
        padding: '15px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        fontWeight: 'bold',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(255,255,255,0.05)',
        borderTopLeftRadius: '12px',
        borderTopRightRadius: '12px'
      }}>
        <span>AI Tutor</span>
        <button 
          onClick={() => setIsMinimized(true)}
          style={{
            background: 'none',
            border: 'none',
            color: '#aaa',
            cursor: 'pointer',
            fontSize: '18px',
            padding: '0 5px'
          }}
        >
          −
        </button>
      </div>
      
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '15px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {messages.map((msg, index) => (
          <div key={index} style={{
            alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
            background: msg.sender === 'user' ? '#4a9eff' : '#333',
            color: msg.sender === 'user' ? 'white' : '#e5e7eb',
            padding: '10px 14px',
            borderRadius: '16px',
            borderBottomRightRadius: msg.sender === 'user' ? '4px' : '16px',
            borderBottomLeftRadius: msg.sender === 'user' ? '16px' : '4px',
            maxWidth: '85%',
            fontSize: '14px',
            lineHeight: '1.4'
          }}>
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} style={{
        padding: '15px',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        gap: '8px',
        background: 'rgba(0,0,0,0.2)',
        borderBottomLeftRadius: '12px',
        borderBottomRightRadius: '12px'
      }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask why this step works..."
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '20px',
            border: '1px solid rgba(255,255,255,0.1)',
            outline: 'none',
            background: '#222',
            color: 'white',
            fontSize: '14px'
          }}
        />
        <button type="submit" style={{
          padding: '8px 16px',
          background: '#4ade80',
          border: 'none',
          borderRadius: '20px',
          color: '#003311',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '14px',
          transition: 'transform 0.1s'
        }}>
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;
