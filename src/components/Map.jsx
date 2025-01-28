import React from 'react'
import MapUtil from '../utils/MapUtil'

const Map = () => {

        const users = [
            {
                name: "Kartik",
                lat: 23.166976,
                long: 75.7956608,
            },
            {
                name: "Sanidhya",
                lat: 23.185024189089155,
                long: 75.77596664428712,
            },
        ]

    return (
        <div className='w-full flex justify-center items-center'>
            <MapUtil users={users} />
        </div>
    )
}

export default Map
