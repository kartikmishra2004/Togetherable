import React, { useState } from 'react'
import { Navigate } from 'react-router-dom';
import { useFirebase } from '../context/firebase';
import { useScript } from '../context/TTScontext';

const Settings = () => {

  const { user, loading } = useFirebase();
  const { isScriptAdded, toggleScript } = useScript();

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">Loading...</div>
    )
  }

  if (user === null) {
    return <Navigate to={'/login'} />
  }
  return (
    <div className='w-full h-screen flex justify-center items-center'>
      <div>
        <button className='bg-main px-4 py-2 rounded-lg' onClick={() => toggleScript()}>
          {isScriptAdded ? "Disable voice command" : "Enable voice command"}
        </button>
      </div>
    </div>
  )
}

export default Settings
