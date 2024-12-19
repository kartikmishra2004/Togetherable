import React, { useState } from 'react'
import { getDatabase, ref, set } from "firebase/database";
import { app } from './firebase.js'

const db = getDatabase(app);

const App = () => {

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    age: '',
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
    set(ref(db, `users/${formData.name.toLocaleLowerCase()}`), {
      id: formData.id,
      name: formData.name,
      age: formData.age,
    })
    setFormData({
      id: '',
      name: '',
      age: '',
    })
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen font-sans">
      <h2 className="mb-6 text-2xl font-semibold">User Information Form</h2>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-72"
      >
        <input
          type="text"
          name="id"
          placeholder="Enter your ID"
          value={formData.id}
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="name"
          placeholder="Enter your name"
          value={formData.name}
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          name="age"
          placeholder="Enter your age"
          value={formData.age}
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="p-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Submit
        </button>
      </form>
    </div>
  )
}

export default App
