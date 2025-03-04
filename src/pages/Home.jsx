import React, { useEffect, useState } from 'react';
import unity from '../assets/unity.jpg'
import call from '../assets/call.jpg';
import { Link } from 'react-router-dom';
import { useFirebase } from '../context/firebase.jsx';
import { FaRegUser } from "react-icons/fa";
import { PiPlugsConnectedBold } from "react-icons/pi";
import { TbCirclesRelation } from "react-icons/tb";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useScript } from '../context/TTScontext';
import AIQuoteGenerator from '../components/AIQuoteGenerator.jsx';
import people from '../assets/people.webp'

const Home = () => {
  const [isUnityLoaded, setIsUnityLoaded] = useState(false);
  const [isCallLoaded, setIsCallLoaded] = useState(false);
  const { isScriptAdded } = useScript();
  const { user } = useFirebase();

  useEffect(() => {
    window.scroll(0, 0);
  }, [])

  useEffect(() => {
    if (!unity) setIsUnityLoaded(false);
    if (!call) setIsCallLoaded(false);
  }, [unity, call]);

  return (
    <main className=''>
      <section className="text-primary body-font font-main">
        <div className="container mx-auto flex lg:px-5 px-3 lg:w-[80vw] lg:py-44 py-28 md:flex-row flex-col items-center">
          <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6 mb-10 md:mb-0 lg:block hidden">
            {!isUnityLoaded && (
              <SkeletonTheme baseColor="#14141c" highlightColor="#232234">
                <Skeleton height={400} />
              </SkeletonTheme>
            )}
            <img
              className="object-cover object-center rounded-lg"
              alt="hero"
              src={unity}
              onLoad={() => setIsUnityLoaded(true)}
              onError={() => setIsUnityLoaded(false)}
              style={{ display: isUnityLoaded ? 'block' : 'none' }}
            />
          </div>
          <div className="lg:flex-grow lg:w-1/2 lg:pl-24 md:pl-16 flex flex-col lg:items-start lg:text-left items-center text-center">
            {<h1 className="title-font sm:text-4xl text-3xl mb-4 font-bold">Empowering Lives,
              <br className="hidden lg:inline-block" />Building Communities
            </h1> ||
              <h1 className="title-font sm:text-4xl text-3xl mb-4 font-bold w-full">
                <SkeletonTheme baseColor="#14141c" highlightColor="#232234">
                  <Skeleton count={2} />
                </SkeletonTheme>
              </h1>}
            <p className="mb-8 leading-relaxed text-gray-400">A safe space for individuals with diverse abilities to connect, share their journeys, and support each other. Join a community that thrives on empathy, empowerment, and inclusivity.</p>
            <div className="flex lg:flex-row flex-col lg:gap-0 gap-5 justify-center">
              <Link onMouseEnter={isScriptAdded ? () => responsiveVoice.speak("Join the community") : null} to={user === null ? '/login' : '/communities'} className="inline-flex text-white bg-main border-0 hover:bg-[#9036c8] py-2 px-6 focus:outline-none rounded-lg lg:text-lg">Join the Community</Link>
              <Link onMouseEnter={isScriptAdded ? () => responsiveVoice.speak("Learn more") : null} to={'/about'} className="lg:ml-4 flex justify-center lg:inline-flex text-center text-gray-700 bg-gray-100 border-0 py-2 px-6 focus:outline-none hover:bg-gray-200 rounded-lg lg:text-lg">Learn More</Link>
            </div>
          </div>
        </div>
      </section>
      <section className="text-gray-400 body-font flex flex-col justify-center items-center font-main">
        <h1 className="title-font sm:text-4xl text-3xl mb-4 font-bold w-full text-center text-primary">Your Path to Connection and Support</h1>
        <div className='flex items-center justify-center w-[80vw]'>
          <div className="container lg:px-5 lg:py-24 py-10 lg:w-[52vw] w-[60vw] flex flex-wrap">
            <div className="flex relative pt-10 pb-20 sm:items-center md:w-2/3">
              <div className="h-full w-6 absolute inset-0 flex items-center justify-center">
                <div className="h-full w-1 bg-gray-200 pointer-events-none"></div>
              </div>
              <div className="flex-shrink-0 w-6 h-6 rounded-full mt-10 sm:mt-0 inline-flex items-center justify-center bg-main text-white relative z-10 title-font font-medium text-sm">1</div>
              <div className="flex-grow md:pl-8 pl-6 flex sm:items-center items-start flex-col sm:flex-row">
                <Link onMouseEnter={isScriptAdded ? () => responsiveVoice.speak("Step 1, Sign up and create your profile.") : null} to={user === null ? '/login' : '/profile'} className="flex-shrink-0 w-24 h-24 bg-indigo-100 text-main rounded-full inline-flex items-center justify-center cursor-pointer">
                  <FaRegUser size={40} />
                </Link>
                <div className="flex-grow sm:pl-6 mt-6 sm:mt-0">
                  <h2 className="font-medium title-font text-primary mb-1 text-xl">Step 1 </h2>
                  <p className="leading-relaxed">Sign up and create your profile.</p>
                </div>
              </div>
            </div>
            <div className="flex relative pb-20 sm:items-center md:w-2/3">
              <div className="h-full w-6 absolute inset-0 flex items-center justify-center">
                <div className="h-full w-1 bg-gray-200 pointer-events-none"></div>
              </div>
              <div className="flex-shrink-0 w-6 h-6 rounded-full mt-10 sm:mt-0 inline-flex items-center justify-center bg-main text-white relative z-10 title-font font-medium text-sm">2</div>
              <div className="flex-grow md:pl-8 pl-6 flex sm:items-center items-start flex-col sm:flex-row">
                <Link onMouseEnter={isScriptAdded ? () => responsiveVoice.speak("Step 2, Join communities or start a new one.") : null} to={user === null ? '/login' : '/communities'} className="flex-shrink-0 w-24 h-24 bg-indigo-100 text-main rounded-full inline-flex items-center justify-center cursor-pointer">
                  <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-12 h-12" viewBox="0 0 24 24">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                  </svg>
                </Link>
                <div className="flex-grow sm:pl-6 mt-6 sm:mt-0">
                  <h2 className="font-medium title-font text-primary mb-1 text-xl">Step 2</h2>
                  <p className="leading-relaxed">Join communities or start a new one.</p>
                </div>
              </div>
            </div>
            <div className="flex relative pb-20 sm:items-center md:w-2/3">
              <div className="h-full w-6 absolute inset-0 flex items-center justify-center">
                <div className="h-full w-1 bg-gray-200 pointer-events-none"></div>
              </div>
              <div className="flex-shrink-0 w-6 h-6 rounded-full mt-10 sm:mt-0 inline-flex items-center justify-center bg-main text-white relative z-10 title-font font-medium text-sm">3</div>
              <div className="flex-grow md:pl-8 pl-6 flex sm:items-center items-start flex-col sm:flex-row">
                <Link onMouseEnter={isScriptAdded ? () => responsiveVoice.speak("Step 3, Connect with peers via chat or video.") : null} to={user === null ? '/login' : '/communities'} className="flex-shrink-0 w-24 h-24 bg-indigo-100 text-main rounded-full inline-flex items-center justify-center cursor-pointer">
                  <PiPlugsConnectedBold size={40} />
                </Link>
                <div className="flex-grow sm:pl-6 mt-6 sm:mt-0">
                  <h2 className="font-medium title-font text-primary mb-1 text-xl">Step 3</h2>
                  <p className="leading-relaxed">Connect with peers via chat or video.</p>
                </div>
              </div>
            </div>
            <div className="flex relative pb-10 sm:items-center md:w-2/3">
              <div className="h-full w-6 absolute inset-0 flex items-center justify-center">
                <div className="h-full w-1 bg-gray-200 pointer-events-none"></div>
              </div>
              <div className="flex-shrink-0 w-6 h-6 rounded-full mt-10 sm:mt-0 inline-flex items-center justify-center bg-main text-white relative z-10 title-font font-medium text-sm">4</div>
              <div className="flex-grow md:pl-8 pl-6 flex sm:items-center items-start flex-col sm:flex-row">
                <Link onMouseEnter={isScriptAdded ? () => responsiveVoice.speak("Step 4, Build lasting relationships and grow together.") : null} to={user === null ? '/login' : '/communities'} className="flex-shrink-0 w-24 h-24 bg-indigo-100 text-main rounded-full inline-flex items-center justify-center cursor-pointer">
                  <TbCirclesRelation size={40} />
                </Link>
                <div className="flex-grow sm:pl-6 mt-6 sm:mt-0">
                  <h2 className="font-medium title-font text-primary mb-1 text-xl">Step 4</h2>
                  <p className="leading-relaxed">Build lasting relationships and grow together.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6 mb-10 md:mb-0 lg:block hidden">
            {!isCallLoaded && (
              <SkeletonTheme baseColor="#14141c" highlightColor="#232234">
                <Skeleton height={600} width={400} />
              </SkeletonTheme>
            )}
            <img
              className="object-cover object-center rounded-lg w-[25rem]"
              alt="hero"
              src={call}
              onLoad={() => setIsCallLoaded(true)}
              onError={() => setIsCallLoaded(false)}
              style={{ display: isCallLoaded ? 'block' : 'none' }}
            />
          </div>
        </div>
      </section>
      <section className='lg:px-5 lg:py-20 py-10 px-3 lg:w-[80vw] mx-auto lg:border-t lg:border-b border-zinc-500'>
        <div className="w-full flex lg:flex-row-reverse flex-col-reverse justify-center items-center">
          <div className="flex flex-col items-center lg:w-1/2">
            <AIQuoteGenerator />
          </div>
          <div className="flex flex-col items-center lg:w-1/2">
            <img className='lg:w-[35vw] rounded-lg lg:my-0 my-4' src={people} alt="img" />
          </div>
        </div>
      </section>
      <section className='lg:px-5 lg:py-20 py-10 px-3 lg:w-[80vw] mx-auto'>
        <h1 className="title-font sm:text-4xl text-3xl mb-4 font-bold w-full text-center text-primary">Learn Sign language</h1>
        <div className="flex lg:flex-row flex-col justify-center items-center gap-16 py-20">
          <iframe className='rounded-lg lg:w-[540px] lg:h-[304px] w-[240px] h-[135px] border border-zinc-800' width="560" height="315" src="https://www.youtube.com/embed/0FcwzMq4iWg?si=xEY8PwxX8RLR0u73" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
          <iframe className='rounded-lg lg:w-[540px] lg:h-[304px] w-[240px] h-[135px] border border-zinc-800' width="560" height="315" src="https://www.youtube.com/embed/Vj_13bdU4dU?si=1VtzOfxh_obJPQCE" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
        </div>
      </section>
    </main>
  )
}

export default Home