import React, { useEffect, useState } from 'react';
import { Navigate, useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { useFirebase } from '../context/firebase';
import RelativeTime from "../utils/Moment.jsx";
import DeletePostModal from '../components/DeletePostModal.jsx';
import { Heart, Save, Trash, Image } from 'lucide-react'

const CommunityPage = () => {
    const { user, getUser, loading, uploadImage, createPost, deletePost, fetchPosts, joinCommuniy, leaveCommuniy, deleteCommunity } = useFirebase();
    const navigate = useNavigate();
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
    const [postDone, setPostDone] = useState(false);
    const [leftbarLoading, setLeftbarLoading] = useState(false);
    const [postLoading, setPostLoading] = useState(false);

    useEffect(() => {
        const fetchCommunityDetails = async () => {
            setLeftbarLoading(true);
            const res = await fetchPosts(community);
            setcommunityData(res);
            setLeftbarLoading(false);
        }
        fetchCommunityDetails();
    }, [community, fetchPosts, getUser])

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
    }, [community, fetchPosts, getUser, postDone]);

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
        setPostDone(!postDone);
        setPostLoading(false);
    };

    const handleDeleteCommunity = async () => {
        await deleteCommunity(community, user.uid)
        navigate('/communities')
    }

    if (loading) {
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
            {showDeleteModal && <DeletePostModal setShowDeleteModal={setShowDeleteModal} deletePost={deletePost} communityId={community} postId={postId} postDone={postDone} setPostDone={setPostDone} />}
            <div className="container lg:w-[80vw] lg:px-0 px-2 mx-auto py-16 font-main">
                <div className="w-full py-12 text-center text-4xl font-bold">Welcome to {communityData.name}</div>
                <div className="flex lg:flex-row flex-col gap-6">
                    {/* Left Sidebar - Community Details */}
                    {leftbarLoading ? (
                        <div className="lg:w-1/5 h-[60vh] bg-secondary rounded-lg border border-zinc-800 p-6">
                            <div className='w-full flex justify-center h-full items-center '><span class="loader"></span></div>
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
                                    <div className="pt-2 w-full flex py-2 justify-center">
                                        <button onClick={() => joinCommuniy(community, user.uid)} className='px-6 py-2 bg-main rounded-lg mt-4 hover:bg-[#9036c8] disabled:bg-gray-800'>Join community</button>
                                    </div>
                                ) : (communityData.createdBy === user.uid ? (
                                    <div className="pt-2 w-full flex py-2 justify-center">
                                        <button onClick={handleDeleteCommunity} className=' text-red-400 rounded-lg hover:text-red-500'>Delete community</button>
                                    </div>
                                ) : (<div className="pt-2 w-full flex lg:justify-start justify-center">
                                    <button onClick={() => leaveCommuniy(community, user.uid)} className=' text-red-400 rounded-lg hover:text-red-500'>Leave community</button>
                                </div>
                                ))}
                                <div title='Make a phone call in community.' className="flex items-center lg:space-x-2 w-full lg:justify-start justify-center">
                                    {communityData?.members?.includes(user.uid) &&
                                        (
                                            <Link className='w-full flex justify-center' to={`/communities/${community}/call`}>
                                                <div className='bg-main rounded-lg px-4 mt-4 py-2 hover:bg-[#9036c8]'>
                                                    Group call
                                                </div>
                                            </Link>
                                        )}
                                </div>
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
                                        <label className="flex gap-1 text-gray-400 cursor-pointer" htmlFor="addMedia">
                                            <div>
                                                <Image />
                                            </div>
                                            <p>Add media</p>
                                        </label>
                                    </div>
                                    <button
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
                        {postsLoading ? (<div className='w-full flex justify-center h-[20vh] items-center '><span class="loader"></span></div>) : (posts.length > 0 ? (
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
                                        <button className="flex items-center space-x-1">
                                            <span><Heart /></span>
                                            <span>Like</span>
                                        </button>
                                        <button className="flex items-center space-x-1">
                                            <span><Save /></span>
                                            <span>Save</span>
                                        </button>
                                        {post.postedBy === user.uid || communityData.createdBy === user.uid ? (
                                            <button onClick={() => { setShowDeleteModal(!showDeleteModal); setPostId(post.id); }} className="flex items-center space-x-1">
                                                <span><Trash /></span>
                                                <span>Delete</span>
                                            </button>
                                        ) : ''}
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
                                <button className="button px-2 py-2 mt-2 bg-main rounded-lg hover:bg-[#9036c8] focus:outline-none text-primary disabled:bg-gray-800">
                                    <span className="text-button">Get pro now</span>
                                </button>
                            </span></span
                        >
                    </div>
                </div>
            </div >
        </>
    );
};

export default CommunityPage;
