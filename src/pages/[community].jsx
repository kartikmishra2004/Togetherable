import React, { useEffect, useState } from 'react';
import { Navigate, useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { useFirebase } from '../context/firebase';
import RelativeTime from "../utils/Moment.jsx";
import DeletePostModal from '../components/DeletePostModal.jsx';
import { Heart, Save, Trash, Image, Volume2, SaveOff, HeartOff } from 'lucide-react';
import { useScript } from '../context/TTScontext';
import Chat from '../components/Chat.jsx';
import Call from '../components/Call.jsx';
import Map from '../components/Map.jsx';

const CommunityPage = () => {
    const { user, getUser, userData, loading, uploadImage, createPost, deletePost, fetchPosts, joinCommuniy, leaveCommuniy, deleteCommunity, savePost, unsavePost, likePost, unlikePost } = useFirebase();
    const navigate = useNavigate();
    const { isScriptAdded } = useScript();
    const { community } = useParams();
    const location = useLocation();
    const [posts, setPosts] = useState([]);
    const [admin, setAdmin] = useState('');
    const [previewPhoto, setPreviewPhoto] = useState('');
    const [formData, setFormData] = useState({
        content: '',
        photoURL: '',
    });
    const [photoUploading, setPhotoUploading] = useState(false);
    const [communityData, setcommunityData] = useState({});
    const [postsLoading, setPostsLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [postId, setPostId] = useState('');
    const [postLoading, setPostLoading] = useState(false);
    const [communityTriggers, setCommunityTriggers] = useState({
        postDone: false,
        joinCloading: false,
        leftbarLoading: false,
    });
    const [activeTab, setActiveTab] = useState('dashboard');

    useEffect(() => {
        const fetchCommunityDetails = async () => {
            setCommunityTriggers(prev => ({ ...prev, leftbarLoading: true }));
            const res = await fetchPosts(community);
            setcommunityData(res);
            setCommunityTriggers(prev => ({ ...prev, leftbarLoading: false }));
        }
        fetchCommunityDetails();
    }, [community, communityTriggers.joinCloading])

    useEffect(() => {
        // Fetch posts and then fetch user data for each post
        const fetchCommunityPosts = async () => {
            setPostsLoading(true);
            const res = await fetchPosts(community);
            await getUser(res.createdBy).then((res) => setAdmin(res));
            if (res.posts?.length > 0) {
                const sortedPosts = res.posts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                // Fetch user data for each post
                const postsWithUserData = await Promise.all(
                    sortedPosts.map(async (post) => {
                        const userData = await getUser(post.postedBy);
                        return { ...post, postedByFullName: userData.fullName, postedByPhotoURL: userData.photoURL };
                    })
                );
                setPosts(postsWithUserData);
            }
            setPostsLoading(false);
        };
        fetchCommunityPosts();
    }, [community, communityTriggers.postDone]);

    useEffect(() => {
        window.scroll(0, 0);
    }, [location]);

    const handlePhotoChange = async (e) => {
        setPhotoUploading(true);
        const file = e.target.files[0];
        if (file) {
            setPreviewPhoto(URL.createObjectURL(file));
            const url = await uploadImage(file);
            setPhotoUploading(false);
            setFormData({
                ...formData,
                photoURL: url,
            });
        }
    };

    const post = async () => {
        setPostLoading(true);
        await createPost(community, formData);
        setFormData({
            content: '',
            photoURL: '',
        });
        setPreviewPhoto('');
        setCommunityTriggers(prev => ({ ...prev, postDone: !prev.postDone }));
        setPostLoading(false);
    };

    const handleDeleteCommunity = async () => {
        await deleteCommunity(community, user.uid)
        navigate('/communities')
    }

    const joinTheCommuniy = async () => {
        setCommunityTriggers(prev => ({ ...prev, joinCloading: true }));
        await joinCommuniy(community, user.uid);
        setCommunityTriggers(prev => ({ ...prev, joinCloading: false }));
    }

    const leaveTheCommunity = async () => {
        setCommunityTriggers(prev => ({ ...prev, joinCloading: true }));
        await leaveCommuniy(community, user.uid);
        setCommunityTriggers(prev => ({ ...prev, joinCloading: false }));
    }

    const [saveLoadingMap, setSaveLoadingMap] = useState({});

    const save = async (userID, postID) => {
        setSaveLoadingMap(prev => ({ ...prev, [postID]: true }));
        await savePost(userID, postID)
        setSaveLoadingMap(prev => ({ ...prev, [postID]: false }));
    }

    const unsave = async (userID, postID) => {
        setSaveLoadingMap(prev => ({ ...prev, [postID]: true }));
        await unsavePost(userID, postID)
        setSaveLoadingMap(prev => ({ ...prev, [postID]: false }));
    }


    const [likeLoadingMap, setLikeLoadingMap] = useState({});

    const handleLikePost = async (postId) => {
        setLikeLoadingMap(prev => ({ ...prev, [postId]: true }));
        await likePost(community, postId, user.uid);
        setPosts(prevPosts =>
            prevPosts.map(post =>
                post.id === postId
                    ? {
                        ...post,
                        likedBy: post.likedBy?.includes(user.uid)
                            ? post.likedBy.filter(uid => uid !== user.uid)
                            : [...(post.likedBy || []), user.uid]
                    }
                    : post
            )
        );
        setLikeLoadingMap(prev => ({ ...prev, [postId]: false }));
    };

    const handleUnlikePost = async (postId) => {
        setLikeLoadingMap(prev => ({ ...prev, [postId]: true }));
        await unlikePost(community, postId, user.uid);
        setPosts(prevPosts =>
            prevPosts.map(post =>
                post.id === postId
                    ? {
                        ...post,
                        likedBy: post.likedBy.filter(uid => uid !== user.uid)
                    }
                    : post
            )
        );
        setLikeLoadingMap(prev => ({ ...prev, [postId]: false }));
    };

    if (loading || communityTriggers.joinCloading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="jelly"></div>
                <svg width="0" height="0" className="jelly-maker">
                    <defs>
                        <filter id="uib-jelly-ooze">
                            <feGaussianBlur in="SourceGraphic" stdDeviation="6.25" result="blur"></feGaussianBlur>
                            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="ooze"></feColorMatrix>
                            <feBlend in="SourceGraphic" in2="ooze"></feBlend>
                        </filter>
                    </defs>
                </svg>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    return (
        <>
            {showDeleteModal && <DeletePostModal setShowDeleteModal={setShowDeleteModal} deletePost={deletePost} communityId={community} postId={postId} setCommunityTriggers={setCommunityTriggers} />}
            <div className="container lg:w-[80vw] lg:px-0 px-3 mx-auto py-16 font-main">
                <div className="w-full py-12 text-center text-4xl font-bold">Welcome to {communityData.name}</div>
                <div className="mb-12 md:text-center text-primary font-main">
                    <div className="w-full">
                        <div className="flex justify-evenly lg:max-w-[32rem] max-w-[80vw] gap-1 p-2 mx-auto my-2 bg-secondary border border-zinc-800 rounded-lg" role="group">
                            <button onClick={() => setActiveTab('dashboard')} type="button" className={`px-5 ${activeTab === 'dashboard' ? 'bg-gray-800' : ''} py-2 w-[15rem] rounded-lg lg:text-base text-xs`}>
                                Dashboard
                            </button>
                            <button onClick={() => setActiveTab('chat')} type="button" className={`px-5 ${activeTab === 'chat' ? 'bg-gray-800' : ''} py-2 w-[15rem] rounded-lg lg:text-base text-xs`}>
                                Chat
                            </button>
                            <button onClick={() => setActiveTab('call')} type="button" className={`px-5 ${activeTab === 'call' ? 'bg-gray-800' : ''} py-2 w-[15rem] rounded-lg lg:text-base text-xs`}>
                                Call
                            </button>
                            <button onClick={() => setActiveTab('map')} type="button" className={`px-5 ${activeTab === 'map' ? 'bg-gray-800' : ''} py-2 w-[15rem] rounded-lg lg:text-base text-xs`}>
                                Map
                            </button>
                        </div>
                    </div>
                </div>
                {activeTab === 'dashboard' ? (
                    <div className="flex lg:flex-row flex-col gap-6">
                        {/* Left Sidebar - Community Details */}
                        {communityTriggers.leftbarLoading ? (
                            <div className="lg:w-1/5 h-[67vh] bg-secondary rounded-lg border border-zinc-800 p-6">
                                <div className='w-full flex justify-center h-full items-center '><span className="loader"></span></div>
                            </div>
                        ) : (
                            <div className="lg:w-1/5 h-max bg-secondary rounded-lg border border-zinc-800 p-6">
                                <div className="flex items-center gap-3 pb-4">
                                    <img className="w-14 h-14 object-cover rounded-full" src={communityData.communityImage} alt="" />
                                    <h2 className="text-base font-bold text-primary">{communityData.name}</h2>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-gray-400 text-sm">Admin:</span>
                                        <span className="text-primary text-sm">{admin?.fullName}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-gray-400 text-sm">Members:</span>
                                        <span className="text-primary text-sm">{communityData?.members?.length}</span>
                                    </div>
                                    <div className="text-gray-400">
                                        <h3 className="font-semibold text-main mb-1">About</h3>
                                        <p className='text-sm'>{communityData.description}</p>
                                    </div>
                                    <div className="text-gray-400">
                                        <h3 className="font-semibold text-main mb-1">Rules</h3>
                                        <ul className="list-disc list-inside text-sm">
                                            <li>Be respectful to others</li>
                                            <li>No spam or self-promotion</li>
                                        </ul>
                                    </div>
                                    {!communityData?.members?.includes(user.uid) ? (
                                        <div onMouseEnter={isScriptAdded ? () => responsiveVoice.speak("Join community") : null} className="pt-2 w-full flex py-2 justify-center">
                                            <button onClick={joinTheCommuniy} className='px-6 py-2 bg-main rounded-lg mt-4 hover:bg-[#9036c8] disabled:bg-gray-800'>Join community</button>
                                        </div>
                                    ) : (communityData.createdBy === user.uid ? (
                                        <div className="pt-2 w-full flex py-2 justify-center">
                                            <button onMouseEnter={isScriptAdded ? () => responsiveVoice.speak("Delete community") : null} onClick={handleDeleteCommunity} className=' text-red-400 rounded-lg hover:text-red-500'>Delete community</button>
                                        </div>
                                    ) : (<div className="pt-2 w-full flex lg:justify-start justify-center">
                                        <button onMouseEnter={isScriptAdded ? () => responsiveVoice.speak("Leave community") : null} onClick={leaveTheCommunity} className=' text-red-400 rounded-lg hover:text-red-500'>Leave community</button>
                                    </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {/* Right Content Area */}
                        <div className="lg:w-3/5 space-y-6">
                            {/* Create Post Box */}
                            {communityData?.members?.includes(user.uid) && (
                                <div className="bg-secondary rounded-lg border border-zinc-800 p-4">
                                    <div className={`w-full ${previewPhoto ? 'pb-4' : ''}`}>
                                        <div className="relative w-max">
                                            <img
                                                src={previewPhoto}
                                                className={`w-48 rounded-lg ${previewPhoto ? 'border' : ''} border-zinc-800 ${photoUploading ? 'animate-pulse' : ''}`}
                                                alt=""
                                            /><button
                                                onClick={() => setPreviewPhoto('')}
                                                className={`absolute top-0 w-5 ${previewPhoto ? 'flex' : "hidden"} justify-center items-center h-5 right-0 bg-red-500/70 hover:bg-red-500/90 pb-0.5 mt-1 mr-1 text-white rounded-full`}
                                            >x</button>
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-semibold text-primary">Create a Post</h3>
                                    <textarea
                                        disabled={photoUploading ? true : false}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        name="content"
                                        value={formData.content}
                                        className="border focus:outline-none resize-none my-2 placeholder:text-zinc-700 border-zinc-500 h-20 rounded-lg w-full px-2 py-3 bg-secondary leading-tight"
                                        placeholder="What's on your mind?"
                                    />
                                    <div className="flex justify-between">
                                        <div className="flex justify-center items-center gap-1">
                                            <input accept="image/*" type="file" className="hidden" id="addMedia" onChange={handlePhotoChange} />
                                            <label onMouseEnter={isScriptAdded ? () => responsiveVoice.speak("Add media") : null} className="flex gap-1 text-gray-400 cursor-pointer" htmlFor="addMedia">
                                                <div>
                                                    <Image />
                                                </div>
                                                <p>Add media</p>
                                            </label>
                                        </div>
                                        <button
                                            onMouseEnter={isScriptAdded ? () => responsiveVoice.speak("Post") : null}
                                            disabled={photoUploading || postLoading || !formData.content}
                                            onClick={post}
                                            className={`px-6 disabled:cursor-not-allowed py-2 bg-main rounded-lg hover:bg-[#9036c8] disabled:bg-gray-800`}>
                                            {photoUploading || postLoading ? 'Please wait...' : 'Post'}
                                        </button>
                                    </div>
                                </div>
                            )}
                            {/* Posts Feed */}

                            {/* Posts */}
                            {postsLoading ? (<div className='w-full flex justify-center h-[20vh] items-center '><span className="loader"></span></div>) : (posts.length > 0 ? (
                                posts.map((post, key) => (
                                    <div key={key} className="mb-6 last:mb-0 p-4 bg-[#14141c] rounded-lg border border-zinc-800">
                                        <div className="flex items-center space-x-3 mb-4">
                                            <img
                                                className="w-10 h-10 rounded-full object-cover"
                                                src={post.postedByPhotoURL}
                                                alt={post.postedByFullName} />
                                            <div>
                                                <h4 className="text-primary font-semibold">{post.postedByFullName}</h4>
                                                <RelativeTime timestamp={post.timestamp} className="text-sm"></RelativeTime>
                                            </div>
                                        </div>
                                        <p className="text-primary text-xl my-4">{post.content}</p>
                                        {post.photoURL && <img src={post.photoURL} className="w-60 rounded-lg border border-zinc-800" alt="" />}
                                        <div className="flex space-x-8 pt-3 mt-2 text-gray-400">
                                            {
                                                post.likedBy?.includes(user.uid) ? (likeLoadingMap[post.id] ? (
                                                    <div className='flex items-center space-x-1'>
                                                        <div role="status">
                                                            <svg aria-hidden="true" className="inline w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-main" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                                            </svg>
                                                            <span className='ml-3'>{post.likedBy?.length}</span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => handleUnlikePost(post.id)}
                                                        onMouseEnter={isScriptAdded ? () => responsiveVoice.speak("Unlike") : null}
                                                        className="flex items-center">
                                                        <div><HeartOff /></div>
                                                        <div className='ml-2'>{post.likedBy?.length}</div>
                                                    </button>
                                                )) : (likeLoadingMap[post.id] ? (
                                                    <div className='flex items-center'>
                                                        <div role="status">
                                                            <svg aria-hidden="true" className="inline w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-main" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                                            </svg>
                                                            <span className='ml-3'>{post.likedBy?.length}</span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => handleLikePost(post.id)}
                                                        onMouseEnter={isScriptAdded ? () => responsiveVoice.speak("Like") : null}
                                                        className="flex items-center">
                                                        <div><Heart /></div>
                                                        <div className='ml-2'>{post.likedBy?.length}</div>
                                                    </button>
                                                ))
                                            }
                                            {userData?.savedPosts?.includes(post.id) ? (saveLoadingMap[post.id] ? (
                                                <div className='flex items-center space-x-1'><div role="status">
                                                    <svg aria-hidden="true" class="inline w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-main" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                                    </svg><span className='ml-2'>Unsave</span>
                                                </div></div>
                                            ) :
                                                (<button onClick={() => unsave(user.uid, post.id)} onMouseEnter={isScriptAdded ? () => responsiveVoice.speak("Unsave") : null} className="flex items-center space-x-1">
                                                    <span><SaveOff /></span>
                                                    <span>Unsave</span>
                                                </button>)
                                            ) : (saveLoadingMap[post.id] ? (
                                                <div className='flex items-center space-x-1'><div role="status">
                                                    <svg aria-hidden="true" class="inline w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-main" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                                    </svg><span className='ml-2'>Save</span>
                                                </div></div>
                                            ) :
                                                (<button onClick={() => save(user.uid, post.id)} onMouseEnter={isScriptAdded ? () => responsiveVoice.speak("Save") : null} className="flex items-center space-x-1">
                                                    <span><Save /></span>
                                                    <span>Save</span>
                                                </button>)
                                            )}
                                            {post.postedBy === user.uid || communityData.createdBy === user.uid ? (
                                                <button onMouseEnter={isScriptAdded ? () => responsiveVoice.speak("Delete") : null} onClick={() => { setShowDeleteModal(!showDeleteModal); setPostId(post.id); }} className="flex items-center space-x-1">
                                                    <span><Trash /></span>
                                                    <span>Delete</span>
                                                </button>
                                            ) : ''}
                                            {isScriptAdded ? (<button onMouseEnter={isScriptAdded ? () => responsiveVoice.speak("Play") : null} onClick={() => responsiveVoice.speak(post.content)} className="flex items-center space-x-1">
                                                <span><Volume2 /></span>
                                                <span>Play</span>
                                            </button>) : ''}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="h-[40vh] flex justify-center items-center">No posts</div>
                            ))}
                        </div>
                        <div className="card w-1/5 hidden lg:block rounded-lg border border-zinc-800 font-main">
                            <span className="title"
                            >Pro
                                <p className="pricing">$8 <span className="pricing-time">/ month</span></p>
                                <span className="sub-title"
                                >Everything on Basic plus:
                                    <ul className="list">
                                        <li className="list-item"><span className="check">✓</span> Feature</li>
                                        <li className="list-item"><span className="check">✓</span> Feature</li>
                                        <li className="list-item"><span className="check">✓</span> Feature</li>
                                        <li className="list-item"><span className="check">✓</span> Feature</li>
                                        <li className="list-item"><span className="check">✓</span> Feature</li>
                                    </ul>
                                    <button onMouseEnter={isScriptAdded ? () => responsiveVoice.speak("Get pro now") : null} className="button px-2 py-2 mt-2 bg-main rounded-lg hover:bg-[#9036c8] focus:outline-none text-primary disabled:bg-gray-800">
                                        <span className="text-button">Get pro now</span>
                                    </button>
                                </span>
                            </span>
                        </div>
                    </div>) : ''}
                {activeTab === 'chat' ? (<Chat communityId={community} userData={userData} />) : ''}
                {activeTab === 'call' ? (<Call />) : ''}
                {activeTab === 'map' ? (<Map />) : ''}
            </div>
        </>
    );
};

export default CommunityPage;
