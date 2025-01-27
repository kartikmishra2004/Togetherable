import { useState, useRef, useEffect } from 'react';
import { Volume2 } from 'lucide-react';
import { useFirebase } from '../context/firebase';
import { useScript } from '../context/TTScontext';
import { Mic } from 'lucide-react';
import useSpeechToText from '../utils/STT.jsx'

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
                return <p className="text-sm lg:text-base">{message.message}</p>;
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

    // const [listning, setListning] = useState(false);
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


    return (
        <div className="flex flex-col lg:h-[80vh] h-[65vh] bg-secondary pb-4 rounded-lg border border-zinc-800">
            <div className="bg-secondary border-b border-zinc-800 shadow-sm p-4">
                <h1 className="text-xl font-semibold">Community Chat</h1>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
                <div className="max-w-3xl mx-auto">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex flex-col ${msg.sender === user.uid ? 'items-end' : 'items-start'} mb-4`}>
                            {msg.sender !== user.uid && (
                                <div className="flex items-start mr-2 gap-2">
                                    <span className="text-sm text-gray-500">{msg.senderName}</span>
                                </div>
                            )}
                            <div
                                className={`w-max lg:max-w-[50%] max-w-[90%] rounded-lg p-3 ${msg.sender === user.uid
                                    ? 'bg-main'
                                    : 'bg-gray-800'
                                    }`}>
                                <MessageContent message={msg} />
                                <div className="flex gap-3">
                                    <span className="lg:text-xs text-xs opacity-70 mt-1 block">
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
                <div className="border rounded-lg p-4 bg-secondary border-zinc-700">
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="px-2 py-3 border rounded-lg focus:outline-none bg-transparent text-primary placeholder:text-zinc-700 border-zinc-800 w-full"
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