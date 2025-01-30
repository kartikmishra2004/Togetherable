import React, { useEffect, useState } from 'react';
import MapUtil from '../utils/MapUtil';
import { useFirebase } from '../context/firebase.jsx'

const Map = ({ communityId }) => {

    const { fetchCommunityMembers } = useFirebase();
    const [users, setUsers] = useState();

    useEffect(() => {
        fetchCommunityMembers(communityId)
            .then((res) => setUsers(res))
    }, [])

    return (
        <div className='w-full lg:h-[80vh] h-max flex justify-center'>
            <MapUtil users={users} />
        </div>
    )
}

export default Map
