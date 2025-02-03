import React, { useState, useEffect, useCallback } from "react";
import {
    LocalUser,
    RemoteUser,
    useJoin,
    useLocalMicrophoneTrack,
    useLocalCameraTrack,
    usePublish,
    useRemoteUsers,
} from "agora-rtc-react";
import { useNavigate, useParams } from "react-router-dom";
import { Mic, Video, Subtitles, PhoneOff, Info, Users, MessageSquare, Settings, MicOff, VideoOff } from 'lucide-react'

const Call = () => {
    const navigate = useNavigate();
    const appId = import.meta.env.VITE_AGORA_APP_ID;
    const { community } = useParams();
    const channel = community;

    const [token, setToken] = useState("");
    const [readyToJoin, setReadyToJoin] = useState(false);

    const [micOn, setMic] = useState(true);
    const [cameraOn, setCamera] = useState(false);

    // Always create the microphone track, but control its enabled state
    const { localMicrophoneTrack } = useLocalMicrophoneTrack();
    const { localCameraTrack } = useLocalCameraTrack(cameraOn);

    usePublish([localMicrophoneTrack, localCameraTrack]);

    const remoteUsers = useRemoteUsers();

    // Function to fetch token from our server
    const fetchToken = async (channelName) => {
        try {
            const response = await fetch('https://togetherable-agoratoken-server.vercel.app/generate-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    channelName,
                    uid: 0,
                }),
            });
            const data = await response.json();
            if (data.token) {
                setToken(data.token);
                setReadyToJoin(true);
            }
        } catch (error) {
            console.error('Error fetching token:', error);
        }
    };

    const handleJoinChannel = useCallback(async () => {
        await fetchToken(channel);
    }, [channel]);

    useJoin({ appid: appId, channel: channel, token: token }, readyToJoin);

    const toggleMic = useCallback(() => {
        if (localMicrophoneTrack) {
            localMicrophoneTrack.setEnabled(!micOn);
            setMic(!micOn);
        }
    }, [localMicrophoneTrack, micOn]);

    const toggleCamera = useCallback(() => {
        setCamera(prev => !prev);
    }, []);

    const handleHangup = useCallback(() => {
        setReadyToJoin(false);
        setToken("");
        navigate(-1);
    }, [navigate]);

    useEffect(() => {
        handleJoinChannel();
    }, [handleJoinChannel]);

    useEffect(() => {
        window.scroll(0, 0)
    }, []);

    return (
        <>
            <div className="w-full h-screen flex justify-center pt-28 text-primary font-main">
                <div className="w-[85vw] flex justify-center gap-5">
                    <div className="aspect-video relative w-[55vw] h-max border border-zinc-800 rounded-lg overflow-hidden bg-secondary text-gray-300">
                        <p className="absolute z-20 flex justify-center items-center bg-black/50 text-white px-3 rounded-br-lg rounded-tl-lg">You</p>
                        <LocalUser
                            cameraOn={cameraOn}
                            micOn={micOn}
                            videoTrack={localCameraTrack}
                            cover="https://www.agora.io/en/wp-content/uploads/2022/10/3d-spatial-audio-icon.svg">
                        </LocalUser>
                        <div className="z-20 absolute bottom-0 bg-secondary/40 p-3 w-full">
                            <div className="max-w-7xl mx-auto flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <button onClick={toggleMic} className="p-3 rounded-full hover:bg-secondary/40">
                                        {micOn ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
                                    </button>
                                    <button onClick={toggleCamera} className="p-3 rounded-full hover:bg-secondary/40">
                                        {cameraOn ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
                                    </button>
                                    <button className="p-3 rounded-full hover:bg-secondary/40">
                                        <Subtitles className="h-6 w-6" />
                                    </button>
                                </div>
                                <div className="">
                                    <button onClick={handleHangup} className="p-3 rounded-full bg-red-500 hover:bg-red-600">
                                        <PhoneOff className="h-6 w-6" />
                                    </button>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="p-2 hover:bg-secondary/40 rounded-lg">
                                        <Info className="h-5 w-5" />
                                    </button>
                                    <button className="p-2 hover:bg-secondary/40 rounded-lg">
                                        <Users className="h-5 w-5" />
                                    </button>
                                    <button className="p-2 hover:bg-secondary/40 rounded-lg">
                                        <MessageSquare className="h-5 w-5" />
                                    </button>
                                    <button className="p-2 hover:bg-secondary/40 rounded-lg">
                                        <Settings className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{
                        scrollbarWidth: 'thin', // Firefox custom scrollbar width
                        scrollbarColor: '#9b4dca #2d3748', // Firefox custom thumb and track color
                    }} className="h-[30rem] space-y-5 overflow-y-auto">
                        {remoteUsers.map((user) => (
                            <div key={user.uid} className="aspect-video text-gray-300 w-[16.75vw] h-max overflow-hidden border border-zinc-800 rounded-lg bg-secondary">
                                <RemoteUser className="rounded-lg scale-x-[-1]" cover="https://www.agora.io/en/wp-content/uploads/2022/10/3d-spatial-audio-icon.svg" user={user}>
                                    <span className="absolute bottom-0 z-10 inline-flex  scale-x-[-1] items-center gap-1 text-sm bg-black/50 text-white px-3 rounded-br-lg rounded-tl-lg">{user.uid}</span>
                                </RemoteUser>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Call;