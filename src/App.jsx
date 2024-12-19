import React, { useState } from 'react'
// import { getDatabase, ref, set } from "firebase/database";
import { app } from './firebase.js'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'

// const db = getDatabase(app);
const auth = getAuth(app);

const App = () => {

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const signupUser = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, formData.email, formData.password)
      .then((response) => console.log(response));

  }

  return (
    <div className="flex flex-col items-center justify-center h-screen font-sans">
      <h2 className="mb-6 text-2xl font-semibold">User Information Form</h2>
      <form
        onSubmit={signupUser}
        className="flex flex-col gap-4 w-72"
      >
        <input
          type="email"
          name="email"
          placeholder="example@gmail.com"
          value={formData.email}
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="p-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Sign Up
        </button>
      </form>
    </div>
  )
}

export default App
