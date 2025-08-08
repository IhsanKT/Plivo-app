import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { FaRobot, FaUser, FaTrash } from 'react-icons/fa';

function ChatApp() {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi there! How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('https://plivo-app.onrender.com/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });

      const data = await response.json();
      const botMessage = { sender: 'bot', text: data.reply };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [
        ...prev,
        { sender: 'bot', text: '⚠️ Failed to fetch response.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter') sendMessage();
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-200 to-slate-100 flex items-center justify-center py-10 px-4">
      <div className="bg-white/30 shadow-xl backdrop-blur-md border border-white/40 rounded-2xl w-full max-w-4xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 bg-white/50 border-b border-white/30">
          <h1 className="text-xl font-semibold flex items-center gap-2">
            🤖 AI Chatbot <span className="text-sm text-gray-600">(Gemini API)</span>
          </h1>
          <button
            onClick={clearChat}
            className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg flex items-center gap-1"
          >
            <FaTrash /> Clear
          </button>
        </div>

        {/* Chat area */}
        <div className="relative flex-1 overflow-y-auto max-h-[70vh] px-6 py-4 space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`rounded-xl px-4 py-3 max-w-[75%] text-sm whitespace-pre-wrap shadow-md ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-gray-100 text-gray-900 rounded-bl-none'
                }`}
              >
                <div className="flex items-start gap-2">
                  <div className="mt-1">
                    {msg.sender === 'bot' ? <FaRobot className="text-gray-500" /> : <FaUser />}
                  </div>
                  <div>
                    {msg.sender === 'bot' ? (
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    ) : (
                      msg.text
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="text-sm text-gray-500 animate-pulse flex items-center gap-2">
              <FaRobot className="text-gray-400" /> Gemini is typing...
            </div>
          )}

          {/* Scroll target */}
          <div ref={chatEndRef} />
          
          {/* Scroll-to-bottom arrow button INSIDE chat box */}
          <button
            onClick={scrollToBottom}
            className="absolute bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg z-10 text-lg"
            title="Scroll to bottom"
          >
            ⬇
          </button>
        </div>

        {/* Input bar */}
        <div className="flex items-center p-4 border-t border-white/30 bg-white/50 backdrop-blur-md">
          <input
            type="text"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Type your message..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className={`ml-2 px-4 py-2 rounded-lg shadow-md text-white ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatApp;
