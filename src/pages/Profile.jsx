import React from 'react';
import { Navigate } from 'react-router-dom';
import { useFirebase } from '../context/firebase';

const Profile = () => {

  const { user } = useFirebase();

  if (user === null) {
    return <Navigate to={'/login'} />
  }
  return (
    <div>
      Profile
    </div>
  )
}

export default Profile
