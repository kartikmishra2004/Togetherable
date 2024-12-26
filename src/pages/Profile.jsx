import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useFirebase } from '../context/firebase';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const Profile = () => {
  const { user, loading, userData } = useFirebase();

  // Fetching the location
  const [geoLocation, setGeoLocation] = useState('');
  const [completionPercentage, setCompletionPercentage] = useState(0);

  useEffect(() => {
    const location = localStorage.getItem('geolocation');
    setGeoLocation(location);

    // Calculate profile completion percentage
    const fields = [
      userData?.photoURL,
      userData?.fullName || user?.displayName,
      userData?.bio,
      userData?.email,
      userData?.phone,
      geoLocation,
    ];
    const completedFields = fields.filter((field) => field && field.trim() !== '');
    setCompletionPercentage(Math.round((completedFields.length / fields.length) * 100));
  }, [userData, user, geoLocation]);

  const handleGeoLoation = () => {
    try {
      navigator.geolocation.getCurrentPosition(async (res) => {
        const lat = res.coords.latitude;
        const lon = res.coords.longitude;
        try {
          const resp = await fetch(
            `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=06e1c3306eb145dca623f15270dff053`,
            { method: "GET" }
          );
          const json_resp = await resp.json();

          if (json_resp.features && json_resp.features.length > 0) {
            setGeoLocation(json_resp.features[0].properties.formatted);
            localStorage.setItem('geolocation', json_resp.features[0].properties.formatted);
          } else {
            console.log("No geolocation data found.");
          }
        } catch (error) {
          console.error("Error fetching geolocation!!");
        }
      },
        (err) => {
          console.error("Error accessing location services:", err.message);
        },
        { enableHighAccuracy: true });
    } catch (error) {
      console.error("Error fetching location!!");
    }
  };

  if (loading) {
    return (
      <div className="w-full h-screen pt-32 font-main">
        <div className="bg-secondary h-[65vh] max-w-[90vw] mx-auto border py-20 border-zinc-800 rounded-lg shadow-2xl w-full p-8">
          <SkeletonTheme baseColor="#202020" highlightColor="#444">
            <Skeleton height={100} width="100%" />
          </SkeletonTheme>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="w-full h-screen pt-32 font-main">
      <div className="bg-secondary h-[75vh] max-w-[90vw] mx-auto border py-20 border-zinc-800 rounded-lg shadow-2xl w-full p-8">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 text-center mb-8 md:mb-0">
            <img
              src={userData?.photoURL || 'https://res.cloudinary.com/dlwudcsu1/image/upload/v1723743051/Picsart_24-08-15_23-00-10-662_bix7iy.png'}
              alt="Profile"
              className="rounded-full w-48 h-48 mx-auto mb-4 transition-transform duration-300 hover:scale-105"
            />
            <h1 className="text-2xl font-bold text-main mb-2">{(userData?.fullName || user?.displayName) || 'Name'}</h1>
          </div>
          <div className="md:w-2/3 md:pl-8">
            <h2 className="text-xl font-semibold text-main dark:text-white mb-4">About Me</h2>
            <p className="text-primary dark:text-gray-300 mb-6">
              {userData?.bio || 'No bio added'}
            </p>
            <h2 className="text-xl font-semibold text-main dark:text-white mb-4">Contact Information</h2>
            <ul className="space-y-2 text-primary dark:text-gray-300">
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-main" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                {userData?.email || 'Email'}
              </li>
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-main dark:text-blue-900" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                {userData?.phone || 'No phone number added'}
              </li>
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-main dark:text-blue-900" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {geoLocation ? (<div>{geoLocation} <button onClick={() => { localStorage.removeItem('geolocation'); setGeoLocation('') }} className='text-red-400 hover:text-red-500 ml-1'>Remove</button></div>) : <button onClick={handleGeoLoation} className='hover:text-main'>Add location</button>}
              </li>
              <li>
                {/* Progress Bar */}
                <div className="my-6">
                  <div className="w-full max-w-[30vw] bg-gray-300 rounded-full h-5 dark:bg-gray-700">
                    <div
                      className="bg-main h-5 rounded-full text-center flex justify-center items-center text-xs font-bold text-white"
                      style={{ width: `${completionPercentage}%` }}>
                      {completionPercentage}%
                    </div>
                  </div>
                  <button className="mt-4 bg-main text-white px-4 py-2 rounded-lg hover:bg-[#9036c8]">{completionPercentage === 100 ? 'Edit profile' : 'Complete profile'}</button>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;