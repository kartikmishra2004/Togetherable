import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png'

const Navbar = () => {
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <header className="text-gray-500 body-font font-main">
            <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
                <Link to={'/'} className="flex justify-center title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
                    <img className='w-8' src={logo} alt="logo" />
                    <span className="ml-2 text-primary text-2xl font-logo">Togetherable</span>
                </Link>
                <nav className="md:mr-auto md:ml-10 md:py-1 md:pl-10 md:border-l md:border-gray-400 md:flex hidden flex-wrap items-center text-base justify-center gap-10">
                    <Link
                        to={'/'}
                        className={`mr-5 ${isActive('/') ? `text-primary` : ''}`}
                    >
                        Home
                    </Link>
                    <Link
                        to={'/about'}
                        className={`mr-5 ${isActive('/about') ? 'text-primary' : ''}`}
                    >
                        About
                    </Link>
                    <Link
                        to={'/profile'}
                        className={`mr-5 ${isActive('/profile') ? 'text-primary' : ''}`}
                    >
                        Profile
                    </Link>
                </nav>
            </div>
        </header>
    );
}

export default Navbar;
