import React from 'react';
import hearingloss from '../assets/hearing-loss.jpg'
import india from '../assets/india-hearingloss.jpg';
import { Link } from 'react-router-dom';

function About() {
  const statistics = [
    {
      number: "466M",
      description: "People worldwide have disabling hearing loss",
      source: "WHO, 2021"
    },
    {
      number: "34M",
      description: "Of these are children",
      source: "WHO, 2021"
    },
    {
      number: "2.5B",
      description: "People projected to have some degree of hearing loss by 2050",
      source: "WHO, 2021"
    }
  ];

  return (
    <div className="min-h-screen lg:py-20 py-10 font-main text-primary">
      <div className="lg:max-w-[80vw] mx-auto px-3 py-16">
        <h1 className="text-4xl font-bold text-center text-primary mb-8">
          About Our Community
        </h1>

        <div className="bg-secondary border border-zinc-800 rounded-lg shadow-xl p-8 mb-12">
          <h2 className="text-2xl font-semibold text-main mb-4">Our Mission</h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            We are dedicated to creating an inclusive space where people with different abilities can connect,
            share their experiences, and support one another. Our platform bridges communication gaps and
            builds understanding across diverse communities.
          </p>
          <p className="text-gray-400 leading-relaxed">
            Through accessible features like video chat rooms, message boards, and group discussions,
            we ensure that everyone can participate fully, regardless of their hearing, visual, or other abilities.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-primary mb-8 text-center">
          Global Impact of Hearing Loss
        </h2>

        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {statistics.map((stat, index) => (
            <div key={index} className="bg-secondary border border-zinc-800 rounded-lg shadow-lg p-6 text-center transform hover:scale-105 transition-transform">
              <div className="text-3xl font-bold text-main mb-2">{stat.number}</div>
              <div className="text-gray-400 mb-2">{stat.description}</div>
              <div className="text-sm text-gray-300">Source: {stat.source}</div>
            </div>
          ))}
        </div>

        <h2 className="text-2xl text-primary font-bold mb-8 w-full text-center">Platform Features</h2>
        <div className="bg-secondary lg:w-max border mx-auto px-12 border-gray-800 rounded-lg p-8">
          <div className="grid md:grid-cols-2 gap-6 lg:gap-24">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-main mb-2">Community & Social</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-main mr-2">✓</span>
                  <span className="text-gray-400">Create and join existing communities</span>
                </li>
                <li className="flex items-start">
                  <span className="text-main mr-2">✓</span>
                  <span className="text-gray-400">Share text and media posts in communities</span>
                </li>
                <li className="flex items-start">
                  <span className="text-main mr-2">✓</span>
                  <span className="text-gray-400">Like and save community posts</span>
                </li>
                <li className="flex items-start">
                  <span className="text-main mr-2">✓</span>
                  <span className="text-gray-400">Group chat in communities</span>
                </li>
                <li className="flex items-start">
                  <span className="text-main mr-2">✓</span>
                  <span className="text-gray-400">Group audio/video chat support</span>
                </li>
                <li className="flex items-start">
                  <span className="text-main mr-2">✓</span>
                  <span className="text-gray-400">Navigate community members on interactive map</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-main mb-2">Accessibility & AI Features</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-main mr-2">✓</span>
                  <span className="text-gray-400">Text-to-speech and speech-to-text in chats</span>
                </li>
                <li className="flex items-start">
                  <span className="text-main mr-2">✓</span>
                  <span className="text-gray-400">Voice commands for input fields</span>
                </li>
                <li className="flex items-start">
                  <span className="text-main mr-2">✓</span>
                  <span className="text-gray-400">Speech output for selected text</span>
                </li>
                <li className="flex items-start">
                  <span className="text-main mr-2">✓</span>
                  <span className="text-gray-400">AI chat assistant for help and emergencies</span>
                </li>
                <li className="flex items-start">
                  <span className="text-main mr-2">✓</span>
                  <span className="text-gray-400">Sentiment analysis for chat messages</span>
                </li>
                <li className="flex items-start">
                  <span className="text-main mr-2">✓</span>
                  <span className="text-gray-400">AI-powered motivational quotes</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="w-full lg:py-28 py-16 flex flex-col-reverse lg:flex-row items-center justify-between gap-10 font-main">
          <div className="lg:w-1/2">
            <h1 className='text-4xl text-primary font-bold mb-4 w-full text-center lg:text-start'>Advocating for hearing care</h1>
            <p className='leading-relaxed text-gray-400 text-center lg:text-start'>A person is said to have hearing loss if they are not able to hear as well as someone with normal hearing, meaning hearing thresholds of 20 dB or better in both ears. It can be mild, moderate, moderately severe, severe or profound, and can affect one or both ears. Major causes of hearing loss include congenital or early onset childhood hearing loss, chronic middle ear infections, noise-induced hearing loss, age-related hearing loss, and ototoxic drugs that damage the inner ear.</p>
          </div>
          <div className="lg:w-1/2">
            <img className='lg:w-[40vw] w-[90vw] rounded-lg' src={hearingloss} alt="" />
          </div>
        </div>
        <div className="w-full lg:py-20 flex flex-col-reverse lg:flex-row-reverse items-center justify-between gap-10 font-main">
          <div className="lg:w-1/2">
            <h1 className='lg:text-3xl text-xl mb-4 text-center lg:text-start text-primary font-bold'>The World Health Organisation estimates that about 63 million Indians have severe hearing impairment. This may hinder their communication and affect their life.</h1>
            <p className='leading-relaxed text-gray-400 text-center lg:text-start'>Hearing aids can greatly improve hearing capabilities and elevate the quality of living. However, choosing the right hearing aid from the top hearing aid brands in India is easier said than done. You require a trustworthy partner that provides cutting-edge assistive technology and consistent pre and post-purchase support.</p>
            <div className="w-full flex lg:block justify-center lg:justify-start">
              <Link to={'/'} className='inline-flex mx-auto text-white bg-main border-0 hover:bg-[#9036c8] py-2 px-6 focus:outline-none rounded-lg text-sm lg:text-lg mt-8'>Locate a Hearing Aids Centre Near You</Link>
            </div>
          </div>
          <div className="lg:w-1/2">
            <img className='lg:w-[40vw] w-[90vw] rounded-lg' src={india} alt="" />
          </div>
        </div>
      </div>
      <div className="mt-8 text-center text-sm text-gray-400">
        <p>Data source: <a href="https://www.who.int/health-topics/hearing-loss" className="text-main hover:underline" target="_blank" rel="noopener noreferrer">World Health Organization - Hearing Loss</a></p>
      </div>
    </div>
  );
}

export default About;