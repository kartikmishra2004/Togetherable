import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Communities from './pages/Communities.jsx';
import About from './pages/About.jsx';
import Profile from './pages/Profile.jsx';
import Signup from './auth/Signup.jsx';
import Login from './auth/Login.jsx';
import Settings from './pages/Settings.jsx';
import NotFound from './components/Notfound.jsx';
import CommunityPage from './pages/[community].jsx';
import Call from './pages/Call.jsx';

const Layout = ({ children }) => {
  const location = useLocation();
  const hideFooterRoutes = ['/login', '/signup', '/profile'];

  return (
    <>
      <Navbar />
      {children}
      {!hideFooterRoutes.includes(location.pathname) && <Footer />}
    </>
  );
};

const App = () => (
  <Router>
    <Layout>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/communities" element={<Communities />} />
        <Route path="/about" element={<About />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/communities/:community" element={<CommunityPage />} />
        <Route path="/call" element={<Call />} />
      </Routes>
    </Layout>
  </Router>
);

export default App;
