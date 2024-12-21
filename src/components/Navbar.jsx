import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';
import { useFirebase } from '../context/firebase';
import { signOut } from 'firebase/auth';

const Navbar = () => {
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const { user, firebaseAuth } = useFirebase();

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
                        className={`mr-5 ${isActive('/') ? `text-primary` : ''}`}>
                        Home
                    </Link>
                    <Link
                        to={'/about'}
                        className={`mr-5 ${isActive('/about') ? 'text-primary' : ''}`}>
                        About
                    </Link>
                    {user === null ?
                        (<>
                            <Link
                                to={'/login'}
                                className={`mr-5 ${isActive('/login') ? 'text-primary' : ''}`}>
                                Login
                            </Link>
                        </>)
                        :
                        (<>
                            <Link
                                to={'/profile'}
                                className={`mr-5 ${isActive('/profile') ? 'text-primary' : ''}`}>
                                Profile
                            </Link>
                            <Link
                                to={'/settings'}
                                className={`mr-5 ${isActive('/settings') ? 'text-primary' : ''}`}>
                                Settings
                            </Link>
                        </>)}

                </nav>

                {user === null ? '' : (<button
                    onClick={() => signOut(firebaseAuth)}
                    className={"mr-5 rounded-md px-2 py-1 text-primary"}>
                    Logout
                </button>)}
            </div>
        </header>
    );
}

export default Navbar;
