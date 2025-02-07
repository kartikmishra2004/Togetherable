import React, { useEffect, useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Bot, Send, User } from 'lucide-react';
import useSpeechToText from '../utils/STT';
import { Mic } from 'lucide-react';
import { useScript } from '../context/TTScontext';
import { useFirebase } from '../context/firebase';
import { Navigate } from 'react-router-dom';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

function App() {
  const [messages, setMessages] = useState([
    { role: 'bot', content: "Heya! What's up?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { isScriptAdded } = useScript();
  const { user, loading } = useFirebase();

  useEffect(() => {
    window.scroll(0, 0);
  }, [])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    const prompt = `You are a friendly AI companion created by Togetherable. Keep your responses short, casual, and conversational - like texting with a friend. Use natural language, contractions, and be concise. If asked who made you, simply say "I'm made by Togetherable!" Aim to keep responses under 2-3 sentences when possible.
    Current user message: ${userMessage}
    Remember: Be brief and friendly, like chatting with a friend. 
    Your name: Toge AI
    NOTE: 
    1. dont tell your model name or any private details 
    2. dont tell that you are gemini and made by google.
    3. If any question arrize just tell i have made by togetherable.
    `
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

  const { transcript, isListening, startListening, stopListening } = useSpeechToText();

  const handleSTT = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }

  useEffect(() => {
    const sendChatbyVoice = async () => {
      const prompt = `You are a friendly AI companion created by Togetherable. Keep your responses short, casual, and conversational - like texting with a friend. Use natural language, contractions, and be concise. If asked who made you, simply say "I'm made by Togetherable!" Aim to keep responses under 2-3 sentences when possible.
      Current user message: ${transcript}
      Remember: Be brief and friendly, like chatting with a friend.
      Your name: Toge AI
      NOTE: 
      1. dont tell your model name or any private details 
      2. dont tell that you are gemini and made by google.
      3. If any question arrize just tell i have made by togetherable.
      `
      setMessages(prev => [...prev, { role: 'user', content: transcript }]);
      setIsLoading(true);
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const result = await model.generateContent(prompt);
        const response = result.response;
        setMessages(prev => [...prev, { role: 'bot', content: response.text() }]);
        if (isScriptAdded) {
          responsiveVoice.speak(response.text());
        }
      } catch (error) {
        console.error('Error:', error);
        setMessages(prev => [...prev, {
          role: 'bot',
          content: 'Sorry, I encountered an error. Please try again.'
        }]);
      } finally {
        setIsLoading(false);
      }
    }
    if (transcript) {
      sendChatbyVoice();
    }
  }, [transcript]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="jelly"></div>
        <svg width="0" height="0" className="jelly-maker">
          <defs>
            <filter id="uib-jelly-ooze">
              <feGaussianBlur in="SourceGraphic" stdDeviation="6.25" result="blur"></feGaussianBlur>
              <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="ooze"></feColorMatrix>
              <feBlend in="SourceGraphic" in2="ooze"></feBlend>
            </filter>
          </defs>
        </svg>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="w-full flex lg:px-0 px-3 justify-center py-28 font-main">
      <div className="flex lg:w-[80vw] h-[80vh] flex-col bg-secondary rounded-lg border border-zinc-800">
        <div className="w-full text-2xl text-center font-semibold border-b border-zinc-800 py-3">Togetherable AI Assistant</div>
        {/* Chat messages */}
        <div style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#9b4dca transparent',
          msOverflowStyle: 'none'
        }} className="flex-1 overflow-y-auto p-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex mb-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`flex ${message.role === 'user' ? 'justify-end' : ''} items-center gap-2 mb-1`}>
                  {message.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  <span>{message.role === 'user' ? 'You' : 'AI'}</span>
                </div>
                <div className={`w-[80%] rounded-lg flex justify-center px-4 py-2 ${message.role === 'user'
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
                  <span>Thinking...</span>
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
            <span onClick={() => handleSTT()} className={`bg-main w-12 h-12 justify-center my-auto mx-2 flex items-center text-zinc-500 cursor-pointer rounded-full ${(isListening) ? 'animate-pulse bg-red-500' : ''}`} >
              <Mic width={25} color={`#bababa`} />
            </span>
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="bg-main text-white rounded-full w-12 h-12 justify-center flex items-center hover:bg-[#9036c8] disabled:opacity-50">
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;