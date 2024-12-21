import React from 'react';
import unity from '../assets/unity.jpg'
import { Link } from 'react-router-dom';
import { useFirebase } from '../context/firebase.jsx'

const Home = () => {

  const { user } = useFirebase();

  return (
    <main className='h-[200vh]'>
      <section class="text-primary body-font px-52 font-main">
        <div class="container mx-auto flex px-5 py-44 md:flex-row flex-col items-center">
          <div class="lg:max-w-lg lg:w-full md:w-1/2 w-5/6 mb-10 md:mb-0">
            <img class="object-cover object-center rounded-lg" alt="hero" src={unity}/>
          </div>
          <div class="lg:flex-grow md:w-1/2 lg:pl-24 md:pl-16 flex flex-col md:items-start md:text-left items-center text-center">
            <h1 class="title-font sm:text-4xl text-3xl mb-4 font-bold">Empowering Lives,
              <br class="hidden lg:inline-block" />Building Communities
            </h1>
            <p class="mb-8 leading-relaxed text-gray-400">A safe space for individuals with diverse abilities to connect, share their journeys, and support each other. Join a community that thrives on empathy, empowerment, and inclusivity.</p>
            <div class="flex justify-center">
              <Link to={user === null ? '/login' : '/communities'} class="inline-flex text-white bg-main border-0 py-2 px-6 focus:outline-none   rounded-lg text-lg">Join the Community</Link>
              <Link to={'/about'} class="ml-4 inline-flex text-gray-700 bg-gray-100 border-0 py-2 px-6 focus:outline-none hover:bg-gray-200 rounded-lg text-lg">Learn More</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Home