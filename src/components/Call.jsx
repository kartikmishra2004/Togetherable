import React from 'react'
import { Link } from 'react-router-dom'

const Call = ({ communityId }) => {
    return (
        <div className='w-full h-[50vh] flex justify-center items-center'>
            <Link to={`/communities/${communityId}/call`}>Make call</Link>
        </div>
    )
}

export default Call
