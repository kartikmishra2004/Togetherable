import React, { useState, useEffect } from 'react'
import { useFirebase } from '../context/firebase';
import RelativeTime from "../utils/Moment.jsx";
import { Heart, Volume2, SaveOff } from 'lucide-react';
import { useScript } from '../context/TTScontext';

const SavedPosts = () => {
    const { user, getSavedPosts, getUser, unsavePost } = useFirebase();
    const { isScriptAdded } = useScript();
    const [posts, setPosts] = useState([]);
    const [postsLoading, setPostsLoading] = useState(true);
    const [saveLoadingMap, setSaveLoadingMap] = useState({});

    useEffect(() => {
        const fetchSavedPosts = async () => {
            try {
                setPostsLoading(true);
                const savedPosts = await getSavedPosts();

                // Fetch user data for each post
                const postsWithUserData = await Promise.all(
                    savedPosts.map(async (post) => {
                        const userData = await getUser(post.postedBy);
                        return {
                            ...post,
                            postedByFullName: userData.fullName,
                            postedByPhotoURL: userData.photoURL
                        };
                    })
                );

                setPosts(postsWithUserData);
                setPostsLoading(false);
            } catch (error) {
                console.error('Error fetching saved posts:', error);
                setPostsLoading(false);
            }
        };

        fetchSavedPosts();
    }, []);

    const unsave = async (userID, postID) => {
        setSaveLoadingMap(prev => ({ ...prev, [postID]: true }));
        await unsavePost(userID, postID);
        setSaveLoadingMap(prev => ({ ...prev, [postID]: false }));

        // Remove unsaved post from the list
        setPosts(prevPosts => prevPosts.filter(post => post.id !== postID));
    };

    if (postsLoading) {
        return (
            <div className='w-full min-h-[50vh] flex justify-center pt-24'>
                <span className="loader"></span>
            </div>
        );
    }

    return (
        <div className='w-full min-h-[50vh] max-w-[46vw] mx-auto'>
            <div className="space-y-8 max-w-[80vw] mx-auto">
                {posts.length > 0 ? (
                    posts.map((post, key) => (
                        <div key={key} className="mb-6 last:mb-0 p-4 bg-[#14141c] rounded-lg border border-zinc-800">
                            <div className="flex items-center space-x-3 mb-4">
                                <img
                                    className="w-10 h-10 rounded-full object-cover"
                                    src={post.postedByPhotoURL}
                                    alt={post.postedByFullName}
                                />
                                <div>
                                    <h4 className="text-primary font-semibold">{post.postedByFullName}</h4>
                                    <RelativeTime timestamp={post.timestamp} className="text-sm"></RelativeTime>
                                </div>
                            </div>
                            <p className="text-primary text-xl my-4">{post.content}</p>
                            {post.photoURL && <img src={post.photoURL} className="w-60 rounded-lg border border-zinc-800" alt="" />}

                            <div className="flex space-x-8 pt-3 mt-2 text-gray-400">
                                <button onMouseEnter={isScriptAdded ? () => responsiveVoice.speak("Like") : null} className="flex items-center space-x-1">
                                    <span><Heart /></span>
                                    <span>Like</span>
                                </button>
                                {saveLoadingMap[post.id] ? (
                                    <div className='flex items-center space-x-1'>
                                        <div role="status">
                                            <svg aria-hidden="true" className="inline w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-main" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                            </svg>
                                            <span className='ml-2'>Unsave</span>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => unsave(user.uid, post.id)}
                                        onMouseEnter={isScriptAdded ? () => responsiveVoice.speak("Unsave") : null}
                                        className="flex items-center space-x-1"
                                    >
                                        <span><SaveOff /></span>
                                        <span>Unsave</span>
                                    </button>
                                )}

                                {isScriptAdded && (
                                    <button
                                        onMouseEnter={() => responsiveVoice.speak("Play")}
                                        onClick={() => responsiveVoice.speak(post.content)}
                                        className="flex items-center space-x-1"
                                    >
                                        <span><Volume2 /></span>
                                        <span>Play</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="h-[40vh] flex justify-center items-center text-gray-400">
                        No saved posts
                    </div>
                )}
            </div>
        </div>
    )
}

export default SavedPosts;