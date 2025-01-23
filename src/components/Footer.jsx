import React, { useState, useEffect } from 'react'
import { useFirebase } from '../context/firebase';
import { collection, addDoc } from "firebase/firestore";
import { useScript } from '../context/TTScontext';

const Footer = () => {
    const { user, firestore } = useFirebase();
    const { isScriptAdded } = useScript()

    const [messageData, setMessageData] = useState({
        email: '',
        message: '',
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setMessageData((prevData) => ({
                ...prevData,
                email: localStorage.getItem('userEmail') || user.email
            }));
        }
    }, [user]);

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        if (name === 'email') {
            localStorage.setItem('userEmail', value);
        }

        setMessageData({
            ...messageData,
            [name]: value,
        });
    }

    const handleSend = async (e) => {
        setLoading(true);
        e.preventDefault();
        const docRef = await addDoc(collection(firestore, "messages"), messageData);
        setLoading(false);
        setMessageData({
            ...messageData,
            message: '',
        })
    }

    return (
        <footer className="bg-secondary text-primary border-t border-zinc-800 font-main">
            <div className="max-w-screen-xl py-4 px-4 sm:px-6 sm:flex justify-between mx-auto">
                <div className="p-5 flex items-center sm:w-8/12">
                    <h3 className="font-bold text-3xl mb-4 font-logo">Togetherable</h3>
                </div>
                <div className="p-5 sm:w-4/12">
                    <h3 className="font-medium text-lg mb-4">Contact us</h3>
                    <form className="mt-4">
                        <input
                            autoComplete='off'
                            value={messageData.email}
                            className="border focus:outline-none placeholder:text-zinc-700 border-zinc-500 rounded-lg w-full px-2 py-3 bg-secondary text-zinc-500 leading-tight"
                            type="email"
                            name='email'
                            placeholder="username@email.com"
                            onChange={handleChange}
                        />
                        <textarea
                            autoComplete='off'
                            value={messageData.message}
                            className="border focus:outline-none resize-none my-4 placeholder:text-zinc-700 border-zinc-500 h-24 rounded-lg w-full px-2 py-3 bg-secondary text-zinc-500 leading-tight"
                            placeholder="Type your message..."
                            name='message'
                            onChange={handleChange}
                        ></textarea>
                        <button onMouseEnter={isScriptAdded ? () => responsiveVoice.speak("Send") : null} disabled={loading ? true : false || messageData.email === '' || messageData.message === ''} onClick={handleSend} className={`px-4 ${messageData.email === '' || messageData.message === '' ? 'cursor-not-allowed' : 'cursor-pointer'} w-full py-3 bg-main rounded-lg hover:bg-[#9036c8] focus:outline-none disabled:bg-gray-800`}>{loading ? 'Please wait...' : 'Send'}</button>
                    </form>
                </div>
            </div>
            <div className="flex py-5 m-auto text-zinc-500 text-sm flex-col items-center border-t border-zinc-500 max-w-screen-xl">
                <p>© Copyright 2024. All Rights Reserved.</p>
            </div>
        </footer>
    )
}

export default Footer;
