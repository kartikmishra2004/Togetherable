import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';
import { useFirebase } from '../context/firebase';
import { signOut } from 'firebase/auth';
import gear from '../assets/gear.png';

const Navbar = () => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;
    const { user, firebaseAuth, userData } = useFirebase();

    const [menu, setMenu] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const handleMenu = () => {
        setMenu(!menu);
    };

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <header
            className={`text-gray-500 body-font font-main fixed w-full z-50 ${scrolled ? 'bg-secondary border-b border-zinc-800' : 'bg-transparent'
                }`}
        >
            <div className="container mx-auto flex flex-wrap p-5 flex-row justify-between xl:px-52 items-center">
                <Link to={'/'} className="flex justify-center title-font font-medium items-center text-gray-900 md:mb-0">
                    <img className="w-8" src={logo} alt="logo" />
                    <span className="ml-2 text-primary text-2xl font-logo">Togetherable</span>
                </Link>
                <nav className="md:mr-auto md:ml-10 md:py-1 md:pl-10 md:border-l md:border-gray-400 lg:flex hidden flex-wrap items-center text-base justify-center gap-10">
                    <Link to={'/'} className={`mr-5 ${isActive('/') ? `text-primary` : ''}`}>
                        Home
                    </Link>
                    <Link to={'/about'} className={`mr-5 ${isActive('/about') ? 'text-primary' : ''}`}>
                        About
                    </Link>
                    {user === null ? (
                        <>
                            <Link to={'/login'} className={`mr-5 ${isActive('/login') ? 'text-primary' : ''}`}>
                                Login
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to={'/explore'} className={`mr-5 ${isActive('/explore') ? 'text-primary' : ''}`}>
                                Explore
                            </Link>
                            <Link to={'/communities'} className={`mr-5 ${isActive('/communities') ? 'text-primary' : ''}`}>
                                Communities
                            </Link>
                            <Link to={'/profile'} className={`mr-5 ${isActive('/profile') ? 'text-primary' : ''}`}>
                                Profile
                            </Link>
                            <Link to={'/settings'} className={`mr-5 ${isActive('/settings') ? 'text-primary' : ''}`}>
                                Settings
                            </Link>
                        </>
                    )}
                </nav>
                <div onClick={handleMenu} className={`${user === null ? 'hidden' : 'flex'} gap-3 items-center cursor-pointer`}>
                    <img className="w-5 h-5 opacity-80" src={gear} alt="" />
                </div>
            </div>
            {user === null ? (
                ''
            ) : (
                <div className={`w-full ${menu ? 'flex' : 'hidden'}  justify-end fixed md:px-52`}>
                    <div
                        tabIndex="0"
                        className={`z-[1] border border-zinc-800 p-2 shadow bg-secondary rounded-lg w-100 my-2`}
                    >
                        <div className="rounded-lg bg-base-300 p-3 drop-shadow-xl divide-y divide-[#989898]">
                            <div className="flex space-x-4 items-center p-4">
                                <div className="flex mr-auto items-center space-x-4">
                                    <img
                                        src={
                                            user.photoURL
                                                ? user.photoURL
                                                : 'https://res.cloudinary.com/dlwudcsu1/image/upload/v1723743051/Picsart_24-08-15_23-00-10-662_bix7iy.png'
                                        }
                                        alt="Name"
                                        className="w-16 h-16 shrink-0 rounded-full"
                                    />
                                    <div className="space-y-2 flex flex-col flex-1 truncate">
                                    <h1>{userData ? userData.fullName : user.displayName}</h1>
                                        <p className="font-normal text-base leading-tight truncate">{user.email}</p>
                                    </div>
                                </div>
                            </div>
                            <div aria-label="navigation" className="py-2">
                                <nav className="grid gap-4 py-3 px-2 justify-center text-center">
                                    <Link onClick={handleMenu} to={'/'}>
                                        Home
                                    </Link>
                                    <Link onClick={handleMenu} to={'/about'}>
                                        About
                                    </Link>
                                    <Link onClick={handleMenu} to={'/explore'}>
                                        Explore
                                    </Link>
                                    <Link onClick={handleMenu} to={'/communities'}>
                                        Communities
                                    </Link>
                                    <Link onClick={handleMenu} to={'/profile'}>
                                        Profile
                                    </Link>
                                    <Link onClick={handleMenu} to={'/settings'}>
                                        Settings
                                    </Link>
                                </nav>
                            </div>
                            <div className="pt-2">
                                {user === null ? (
                                    ''
                                ) : (
                                    <button
                                        onClick={() => {
                                            signOut(firebaseAuth);
                                            handleMenu();
                                        }}
                                        className={
                                            'mr-5 rounded-lg px-2 py-1 text-red-400 text-center justify-center w-full'
                                        }
                                    >
                                        Logout
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
