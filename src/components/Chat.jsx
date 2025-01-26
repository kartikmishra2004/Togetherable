import { useState, useRef } from 'react';
import { FiSend, FiImage } from 'react-icons/fi';
import { format } from 'date-fns';

function Chat() {
    const [messages, setMessages] = useState([
        {
            type: 'text',
            content: 'Hello! Welcome to the chat!',
            timestamp: new Date().toISOString(),
            isOwn: false,
        },
    ]);
    const [message, setMessage] = useState('');
    const fileInputRef = useRef(null);

    const handleSendMessage = () => {
        if (message.trim()) {
            const newMessage = {
                type: 'text',
                content: message,
                timestamp: new Date().toISOString(),
                isOwn: true,
            };
            setMessages([...messages, newMessage]);
            setMessage('');
        }
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const newMessage = {
                    type: 'image',
                    content: e.target.result,
                    timestamp: new Date().toISOString(),
                    isOwn: true,
                };
                setMessages([...messages, newMessage]);
            };
            reader.readAsDataURL(file);
        }
    };

    const MessageContent = ({ message }) => {
        switch (message.type) {
            case 'text':
                return <p className="text-sm">{message.content}</p>;
            case 'image':
                return (
                    <img
                        src={message.content}
                        alt="Shared image"
                        className="max-w-[200px] rounded-lg" />
                );
            case 'voice':
                return (
                    <audio controls className="max-w-[200px]">
                        <source src={message.content} type="audio/wav" />
                        Your browser does not support the audio element.
                    </audio>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col h-[80vh] bg-secondary rounded-lg border w-[80vw] border-zinc-800 text-primary font-main">
            <div className="bg-secondary border-b rounded-t-lg border-zinc-800 shadow-sm p-4">
                <h1 className="text-xl font-semibold">Chat App</h1>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
                <div className="max-w-3xl mx-auto">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
                            <div
                                className={`max-w-[70%] rounded-lg p-3 ${msg.isOwn ? 'bg-main' : 'bg-gray-800'
                                    }`}>
                                <MessageContent message={msg} />
                                <span className="text-xs opacity-70 mt-1 block">
                                    {format(new Date(msg.timestamp), 'HH:mm')}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="max-w-3xl mx-auto w-full">
                <div className="rounded-t-lg p-4 bg-secondary border-t border-r border-l border-zinc-800">
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onClick={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Type a message..."
                            className="px-2 py-3 w-full border rounded-lg focus:outline-none bg-transparent text-primary placeholder:text-zinc-700 border-zinc-500" />
                        <button
                            onClick={() => fileInputRef.current.click()}
                            className="p-2 rounded-full">
                            <FiImage className="w-6 h-6 text-gray-500" />
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            accept="image/*"
                            className="hidden" />
                        <button
                            onClick={handleSendMessage}
                            className="p-2 bg-main rounded-full hover:bg-[#9036c8]">
                            <FiSend className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Chat;