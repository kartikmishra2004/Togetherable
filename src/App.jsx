import React from 'react'
import { getDatabase, ref, set } from "firebase/database";
import { app } from './firebase.js'

const db = getDatabase(app);

const putData = () => {
  set(ref(db, 'users/kartik'), {
    id: 1,
    name: 'Kartik',
    age: 20,
  })
}

const App = () => {
  return (
    <div className='text-zinc-600 text-5xl'>
      <button onClick={putData}>Put Data</button>
    </div>
  )
}

export default App
