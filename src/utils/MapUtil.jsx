import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import location from '../assets/location.png';

const customIcon = L.icon({
    iconUrl: location,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

const MapUtil = ({ users }) => {
    const mapRef = useRef(null);
    const [mapType, setMapType] = useState('openstreet');
    const [activeUserLocation, setActiveUserLocation] = useState(null);

    useEffect(() => {
        if (users && mapRef.current) {
            const map = L.map(mapRef.current).setView([21.1466, 79.0882], 5);

            const tileLayer =
                mapType === 'openstreet'
                    ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                    : 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

            L.tileLayer(tileLayer, {
                attribution:
                    mapType === 'openstreet'
                        ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        : '&copy; <a href="https://www.esri.com/en-us/home">Esri</a>',
            }).addTo(map);

            users?.forEach((user) => {
                const marker = L.marker([user?.lat || 0, user?.long || 0], { icon: customIcon })
                    .addTo(map)
                    .bindPopup(user.fullName);
                marker._userData = user;
            });
            if (activeUserLocation) {
                map.setView([activeUserLocation.lat, activeUserLocation.long], 10);
                L.marker([activeUserLocation.lat, activeUserLocation.long], { icon: customIcon })
                    .addTo(map)
                    .bindPopup(activeUserLocation.fullName);
            }

            return () => {
                map.remove();
            };
        }
    }, [users, mapType, activeUserLocation]);

    const handleUserClick = (user) => {
        setActiveUserLocation(user);
    };

    if (!users) {
        return (
            <div className="w-[80vw] h-[60vh] flex justify-center items-center">
                <div className='w-full flex justify-center h-[20vh] items-center '><span className="loader"></span></div>
            </div>
        )
    }

    return (
        <div className="flex w-full lg:gap-0 gap-5 lg:flex-row flex-col justify-between font-main text-primary">
            <div className="lg:h-[60vh] h-[50vh] lg:w-[65%] w-full z-10 rounded-lg" ref={mapRef} />
            <div className="flex flex-col lg:w-[30%] lg:h-[60vh]">
                    <h1 className="w-full pb-4 text-2xl font-semibold">Map type</h1>
                <div className="w-full flex justify-center">
                    <select
                        className="bg-secondary w-full px-4 py-2 rounded-lg outline-none border border-zinc-800"
                        value={mapType}
                        onChange={(e) => setMapType(e.target.value)}>
                        <option value="openstreet">Street</option>
                        <option value="satellite">Satellite</option>
                    </select>
                </div>
                <h1 className="w-full py-4 text-2xl font-semibold">Community members</h1>
                <div className="lg:overflow-y-auto">
                    {users?.map((user) => (
                        <div
                            key={user.id}
                            className="px-4 cursor-pointer py-2 bg-secondary border border-zinc-800 rounded-lg mb-3"
                            onClick={() => handleUserClick(user)}>
                            {user.fullName}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MapUtil;
