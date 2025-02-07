import { useState, useRef, useEffect } from 'react';
import { Volume2 } from 'lucide-react';
import { useFirebase } from '../context/firebase';
import { useScript } from '../context/TTScontext';
import { Mic, Smile } from 'lucide-react';
import useSpeechToText from '../utils/STT.jsx'
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

function Chat({ communityId, userData }) {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const messagesEndRef = useRef(null);
    const { user, sendMessageToCommunity, fetchCommunityChats } = useFirebase();
    const { isScriptAdded } = useScript();
    const { transcript, isListening, startListening, stopListening } = useSpeechToText();

    useEffect(() => {
        fetchCommunityChats(communityId, setMessages)
    }, [messages]);

    const handleSendMessage = async () => {
        if (message.trim()) {
            setMessage('');
            await sendMessageToCommunity(communityId, message, user.uid, userData.fullName, 'text');
        }
    };

    const MessageContent = ({ message }) => {
        switch (message.type) {
            case 'text':
                return <p className="text-xs lg:text-base">{message.message}</p>;
            default:
                return null;
        }
    };

    const formatTimestamp = (timestamp) => {
        if (!timestamp) return "Invalid Time";
        const date = timestamp?.toDate();
        if (!date) return "Invalid Time";
        const inputString = date.toLocaleString();
        const timePart = inputString.split(',')[1]?.trim();
        if (!timePart) return "Invalid Time";
        const timeWithoutSeconds = timePart.split(':').slice(0, 2).join(':') + ' ' + timePart.split(' ')[1];
        return timeWithoutSeconds || "Invalid Time";
    };

    const handleSTT = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    }

    useEffect(() => {
        if (transcript) {
            setMessage(message + ' ' + transcript);
        }
    }, [transcript]);

    const [sentiment, setSentiment] = useState('')
    const [showSentment, setShowSentment] = useState(false)
    const sentAnalysis = async (prompt) => {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const result = await model.generateContent(`Analyize the sentements of the given prompt and give the appropriate emoji and the sentement in brackets. Example : 😡 (Negative)
            prompt: ${prompt}`);
        const response = result.response;
        const emoji = response.text();
        setSentiment(emoji);
        setShowSentment(true);
        setTimeout(() => {
            setShowSentment(false)
        }, 2500);
    }

    return (
        <div className="flex flex-col font-main lg:h-[80vh] h-[80vh] bg-secondary pb-4 rounded-lg border border-zinc-800">
            <div className="bg-secondary border-b flex justify-between border-zinc-800 shadow-sm p-4">
                <h1 className="lg:text-xl text-sm font-semibold">Community Chat</h1>
                {showSentment && <div className='w-max px-3 lg:text-base text-sm flex justify-center items-center rounded-lg bg-gray-800'>Sentment : {sentiment}</div>}
            </div>
            <div
                style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#9b4dca transparent',
                    msOverflowStyle: 'none'
                }}
                className="flex-1 px-2 lg:px-28 overflow-y-auto p-4">
                <div className="w-full">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex flex-col ${msg.sender === user.uid ? 'items-end' : 'items-start'} mb-4`}>
                            {msg.sender !== user.uid && (
                                <div className="flex items-start mr-2 gap-2 mb-1">
                                    <span className="lg:text-sm text-xs text-gray-500">{msg.senderName}</span>
                                </div>
                            )}
                            <div className={`flex w-[90%] ${msg.sender === user.uid ? 'justify-end' : ''} items-center`}>
                                <div
                                    className={`w-max lg:max-w-[80%] max-w-[70%] rounded-lg lg:p-3 p-2 ${msg.sender === user.uid
                                        ? 'bg-main'
                                        : 'bg-gray-800'
                                        }`}>
                                    <MessageContent message={msg} />
                                </div>
                                <button title='Get the sentimental analysis of this chat.' className='px-2 h-max my-auto' onClick={() => sentAnalysis(msg.message)}>
                                    <Smile color='#bababa' />
                                </button>
                            </div>
                            <div className={`flex gap-3 mt-1 ${msg.sender === user.uid ? 'flex-row-reverse' : ''}`}>
                                <span className="text-xs text-gray-500 opacity-70 mt-1 block">
                                    {formatTimestamp(msg.timestamp)}
                                </span>
                                <button className={isScriptAdded ? 'block' : 'hidden'} onClick={isScriptAdded ? () => responsiveVoice.speak(msg.message) : null}>
                                    <span><Volume2 width={17} /></span>
                                </button>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </div>
            <div className="max-w-3xl mx-auto w-full">
                <div className="border rounded-lg p-4 bg-secondary border-zinc-700">
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="px-2 py-3 border rounded-lg focus:outline-none bg-transparent text-zinc-400 placeholder:text-zinc-700 border-zinc-800 w-full"
                        />
                        <button
                            onMouseEnter={isScriptAdded ? () => responsiveVoice.speak('send') : null}
                            disabled={!message ? true : false}
                            onClick={handleSendMessage}
                            className={`px-3 py-2 mx-2 bg-main rounded-lg hover:bg-[#9036c8] focus:outline-none disabled:bg-gray-800 ${!message ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                            Send
                        </button>
                        <button onClick={handleSTT} className={`p-2 ${isListening ? 'bg-red-500 animate-pulse' : 'bg-main hover:bg-[#9036c8]'} disabled:bg-gray-800 disabled:cursor-not-allowed text-white rounded-full`}>
                            <Mic />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Chat;