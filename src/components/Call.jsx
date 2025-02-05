import React from 'react'
import { Link } from 'react-router-dom'
import { AlertCircle } from "lucide-react"

const Call = ({ communityId }) => {
    return (
        <>
            <div className='w-full h-[50vh] justify-center items-center lg:flex hidden font-main text-primary'>
                <div className="container mx-auto p-4">
                    <h1 className="text-2xl font-bold mb-4">Welcome to Togetherable group video call.</h1>
                    <div className="bg-secondary border border-zinc-800 text-zinc-400 p-4 mb-5 rounded-md shadow-md">
                        <div className="flex items-center mb-2">
                            <AlertCircle className="w-6 h-6 mr-2 text-main" />
                            <h2 className="text-lg font-semibold text-main">Important Instructions</h2>
                        </div>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Please don't refresh the page during the call.</li>
                            <li>Allow your microphone permission.</li>
                            <li>Allow your video permission.</li>
                            <li>Be respectful to everyone.</li>
                        </ul>
                    </div>
                    <Link className='px-3 py-3 bg-main rounded-lg hover:bg-[#9036c8] focus:outline-none disabled:bg-gray-800' to={`/communities/${communityId}/call`}>Make call</Link>
                </div>
            </div>
            <div className='w-full h-[50vh] justify-center items-center lg:hidden space-y-2 flex flex-col font-main'>
                <h1>: (</h1>
                <h1 className='text-lg text-center'>This feature is only available on desktop devices.</h1>
            </div>
        </>
    )
}

export default Call
