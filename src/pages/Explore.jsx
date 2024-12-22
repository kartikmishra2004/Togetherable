import React from 'react'
import { Navigate } from 'react-router-dom';
import { useFirebase } from '../context/firebase';

const Explore = () => {

  const { user } = useFirebase();

  if (user === null) {
    return <Navigate to={'/login'} />
  }

  return (
    <div>
      Explore
    </div>
  )
}

export default Explore
