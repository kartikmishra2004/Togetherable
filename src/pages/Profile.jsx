import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useFirebase } from '../context/firebase';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Modal from '../components/editProfileModal.jsx';
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
      <>
        <div className="w-full h-screen pt-28 font-main overflow-x-hidden xl:block hidden">
          <div className="lg:bg-secondary h-[75vh] flex items-center justify-center max-w-[80vw] mx-auto lg:border lg:py-10 lg:border-zinc-800 rounded-lg shadow-2xl w-full lg:p-8">
            <SkeletonTheme baseColor="#14141c" highlightColor="#232234">
              <div className="flex flex-col w-full items-center justify-center lg:flex-row">
                <div className="lg:w-1/3 text-center lg:mb-8 mb-2">
                  <Skeleton circle={true} height={240} width={240} />
                </div>
                <div className="lg:w-2/3 lg:pl-8 text-center lg:text-left">
                  <Skeleton height={48} width={500} className="my-2 py-2 mx-auto lg:mx-0" />
                  <Skeleton height={24} width={160} className="mt-4 mx-auto lg:mx-0" />
                  <Skeleton height={24} width={600} className="mt-4 mx-auto lg:mx-0" />
                  <Skeleton height={24} width={160} className="mt-6 mx-auto lg:mx-0" />
                  <Skeleton height={24} width={600} className="mt-4 mx-auto lg:mx-0" />
                  <Skeleton height={24} width={600} className="mt-4 mx-auto lg:mx-0" />
                  <Skeleton height={24} width={600} className="mt-4 mx-auto lg:mx-0" />
                  <div className="my-4 flex flex-col justify-center lg:items-start items-center">
                    <Skeleton height={24} width={450} className="lg:max-w-[30vw]" />
                    <Skeleton height={45} width={160} className="mt-4" />
                  </div>
                </div>
              </div>
            </SkeletonTheme>
          </div>
        </div>
        <div className="xl:hidden flex justify-center items-center w-full h-screen">
          <div className='w-12 h-12 border-t-2 border-main animate-spin duration-500 ease-in-out rounded-full'></div>
        </div>
      </>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!userData) {
    return (
      <Offline />
    )
  }

  return (
    <>
      {modal && <Modal setModal={setModal} completionPercentage={completionPercentage} userData={userData} />}
      <div className="w-full h-screen pt-28 font-main">
        <div className="lg:bg-secondary h-[75vh] flex items-center max-w-[80vw] mx-auto lg:border lg:py-10 lg:border-zinc-800 rounded-lg shadow-2xl w-full lg:p-8">
          <div className="flex flex-col w-full items-center justify-center lg:flex-row">
            <div className="lg:w-1/3 text-center lg:mb-8 mb-2">
              <img
                src={userData?.photoURL || 'https://res.cloudinary.com/dlwudcsu1/image/upload/v1723743051/Picsart_24-08-15_23-00-10-662_bix7iy.png'}
                alt="Profile"
                title='Edit profile'
                className="rounded-full lg:w-60 lg:h-60 w-32 h-32 mx-auto mb-4 object-cover bg-primary"
              />
            </div>
            <div className="lg:w-2/3 lg:pl-8 w-full">
              <h1 className="lg:text-4xl text-2xl tracking-wide font-extrabold lg:my-2 py-2 text-primary border-b border-zinc-600 text-center lg:text-left">{(userData?.fullName || user?.displayName) || 'Name'}</h1>
              <h2 className="text-2xl lg:text-xl lg:mt-0 mt-2 lg:text-left text-center font-semibold text-main dark:text-white mb-4">About Me</h2>
              <p className="text-primary lg:text-base text-base lg:text-left pr-0 lg:pr-24 text-center dark:text-gray-300 mb-4">
                {userData?.bio || 'No bio added'}
              </p>
              <h2 className="text-2xl lg:text-xl lg:text-left text-center font-semibold text-main dark:text-white mb-4">Contact Information</h2>
              <ul className="space-y-2 text-primary dark:text-gray-300">
                <li className="flex lg:justify-start justify-center items-center lg:text-base text-base">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-main" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  {userData?.email || 'Email'}
                </li>
                <li className="flex lg:justify-start justify-center items-center lg:text-base text-base">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-main dark:text-blue-900" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  {userData?.phone || 'No phone number added'}
                </li>
                <li className="flex lg:justify-start text-center justify-center items-center pr-0 lg:text-base text-base">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 lg:block hidden w-5 mr-2 text-main dark:text-blue-900" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  {fetchingLocation ? (<div className='animate-pulse'>Getting your location...</div>) : (geoLocation ? (<div>{geoLocation} <button onClick={handleRemoveLocation} className='text-red-400 hover:text-red-500 ml-1'>Remove location</button></div>) : <button onClick={handleGeoLoation} className='hover:text-main'>Add your location</button>)}
                </li>
                <li>
                  {/* Progress Bar */}
                  <div className="my-6 flex flex-col justify-center lg:items-start items-center">
                    <div className="w-full lg:max-w-[30vw] bg-gray-300 rounded-lg h-5 dark:bg-gray-700">
                      <div
                        className="bg-main h-5 transition-all ease-in-out duration-500 rounded-lg text-center flex justify-center items-center text-sm font-medium text-white"
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