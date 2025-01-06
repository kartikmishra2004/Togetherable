import React, { useEffect, useState } from 'react';
import { Navigate, useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { useFirebase } from '../context/firebase';
import RelativeTime from "../utils/Moment.jsx";
import phonecall from '../assets/phone-call.png'

const CommunityPage = () => {
    const { user, getUser, loading, uploadImage, createPost, fetchPosts, joinCommuniy, leaveCommuniy, deleteCommunity } = useFirebase();
    const navigate = useNavigate()
    const { community } = useParams();
    const location = useLocation();
    const { createdBy } = location.state || {};
    const [posts, setPosts] = useState([]);
    const [admin, setAdmin] = useState(null);
    const [previewPhoto, setPreviewPhoto] = useState('');
    const [formData, setFormData] = useState({
        content: '',
        photoURL: '',
    });
    const [photoUploading, setPhotoUploading] = useState(false);
    const [communityData, setcommunityData] = useState({});

    useEffect(() => {
        // Fetch posts and then fetch user data for each post
        const fetchCommunityPosts = async () => {
            const res = await fetchPosts(community);
            setcommunityData(res);
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
        };

        fetchCommunityPosts();
    }, [community, fetchPosts, getUser, formData]);

    useEffect(() => {
        getUser(createdBy).then((res) => setAdmin(res));
    }, [createdBy, getUser]);

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
        await createPost(community, formData);
        setFormData({
            content: '',
            photoURL: '',
        });
        setPreviewPhoto('');
    };

    const handleDeleteCommunity = async () => {
        await deleteCommunity(community, user.uid)
        navigate('/communities')
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center w-full h-screen">
                loading...
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="container w-[75vw] mx-auto py-16 font-main">
            <div className="w-full py-12 text-center text-4xl font-bold">Welcome to {communityData.name}</div>
            <div className="flex gap-6">
                {/* Left Sidebar - Community Details */}
                <div className="w-1/3 bg-secondary rounded-lg border border-zinc-800 p-6">
                    <div className="flex items-center gap-3 pb-4">
                        <img className="w-14 h-14 object-cover rounded-full" src={communityData.communityImage} alt="" />
                        <h2 className="text-2xl font-bold text-primary">{communityData.name}</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <span className="text-gray-400">Admin:</span>
                            <span className="text-primary">{admin?.fullName}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-gray-400">Members:</span>
                            <span className="text-primary">{communityData?.members?.length}</span>
                        </div>
                        <div className="text-gray-400">
                            <h3 className="text-lg font-semibold text-main mb-2">About</h3>
                            <p>{communityData.description}</p>
                        </div>
                        <div className="text-gray-400">
                            <h3 className="text-lg font-semibold text-main mb-2">Rules</h3>
                            <ul className="list-disc list-inside">
                                <li>Be respectful to others</li>
                                <li>No spam or self-promotion</li>
                                <li>Follow community guidelines</li>
                            </ul>
                        </div>
                        {!communityData?.members?.includes(user.uid) ? (
                            <div className="pt-2">
                                <button onClick={() => joinCommuniy(community, user.uid)} className='px-6 py-2 bg-main rounded-lg hover:bg-[#9036c8] disabled:bg-gray-800'>Join community</button>
                            </div>
                        ) : (createdBy === user.uid ? (
                            <div className="pt-2">
                                <button onClick={handleDeleteCommunity} className=' text-red-400 rounded-lg hover:text-red-500'>Delete community</button>
                            </div>
                        ) : (<div className="pt-2">
                            <button onClick={() => leaveCommuniy(community, user.uid)} className=' text-red-400 rounded-lg hover:text-red-500'>Leave community</button>
                        </div>
                        ))}
                        <div title='Make a phone call in community.' className="flex items-center space-x-2">
                            {communityData?.members?.includes(user.uid) &&
                                (
                                    <Link to={`/communities/${community}/call`}>
                                        <div className='bg-main rounded-lg px-4 py-2 hover:bg-[#9036c8]'>
                                            Group call
                                        </div>
                                    </Link>
                                )}
                        </div>
                    </div>
                </div>
                {/* Right Content Area */}
                <div className="w-2/3 space-y-6">
                    {/* Create Post Box */}
                    {communityData?.members?.includes(user.uid) && (
                        <div className="bg-secondary rounded-lg border border-zinc-800 p-6">
                            <div className="w-full pb-4">
                                <img
                                    src={previewPhoto}
                                    className={`w-48 rounded-lg ${previewPhoto ? 'border' : ''} border-zinc-800 ${photoUploading ? 'animate-pulse' : ''}`}
                                    alt=""
                                />
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
                                    <label className="flex gap-1 cursor-pointer" htmlFor="addMedia">
                                        <div>
                                            <svg
                                                fill="#ebebeb"
                                                className="w-6 h-6"
                                                xmlns="http://www.w3.org/2000/svg"
                                                xmlSpace="preserve"
                                                id="image"
                                                width="512"
                                                height="512"
                                                x="0"
                                                y="0"
                                                version="1.1"
                                                viewBox="0 0 512 512"
                                            >
                                                <path d="M368 224c26.5 0 48-21.5 48-48s-21.5-48-48-48-48 21.5-48 48 21.5 48 48 48z"></path>
                                                <path d="M452 64H60c-15.6 0-28 12.7-28 28.3v327.4c0 15.6 12.4 28.3 28 28.3h392c15.6 0 28-12.7 28-28.3V92.3c0-15.6-12.4-28.3-28-28.3zM348.9 261.7c-3-3.5-7.6-6.2-12.8-6.2-5.1 0-8.7 2.4-12.8 5.7L304.6 277c-3.9 2.8-7 4.7-11.5 4.7-4.3 0-8.2-1.6-11-4.1-1-.9-2.8-2.6-4.3-4.1L224 215.3c-4-4.6-10-7.5-16.7-7.5-6.7 0-12.9 3.3-16.8 7.8L64 368.2V107.7c1-6.8 6.3-11.7 13.1-11.7h357.7c6.9 0 12.5 5.1 12.9 12l.3 260.4-99.1-106.7z"></path>
                                            </svg>
                                        </div>
                                        <p>Add media</p>
                                    </label>
                                </div>
                                <button
                                    disabled={photoUploading || !formData.content}
                                    onClick={post}
                                    className={`px-6 disabled:cursor-not-allowed py-2 bg-main rounded-lg hover:bg-[#9036c8] disabled:bg-gray-800`}>
                                    {photoUploading ? 'Please wait...' : 'Post'}
                                </button>
                            </div>
                        </div>
                    )}
                    {/* Posts Feed */}
                    <div
                        className="bg-secondary rounded-lg border border-zinc-800 p-6 max-h-[90vh] min-h-[75vh] overflow-y-auto"
                        style={{
                            scrollbarWidth: 'thin', // Firefox custom scrollbar width
                            scrollbarColor: '#9b4dca #2d3748', // Firefox custom thumb and track color
                        }}
                    >
                        {/* Posts */}
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
                                    {post.photoURL && <img src={post.photoURL} className="w-60 rounded-lg" alt="" />}
                                    <div className="flex space-x-4 text-gray-400">
                                        <button className="flex items-center space-x-1 hover:text-main">
                                            <span>👍</span>
                                            <span>123</span>
                                        </button>
                                        <button className="flex items-center space-x-1 hover:text-main">
                                            <span>💾</span>
                                            <span>save</span>
                                        </button>
                                        {post.postedBy === user.uid ? (
                                            <button className="flex items-center space-x-1 hover:text-main">
                                                <span>🗑️</span>
                                                <span>delete</span>
                                            </button>
                                        ) : ''}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="h-[80vh] flex justify-center items-center">No posts</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommunityPage;
