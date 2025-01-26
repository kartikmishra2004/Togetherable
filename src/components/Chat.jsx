import { useState, useRef, useEffect } from 'react';
import { FiSend } from 'react-icons/fi';
import { Volume2 } from 'lucide-react'
import { useFirebase } from '../context/firebase';
import { useScript } from '../context/TTScontext';

function Chat({ communityId, userData }) {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const messagesEndRef = useRef(null);
    const { user, sendMessageToCommunity, fetchCommunityChats } = useFirebase();
    const { isScriptAdded } = useScript();

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
                return <p className="text-sm">{message.message}</p>;
            case 'image':
                return (
                    <img
                        src={message.message}
                        alt="Shared image"
                        className="max-w-[200px] rounded-lg"
                    />
                );
            case 'voice':
                return (
                    <audio controls className="max-w-[200px]">
                        <source src={message.message} type="audio/wav" />
                        Your browser does not support the audio element.
                    </audio>
                );
            default:
                return null;
        }
    };

    const formatTimestamp = (timestamp) => {
        const date = timestamp?.toDate();
        return date ? date.toLocaleString() : "Loading...";
    };

    return (
        <div className="flex flex-col h-[80vh] bg-secondary rounded-lg border border-zinc-800">
            <div className="bg-secondary border-b border-zinc-800 shadow-sm p-4">
                <h1 className="text-xl font-semibold">Community Chat</h1>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
                <div className="max-w-3xl mx-auto">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex flex-col ${msg.sender === user.uid ? 'items-end' : 'items-start'} mb-4`}>
                            {msg.sender !== user.uid && (
                                <div className="flex items-start mr-2 gap-2">
                                    <span className="text-xs text-gray-500">{msg.senderName}</span>
                                </div>
                            )}
                            <div
                                className={`w-max max-w-[50%] rounded-lg p-3 ${msg.sender === user.uid
                                    ? 'bg-main'
                                    : 'bg-gray-800'
                                    }`}>
                                <MessageContent message={msg} />
                                <div className="flex gap-3">
                                    <span className="text-xs opacity-70 mt-1 block">
                                        {formatTimestamp(msg.timestamp)}
                                    </span>
                                    <button className={isScriptAdded ? 'block' : 'hidden'} onClick={isScriptAdded ? () => responsiveVoice.speak(msg.message) : null}>
                                        <span><Volume2 width={17} /></span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </div>
            <div className="max-w-3xl mx-auto w-full">
                <div className="border-t border-r border-l p-4 bg-secondary border-zinc-800">
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="px-2 py-3 border rounded-lg focus:outline-none bg-transparent text-primary placeholder:text-zinc-700 border-zinc-500 w-full"
                        />
                        <button
                            disabled={!message ? true : false}
                            onClick={handleSendMessage}
                            className="p-2 bg-main disabled:bg-gray-800 disabled:cursor-not-allowed text-white rounded-full hover:bg-[#9036c8]">
                            <FiSend className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Chat;