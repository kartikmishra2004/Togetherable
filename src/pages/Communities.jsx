import React, { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom';
import { useFirebase } from '../context/firebase';
import CreateCommunityModal from '../components/CreateCommunityModal.jsx';

const Communities = () => {

  const [showModal, setShowModal] = useState(false);

  const { user, fetchCommunities, loading } = useFirebase();
  const [communities, setCommunities] = useState([]);

  useEffect(() => {
    fetchCommunities()
      .then((res) => setCommunities(res))
  }, []);

  useEffect(() => {
    window.scroll(0, 0);
  }, [location]);

  if (loading || !communities.length) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="jelly"></div>
        <svg width="0" height="0" className="jelly-maker">
          <defs>
            <filter id="uib-jelly-ooze">
              <feGaussianBlur in="SourceGraphic" stdDeviation="6.25" result="blur"></feGaussianBlur>
              <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="ooze"></feColorMatrix>
              <feBlend in="SourceGraphic" in2="ooze"></feBlend>
            </filter>
          </defs>
        </svg>
      </div>
    )
  }

  if (user === null) {
    return <Navigate to={'/login'} />
  }

  if (communities.length > 0) {
    return (
      <section id="testimonies" className="flex justify-center min-h-screen py-16 w-full font-main">
        {showModal && <CreateCommunityModal setShowModal={setShowModal} />}
        <div className="w-[80vw] flex flex-col justify-center items-center py-12">
          <div className="transition duration-500 ease-in-out transform scale-100 translate-x-0 translate-y-0 opacity-100">
            <div className="mb-12 space-y-5 md:mb-16 md:text-center">
              <h1 className="mb-5 text-4xl font-bold text-primary md:text-center">
                Become Part of Communities
              </h1>
              <p className="text-xl text-gray-100 md:text-center md:text-2xl">
                Find your support network.
              </p>
            </div>
          </div>
          <ul className="space-y-8 w-full">
            {communities.map((data, key) => (
              <li key={key} className="text-sm leading-6">
                <div className="relative group">
                  <div
                    className="absolute transition rounded-lg opacity-25 inset-1 bg-gradient-to-r from-purple-600 to-[#9036c8] duration-400 group-hover:opacity-100 group-hover:duration-200">
                  </div><Link to={`/communities/${data.id}`} state={{ createdBy: data.createdBy }} className="cursor-pointer">
                    <div
                      className="relative p-6 space-y-6 leading-none rounded-lg bg-secondary border border-zinc-800 hover:shadow-sm hover:shadow-main transition-all duration-300 ease-in-out">
                      <div className="flex items-center space-x-4"><img
                        src={data.communityImage}
                        className="w-12 h-12 bg-center bg-primary object-cover rounded-full" alt="Kanye West" />
                        <div>
                          <h3 className="text-lg font-semibold text-primary">{data.name}</h3>
                          <p className="text-gray-500 text-md">{data.members.length} members</p>
                        </div>
                      </div>
                      <p className="leading-normal text-gray-300 text-md">{data.description}</p>
                    </div>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
          <div className="w-full h-[1px] bg-zinc-700 my-10 flex justify-center items-center"></div>
          <div className="flex justify-evenly w-full items-center">
            <button onClick={() => setShowModal(true)} className='inline-flex text-primary bg-main border-0 hover:bg-[#9036c8] py-2 px-6 focus:outline-none rounded-lg lg:text-lg'>Create Communituy</button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <div className='w-full h-screen flex flex-col items-center pt-28 font-main'>
      {showModal && <CreateCommunityModal setShowModal={setShowModal} />}
      <h1 className='text-3xl font-bold pb-10'>
        Communities
      </h1>
      You have not joinned any community!!
      <button onClick={() => setShowModal(true)} className='inline-flex mt-3 text-primary bg-main border-0 hover:bg-[#9036c8] py-2 px-6 focus:outline-none rounded-lg lg:text-lg'>Create Communituy</button>
    </div>
  )
}

export default Communities
