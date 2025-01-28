import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MapUtil = ({ users }) => {

    const mapRef = useRef(null);

    useEffect(() => {
        const map = L.map(mapRef.current).setView([23.166976, 75.7956608], 12);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

        users.forEach((user) => {
            L.marker([user.lat, user.long]).addTo(map)
                .bindPopup(user.name)
                .openPopup();
        })
        return () => {
            map.remove();
        };
    }, []);

    return (
        <div
            className='mx-auto h-[60vh] w-[70%] z-10 rounded-lg'
            ref={mapRef}
        />
    );
};

export default MapUtil;