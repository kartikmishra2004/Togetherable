import React, { useEffect, useState } from 'react'
import { useFirebase } from '../context/firebase';
import { Link } from 'react-router-dom';

const YourCommunities = () => {

    const { user, fetchJoinedCommunities } = useFirebase();
    const [joinedCommunities, setJoinnedCommunities] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {

        if (user) {
            setLoading(true);
            fetchJoinedCommunities(user?.uid)
                .then((res) => setJoinnedCommunities(res))
                .then(() => setLoading(false))
        }
    }, [])

    if (loading) {
        return (
            <div className='w-full h-[50vh] flex justify-center pt-24'><span className="loader"></span></div>
        )
    }

    return (
        <div className='w-full min-h-[50vh] font-main'>
            <ul className="space-y-8 lg:w-[80vw] lg:px-0 px-3 mx-auto">
                {joinedCommunities.map((data, key) => (
                    <li key={key} className="text-sm leading-6">
                        <div className="relative group">
                            <div
                                className="absolute transition rounded-lg opacity-25 inset-1 bg-gradient-to-r from-purple-600 to-[#9036c8] duration-400 group-hover:opacity-100 group-hover:duration-200">
                            </div><Link to={`/communities/${data.id}`} state={{ createdBy: data.createdBy }} className="cursor-pointer">
                                <div
                                    className="relative p-6 space-y-6 leading-none rounded-lg bg-secondary border border-zinc-800 hover:shadow-sm hover:shadow-main transition-all duration-300 ease-in-out">
                                    <div className="flex items-center space-x-4"><img
                                        src={data.communityImage}
                                        className="w-12 h-12 bg-center bg-primary object-cover rounded-full" alt="Kanye West" />
                                        <div>
                                            <h3 className="text-lg font-semibold text-primary">{data.name}</h3>
                                            <p className="text-gray-500 text-md">{data.members.length} members</p>
                                        </div>
                                    </div>
                                    <p className="leading-normal text-gray-300 text-md">{data.description}</p>
                                </div>
                            </Link>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default YourCommunities
