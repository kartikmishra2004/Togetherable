import { useState, useEffect } from "react";

const useSpeechRecognition = (lang = "en-US") => {
    const [transcript, setTranscript] = useState("");
    const [isListening, setIsListening] = useState(false);
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition = null;

    if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = true; // Keep listening continuously
        recognition.interimResults = true; // Show real-time results
        recognition.lang = lang;

        recognition.onstart = () => setIsListening(true);

        recognition.onresult = (event) => {
            let finalTranscript = "";
            for (let i = event.resultIndex; i < event.results.length; i++) {
                finalTranscript += event.results[i][0].transcript;
            }
            setTranscript(finalTranscript);
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
            setIsListening(false);
        };

        recognition.onend = () => {
            if (!isListening && !recognition.aborted) {
                console.log("Recognition ended. Restarting...");
                recognition.start();
            }
        };
    }

    const startListening = () => {
        if (recognition) {
            recognition.start();
        } else {
            console.warn("Speech Recognition API is not supported in this browser.");
        }
    };

    const stopListening = () => {
        if (recognition) {
            recognition.stop();
            setIsListening(false);
        }
    };

    useEffect(() => {
        return () => {
            if (recognition) {
                recognition.abort();
            }
        };
    }, []);

    return { transcript, isListening, startListening, stopListening };
};

export default useSpeechRecognition;