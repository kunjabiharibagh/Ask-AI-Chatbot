import { useState, useEffect } from 'react';
import Login from './Login';
import './App.css';
import ReactMarkdown from 'react-markdown';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [conversationId, setConversationId] = useState('');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  const handleLogout = () => {
    setToken('');
    setConversationId('');
    setMessages([]);
    localStorage.removeItem('token');
  };

  const startConversation = async () => {
    const res = await fetch(`${API_URL}/conversations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: 'New chat' }),
    });
    const data = await res.json();
    setConversationId(data._id);
  };

  useEffect(() => {
    if (token && !conversationId) startConversation();
  }, [token]);

  const sendMessage = async () => {
    if (!input.trim() || !conversationId) return;

    const currentInput = input;
    setMessages((prev) => [...prev, { sender: 'user', text: currentInput }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ conversation: conversationId, text: currentInput }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { sender: 'bot', text: data.botMessage.text }]);
    } catch (err) {
      setMessages((prev) => [...prev, { sender: 'bot', text: 'Something went wrong.' }]);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <span className="chat-title">Ask AI Chatbot</span>
        <button className="logout-btn" onClick={handleLogout}>Log out</button>
      </div>

      <div className="chat-window">
          {messages.length === 0 && (
            <div className="empty-state">👋 Hi, I'm Ask AI. Ask me anything about this project.</div>
          )}
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            </div>
          ))}
          {loading && <div className="message bot loading">Thinking...</div>}
      </div>

      <div className="input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;