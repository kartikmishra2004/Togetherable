import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';
import { useFirebase } from '../context/firebase';
import { signOut } from 'firebase/auth';
import gear from '../assets/gear.png';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const Navbar = () => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;
    const { user, firebaseAuth, userData, loading } = useFirebase();
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

    if (loading) {
        return (
            <>
                <header
                    className='text-gray-500 body-font font-main fixed w-full h-[4.5rem] z-50 bg-secondary border-b border-zinc-800 lg:block hidden'>
                    <SkeletonTheme baseColor="#14141c" highlightColor="#232234">
                        <div className="flex justify-evenly w-full h-full items-center">
                            <div className="flex justify-center items-center">
                                <div className="">
                                    <Skeleton height={30} width={240} style={{ marginRight: 30 }} />
                                </div>
                                <div className="flex">
                                    <Skeleton height={30} width={600} />
                                </div>
                            </div>
                            <div className="">
                                <Skeleton height={30} width={30} circle={true} />
                            </div>
                        </div>
                    </SkeletonTheme>
                </header>
                <header
                    className='text-gray-500 body-font font-main fixed w-full h-[4.5rem] z-50 bg-secondary border-b border-zinc-800 lg:hidden block'>
                    <SkeletonTheme baseColor="#14141c" highlightColor="#232234">
                        <div className="flex justify-between items-center w-full h-full px-6">
                            <div className="flex">
                                <Skeleton height={35} width={190} />
                            </div>
                            <div className="">
                                <Skeleton height={35} width={40} circle={true} />
                            </div>
                        </div>
                    </SkeletonTheme>
                </header>
            </>
        )
    }

    return (
        <header
            className={`text-gray-500 body-font font-main fixed w-full z-50 ${scrolled ? 'bg-secondary border-b border-zinc-800' : 'bg-transparent'
                }`}>
            <div className="container mx-auto flex flex-wrap p-5 flex-row justify-between xl:px-52 items-center">
                <Link onMouseEnter={() => responsiveVoice.speak("Togetherable")} to={'/'} className="flex justify-center title-font font-medium items-center text-gray-900 md:mb-0">
                    <img className="w-8" src={logo} alt="logo" />
                    <span className="ml-2 text-primary text-2xl font-logo">Togetherable</span>
                </Link>
                <nav className="md:mr-auto md:ml-10 md:py-1 md:pl-10 md:border-l md:border-gray-400 lg:flex hidden flex-wrap items-center text-base justify-center gap-10">
                    <Link onMouseEnter={() => responsiveVoice.speak("Home")} to={'/'} className={`mr-5 ${isActive('/') ? `text-primary` : ''}`}>
                        Home
                    </Link>
                    <Link onMouseEnter={() => responsiveVoice.speak("About")} to={'/about'} className={`mr-5 ${isActive('/about') ? 'text-primary' : ''}`}>
                        About
                    </Link>
                    {user === null ? (
                        <>
                            <Link onMouseEnter={() => responsiveVoice.speak("Login")} to={'/login'} className={`mr-5 ${isActive('/login') ? 'text-primary' : ''}`}>
                                Login
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link onMouseEnter={() => responsiveVoice.speak("Communities")} to={'/communities'} className={`mr-5 ${isActive('/communities') ? 'text-primary' : ''}`}>
                                Communities
                            </Link>
                            <Link onMouseEnter={() => responsiveVoice.speak("Profile")} to={'/profile'} className={`mr-5 ${isActive('/profile') ? 'text-primary' : ''}`}>
                                Profile
                            </Link>
                            <Link onMouseEnter={() => responsiveVoice.speak("Settings")} to={'/settings'} className={`mr-5 ${isActive('/settings') ? 'text-primary' : ''}`}>
                                Settings
                            </Link>
                        </>
                    )}
                </nav>
                <div onClick={handleMenu} className={`flex gap-3 items-center cursor-pointer`}>
                    <img className="w-5 h-5 opacity-80" src={gear} alt="" />
                </div>
            </div>

            <div className={`w-full ${menu ? 'flex' : 'hidden'}  justify-end fixed md:px-52`}>
                <div
                    tabIndex="0"
                    className={`z-[1] border border-zinc-800 p-2 shadow bg-secondary lg:rounded-lg w-full ${user === null ? 'lg:w-72' : 'lg:w-max'} lg:my-2`}
                >
                    <div className={`rounded-lg bg-base-300 p-3 drop-shadow-xl  ${user === null ? '' : 'divide-y divide-[#989898]'}`}>
                        <div className="flex space-x-4 items-center p-4">
                            <div className={`${user === null ? 'hidden' : 'flex'} mr-auto items-center space-x-4`}>
                                <Link onClick={handleMenu} to={'/profile'}>
                                    <img
                                        src={userData?.photoURL || 'https://res.cloudinary.com/dlwudcsu1/image/upload/v1723743051/Picsart_24-08-15_23-00-10-662_bix7iy.png'}
                                        alt="Name"
                                        className="lg:w-20 lg:h-20 w-10 h-10 shrink-0 rounded-full object-cover bg-primary" />
                                </Link>
                                <Link onClick={handleMenu} to={'/profile'}>
                                    <div className="flex flex-col flex-1 truncate">
                                        <h1 className='text-primary lg:text-lg'>{user === null ? '' : (userData ? userData.fullName : user.displayName)}</h1>
                                        <p className="font-normal lg:text-base text-sm leading-tight truncate">{user === null ? '' : userData?.email}</p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                        <div aria-label="navigation" className="py-2">
                            <nav className="grid gap-4 py-3 px-2 justify-center text-center">
                                <Link onMouseEnter={() => responsiveVoice.speak("Home")} onClick={handleMenu} to={'/'}>
                                    Home
                                </Link>
                                <Link onMouseEnter={() => responsiveVoice.speak("About")} onClick={handleMenu} to={'/about'}>
                                    About
                                </Link>
                                {user === null ?
                                    (<>
                                        <Link onMouseEnter={() => responsiveVoice.speak("Login")} onClick={handleMenu} to={'/login'}>
                                            Login
                                        </Link>
                                    </>) :
                                    (<>
                                        <Link onMouseEnter={() => responsiveVoice.speak("Comminities")} onClick={handleMenu} to={'/communities'}>
                                            Communities
                                        </Link>
                                        <Link onMouseEnter={() => responsiveVoice.speak("Settings")} onClick={handleMenu} to={'/settings'}>
                                            Settings
                                        </Link>
                                    </>)}

                            </nav>
                        </div>
                        <div className="pt-2">
                            {user === null ? (
                                ''
                            ) : (
                                <button onMouseEnter={() => responsiveVoice.speak("Logout")}
                                    onClick={() => {
                                        signOut(firebaseAuth);
                                        handleMenu();
                                    }}
                                    className={
                                        'mr-5 rounded-lg px-2 py-1 text-red-400 hover:text-red-500 text-center justify-center w-full'
                                    }
                                >
                                    Logout
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

        </header>
    );
};

export default Navbar;
