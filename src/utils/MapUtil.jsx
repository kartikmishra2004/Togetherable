import React, { useEffect, useRef, useState } from 'react';
import L, { map } from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MapUtil = ({ users }) => {

    const mapRef = useRef(null);
    const [mapType, setMapType] = useState('openstreet');

    useEffect(() => {
        if (users) {
            const map = L.map(mapRef.current).setView([21.1466, 79.0882], 5);
            if (mapType === 'openstreet') {
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                }).addTo(map);
            }
            if (mapType === 'satellite') {
                L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                    attribution: '&copy; <a href="https://www.esri.com/en-us/home">Esri</a>',
                }).addTo(map);
            }
            users?.forEach((user) => {
                L.marker([user?.lat || '', user?.long || '']).addTo(map)
                    .bindPopup(user.fullName)
                    .openPopup();
            })
            return () => {
                map.remove();
            };
        }
    }, [users, mapType]);

    if (!users) {
        return (
            <div className='mx-auto flex justify-center items-center bg-secondary border border-zinc-800 h-[60vh] lg:w-[60%] w-full z-10 rounded-lg' >
                <div className='w-full flex justify-center h-[20vh] items-center '><span className="loader"></span></div>
            </div>
        )
    }

    return (
        <div className='flex mx-auto w-full'>
            <div className="absolute">
                <select className='text-black' select={mapType} onChange={(e) => setMapType(e.target.value)}>
                    <option value="openstreet">Street</option>
                    <option value="satellite">Satellite</option>
                </select>
            </div>
            <div className='mx-auto h-[60vh] lg:w-[60%] w-full z-10 rounded-lg' ref={mapRef} />
        </div>
    );
};

export default MapUtil;