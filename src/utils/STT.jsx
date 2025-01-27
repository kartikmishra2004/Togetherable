import { useState, useEffect } from 'react';

const useSpeechToText = () => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
            setError('SpeechRecognition API is not supported in your browser.');
        }
    }, []);

    const handleStart = () => {
        if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
            console.error('SpeechRecognition API is not supported in your browser.');
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        const lang = 'en-US'
        // const lang = ['gu-IN', 'mr-IN', 'bn-IN, ml-IN, te-IN, 'hi-IN', 'en-US'];
        recognition.lang = lang;

        recognition.onresult = (event) => {
            const result = event.results[0][0].transcript;
            setTranscript(result);
        };

        recognition.onerror = (event) => {
            setError(event.error);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.start();
        setIsListening(true);
    };

    const handleStop = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.stop();
        }
        setIsListening(false);
    };

    return { transcript, isListening, error, startListening: handleStart, stopListening: handleStop };
};

export default useSpeechToText;