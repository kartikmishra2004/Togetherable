import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Bot, Send, User } from 'lucide-react';

const apiKey = 'AIzaSyDtJYx_Wo8jjILJ4nVIaeQX9-jFG58OLuI';
const genAI = new GoogleGenerativeAI(apiKey);

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    const prompt = `You are a friendly AI companion created by Togetherable. Keep your responses short, casual, and conversational - like texting with a friend. Use natural language, contractions, and be concise. If asked who made you, simply say "I'm made by Togetherable!" Aim to keep responses under 2-3 sentences when possible.
    Current user message: ${userMessage}
    Remember: Be brief and friendly, like chatting with a friend.`
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const result = await model.generateContent(prompt);
      const response = result.response;
      setMessages(prev => [...prev, { role: 'bot', content: response.text() }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'bot',
        content: 'Sorry, I encountered an error. Please try again.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center py-32">
      <div className="flex w-[80vw] h-[90vh] flex-col bg-secondary rounded-lg border border-zinc-800">
        <div className="w-full text-2xl text-center font-semibold border-b border-zinc-800 py-3">Togetherable AI Assistant</div>
        {/* Chat messages */}
        <div className="flex-1 overflow-auto p-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex mb-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className="flex flex-col">
                <div className={`flex ${message.role === 'user' ? 'justify-end' : ''} items-center gap-2 mb-1`}>
                  {message.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  <span>{message.role === 'user' ? 'You' : 'AI'}</span>
                </div>
                <div className={`w-max rounded-lg px-4 py-2 ${message.role === 'user'
                  ? 'bg-main text-white'
                  : 'bg-gray-800 text-white'
                  }`}>
                  <p>{message.content}</p>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="bg-gray-800 text-white rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <Bot size={16} />
                  <span>Typing...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="p-4 bg-secondary border-t border-gray-800">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..."
              className="px-2 py-3 border rounded-lg focus:outline-none bg-secondary text-zinc-400 placeholder:text-zinc-600 border-zinc-700 w-full"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;