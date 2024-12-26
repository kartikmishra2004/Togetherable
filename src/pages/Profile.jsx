import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useFirebase } from '../context/firebase';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Modal from '../components/Modal.jsx';
import Offline from '../components/Offline.jsx';

const Profile = () => {
  const { user, loading, userData, putLocation, deleteLocation } = useFirebase();

  // Fetching the location
  const [geoLocation, setGeoLocation] = useState('');
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [modal, setModal] = useState(false);
  const [fetchingLocation, setFetchingLocation] = useState(false);

  // Profile % bar
  const updateCompletionPercentage = (data) => {
    const fields = [
      data?.photoURL,
      data?.fullName || user?.displayName,
      data?.bio,
      data?.email,
      data?.phone,
      data?.location,
    ];
    const completedFields = fields.filter((field) => field && field.trim() !== '');
    setCompletionPercentage(Math.round((completedFields.length / fields.length) * 100));
  };

  useEffect(() => {
    setGeoLocation(userData?.location);
    updateCompletionPercentage(userData);
  }, [userData, user]);

  const handleGeoLoation = () => {
    setFetchingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (res) => {
        const lat = res.coords.latitude;
        const lon = res.coords.longitude;
        try {
          const resp = await fetch(
            `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=06e1c3306eb145dca623f15270dff053`
          );
          const json_resp = await resp.json();

          if (json_resp.features && json_resp.features.length > 0) {
            const newLocation = json_resp.features[0].properties.formatted;
            setGeoLocation(newLocation);
            await putLocation(newLocation);

            // Update progress bar with new location
            updateCompletionPercentage({
              ...userData,
              location: newLocation,
            });
            setFetchingLocation(false);
          } else {
            console.log("No geolocation data found.");
            setFetchingLocation(false);
          }
        } catch (error) {
          console.error("Error fetching geolocation!!", error);
          setFetchingLocation(false);
        }
      },
      (err) => {
        console.error("Error accessing location services:", err.message);
        setFetchingLocation(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const handleRemoveLocation = async () => {
    try {
      setGeoLocation('');
      await deleteLocation();

      // Update progress bar after removing location
      updateCompletionPercentage({
        ...userData,
        location: '',
      });
    } catch (error) {
      console.error("Error removing location!!", error);
    }
  };


  if (loading) {
    return (
      <div className="w-full h-screen pt-32 font-main">
        <div className="lg:bg-secondary h-[70vh] max-w-[80vw] mx-auto lg:border lg:py-20 lg:border-zinc-800 rounded-lg shadow-2xl w-full lg:p-8">
          <SkeletonTheme baseColor="#14141c" highlightColor="#232234">
            <div className='flex lg:flex-row flex-col'>
              <div className="lg:w-1/3 text-center mb-8 lg:mb-0">
                <Skeleton height={192} width={192} borderRadius={100} />
                <Skeleton height={40} width={180} style={{ marginTop: 10 }} />
              </div>
              <div className="pl-8 flex lg:block flex-col justify-center items-center">
                <Skeleton height={70} width={160} />
                <Skeleton height={200} width={600} style={{ marginTop: 10 }} />
                <Skeleton height={45} width={160} style={{ marginTop: 10 }} />
              </div>
            </div>
          </SkeletonTheme>
        </div>
      </div>
    );
  }

  if(!userData){
    return(
      <Offline />
    )
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      {modal && <Modal setModal={setModal} completionPercentage={completionPercentage} />}
      <div className="w-full h-screen pt-32 font-main">
        <div className="lg:bg-secondary h-[70vh] max-w-[80vw] mx-auto lg:border lg:py-20 lg:border-zinc-800 rounded-lg shadow-2xl w-full lg:p-8">
          <div className="flex flex-col lg:flex-row">
            <div className="lg:w-1/3 text-center lg:mb-8 mb-2">
              <img
                src={userData?.photoURL || 'https://res.cloudinary.com/dlwudcsu1/image/upload/v1723743051/Picsart_24-08-15_23-00-10-662_bix7iy.png'}
                alt="Profile"
                className="rounded-full w-48 h-48 mx-auto mb-4 transition-transform duration-300 hover:scale-105"
              />
              <h1 className="text-2xl font-bold text-main mb-2">{(userData?.fullName || user?.displayName) || 'Name'}</h1>
            </div>
            <div className="lg:w-2/3 lg:pl-8">
              <h2 className="text-xl lg:text-left text-center font-semibold text-main dark:text-white mb-4">About Me</h2>
              <p className="text-primary lg:text-left text-center dark:text-gray-300 mb-4">
                {userData?.bio || 'No bio added'}
              </p>
              <h2 className="text-xl lg:text-left text-center font-semibold text-main dark:text-white mb-4">Contact Information</h2>
              <ul className="space-y-2 text-primary dark:text-gray-300">
                <li className="flex lg:justify-start justify-center items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-main" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  {userData?.email || 'Email'}
                </li>
                <li className="flex lg:justify-start justify-center items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-main dark:text-blue-900" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  {userData?.phone || 'No phone number added'}
                </li>
                <li className="flex lg:justify-start text-center justify-center items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 lg:block hidden w-5 mr-2 text-main dark:text-blue-900" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  {fetchingLocation ? (<div className='animate-pulse'>Getting your location...</div>) : (geoLocation ? (<div>{geoLocation} <button onClick={handleRemoveLocation} className='text-red-400 hover:text-red-500 ml-1'>Remove location</button></div>) : <button onClick={handleGeoLoation} className='hover:text-main'>Add your location</button>)}
                </li>
                <li>
                  {/* Progress Bar */}
                  <div className="my-6 flex flex-col justify-center lg:items-start items-center">
                    <div className="w-full lg:max-w-[30vw] bg-gray-300 rounded-full h-5 dark:bg-gray-700">
                      <div
                        className="bg-main h-5 transition-all ease-in-out duration-500 rounded-full text-center flex justify-center items-center text-xs font-bold text-white"
                        style={{ width: `${completionPercentage}%` }}>
                        {completionPercentage}%
                      </div>
                    </div>
                    <button onClick={() => setModal(true)} className="mt-4 lg:w-44 w-full bg-main text-white px-4 py-2 rounded-lg hover:bg-[#9036c8]">{completionPercentage === 100 ? 'Edit profile' : 'Complete profile'}</button>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;