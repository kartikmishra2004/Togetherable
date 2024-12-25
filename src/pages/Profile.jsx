import React from 'react';
import { Navigate } from 'react-router-dom';
import { useFirebase } from '../context/firebase';

const Profile = () => {
  const { user, loading } = useFirebase();
  
  const pfp = user?.photoURL?.replace(/=s\d+/, "=s720") || 'https://res.cloudinary.com/dlwudcsu1/image/upload/v1723743051/Picsart_24-08-15_23-00-10-662_bix7iy.png';

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-main"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="w-full h-screen pt-32 font-main">
      <div className="bg-secondary max-w-[90vw] mx-auto border py-20 border-zinc-800 rounded-lg shadow-2xl w-full p-8">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 text-center mb-8 md:mb-0">
            <img
              src={pfp ? pfp : 'https://res.cloudinary.com/dlwudcsu1/image/upload/v1723743051/Picsart_24-08-15_23-00-10-662_bix7iy.png'}
              alt="Profile"
              className="rounded-full w-48 h-48 mx-auto mb-4 border-2 transition-transform duration-300 hover:scale-105"
            />
            <h1 className="text-2xl font-bold text-main dark:text-white mb-2">{user.displayName || 'Name'}</h1>
            <p className="text-primary">Software Developer</p>
            <button className="mt-4 bg-main text-white px-4 py-2 rounded-lg hover:bg-[#9036c8]">Edit Profile</button>
          </div>
          <div className="md:w-2/3 md:pl-8">
            <h2 className="text-xl font-semibold text-main dark:text-white mb-4">About Me</h2>
            <p className="text-primary dark:text-gray-300 mb-6">
              {user.bio || (<button className='hover:text-main'>Add bio</button>)}
            </p>
            <h2 className="text-xl font-semibold text-main dark:text-white mb-4">Contact Information</h2>
            <ul className="space-y-2 text-primary dark:text-gray-300">
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-main" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                {user.email || 'Email'}
              </li>
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-main dark:text-blue-900" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                {user.phone || (<button className='hover:text-main'>Add phone</button>)}
              </li>
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-main dark:text-blue-900" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {user.location || <button className='hover:text-main'>Add location</button>}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
