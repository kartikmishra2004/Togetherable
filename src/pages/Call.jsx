import React, { useState, useEffect } from "react";
import {
    LocalUser,
    RemoteUser,
    useIsConnected,
    useJoin,
    useLocalMicrophoneTrack,
    useLocalCameraTrack,
    usePublish,
    useRemoteUsers,
} from "agora-rtc-react";
import { useNavigate, useParams } from "react-router-dom";

const Call = () => {

    const navigate = useNavigate();
    const appId = '17dcb55f4a1947f795073f276178f08a';
    const { community } = useParams();

    const [calling, setCalling] = useState(false);
    const isConnected = useIsConnected();
    const [channel, setChannel] = useState(community);
    const [token, setToken] = useState("");
    const [readyToJoin, setReadyToJoin] = useState(false);


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
            setCalling(false);
        }
    };

    const handleJoinChannel = async () => {
        setCalling(true);
        await fetchToken(channel);
    };

    useJoin({ appid: appId, channel: channel, token: token }, readyToJoin);

    const [micOn, setMic] = useState(true);
    const [cameraOn, setCamera] = useState(true);
    const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn);
    const { localCameraTrack } = useLocalCameraTrack(cameraOn);
    usePublish([localMicrophoneTrack, localCameraTrack]);

    const remoteUsers = useRemoteUsers();

    const handleHangup = () => {
        setCalling(false);
        setReadyToJoin(false);
        setToken("");
        navigate(-1);
    };

    useEffect(() => {
        handleJoinChannel()
    }, [])

    return (
        <>
            <div className="flex flex-col justify-center items-center w-full h-screen font-main">
                {isConnected && (
                    <>
                        <div className="flex gap-5 p-10 h-[60vh] w-[60vw]">
                            <div className="w-72 h-54 border border-gray-600">
                                <LocalUser
                                    cameraOn={cameraOn}
                                    micOn={micOn}
                                    videoTrack={localCameraTrack}
                                    cover="https://www.agora.io/en/wp-content/uploads/2022/10/3d-spatial-audio-icon.svg" >
                                    <span className="absolute bottom-0 z-10 inline-flex items-center gap-1 px-1 text-sm text-white bg-black">You</span>
                                </LocalUser>
                            </div>
                            {remoteUsers.map((user) => (
                                <div className="w-72 h-54 border border-gray-600" key={user.uid}>
                                    <RemoteUser cover="https://www.agora.io/en/wp-content/uploads/2022/10/3d-spatial-audio-icon.svg" user={user}>
                                        <span className="absolute bottom-0 z-10 inline-flex items-center gap-1 px-1 text-sm text-white bg-black">{user.uid}</span>
                                    </RemoteUser>
                                </div>
                            ))}
                        </div>
                        <div className="w-full flex items-center justify-center gap-3 py-3 px-6 bg-gray-800 text-gray-300">
                            <div className="flex items-center gap-3 flex-1">
                                <button className="p-2 rounded bg-transparent border border-white/10 hover:bg-gray-700" onClick={() => setMic(a => !a)}>
                                    <div className="">Mic</div>
                                </button>
                                <button className="p-2 rounded bg-transparent border border-white/10 hover:bg-gray-700" onClick={() => setCamera(a => !a)}>
                                    <div className="">Camera</div>
                                </button>
                            </div>
                            <button
                                className="px-16 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
                                onClick={handleHangup}>
                                <div className="">Hangup</div>
                            </button>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default Call;