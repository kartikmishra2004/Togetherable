import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Profile from './pages/Profile.jsx'
import Signup from './auth/Signup.jsx'
import Login from './auth/Login.jsx'
import Settings from './pages/Settings.jsx'
import NotFound from './components/Notfound.jsx'

const App = () => {

  return (
    <Router>
      <Navbar />
      <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path='*' element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App
