import React, { useState } from 'react';
import { useFirebase } from './context/firebase';

const App = () => {

  const firebase = useFirebase()

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

  const handleSubmit = (e) => {
    e.preventDefault();
    firebase.signupWithEmailAndPassword(formData.email, formData.password)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen font-sans">
      <h2 className="mb-6 text-2xl font-semibold">User Information Form</h2>
      <form
        onSubmit={handleSubmit}
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
