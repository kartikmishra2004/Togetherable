import React from 'react'
import { Navigate } from 'react-router-dom';
import { useFirebase } from '../context/firebase';

const Communities = () => {

  const { user } = useFirebase();

  if (user === null) {
    return <Navigate to={'/login'} />
  }

  return (
    <div className='w-full h-screen'>
      Communities
    </div>
  )
}

export default Communities
