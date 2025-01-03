import React, { useEffect, useState } from 'react'
import { Navigate, useParams, useLocation } from 'react-router-dom';
import { useFirebase } from '../context/firebase';

const CommunityPage = () => {

    const { user, getUser, loading } = useFirebase();
    const { community } = useParams();
    const location = useLocation();
    const { id, name, description, communityImage, createdBy, members } = location.state || {};

    const [admin, setAdmin] = useState(null);

    useEffect(() => {
        window.scroll(0, 0);
        getUser(createdBy)
            .then((res) => setAdmin(res))
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center w-full h-screen">
                loading...
            </div>
        )
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="container w-[75vw] mx-auto py-16 font-main">
            <div className="w-full py-12 text-center text-4xl font-bold">Wellcome to {name}</div>
            <div className="flex gap-6">
                {/* Left Sidebar - Community Details */}
                <div className="w-1/3 bg-secondary rounded-lg border border-zinc-800 p-6">
                    <div className="flex items-center gap-3 pb-4">
                        <img className='w-14 h-14 object-cover rounded-full' src={communityImage} alt="" />
                        <h2 className="text-2xl font-bold text-primary">{name}</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <span className="text-gray-400">Admin:</span>
                            <span className="text-primary">{admin?.fullName}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-gray-400">Members:</span>
                            <span className="text-primary">{members.length}</span>
                        </div>
                        <div className="text-gray-400">
                            <h3 className="text-lg font-semibold text-main mb-2">About</h3>
                            <p>{description}</p>
                        </div>
                        <div className="text-gray-400">
                            <h3 className="text-lg font-semibold text-main mb-2">Rules</h3>
                            <ul className="list-disc list-inside">
                                <li>Be respectful to others</li>
                                <li>No spam or self-promotion</li>
                                <li>Follow community guidelines</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Right Content Area */}
                <div className="w-2/3 space-y-6">
                    {/* Create Post Box */}
                    <div className="bg-secondary rounded-lg border border-zinc-800 p-6">
                        <h3 className="text-xl font-semibold text-primary">Create a Post</h3>
                        <textarea
                            className="border focus:outline-none resize-none my-2 placeholder:text-zinc-700 border-zinc-500 h-20 rounded-lg w-full px-2 py-3 bg-secondary leading-tight"
                            placeholder="What's on your mind?"
                        />
                        <div className="flex justify-end">
                            <button className="px-6 py-2 bg-main rounded-lg hover:bg-[#9036c8]">
                                Post
                            </button>
                        </div>
                    </div>

                    {/* Posts Feed */}
                    <div
                        className="bg-secondary rounded-lg border border-zinc-800 p-6 max-h-[calc(100vh-20rem)] overflow-y-auto"
                        style={{
                            scrollbarWidth: "thin", // Firefox custom scrollbar width
                            scrollbarColor: "#9b4dca #2d3748", // Firefox custom thumb and track color
                        }}
                    >
                        {/* Sample Posts */}
                        {[1, 2, 3, 4, 5].map((post) => (
                            <div key={post} className="mb-6 last:mb-0 p-4 bg-[#14141c] rounded-lg border border-zinc-800">
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-primary"></div>
                                    <div>
                                        <h4 className="text-primary font-semibold">Username</h4>
                                        <p className="text-sm text-gray-400">2 hours ago</p>
                                    </div>
                                </div>
                                <p className="text-gray-400 mb-4">
                                    This is a sample post content. It can contain text, images, and other media.
                                </p>
                                <div className="flex space-x-4 text-gray-400">
                                    <button className="flex items-center space-x-2 hover:text-main">
                                        <span>👍</span>
                                        <span>123</span>
                                    </button>
                                    <button className="flex items-center space-x-2 hover:text-main">
                                        <span>💾</span>
                                        <span>save</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    )
}

export default CommunityPage
