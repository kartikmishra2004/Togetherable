import React from 'react'

const Footer = () => {
    return (
        <footer className="bg-secondary text-primary border-t border-zinc-800 font-main">
            <div className="max-w-screen-xl py-4 px-4 sm:px-6 sm:flex justify-between mx-auto">
                <div className="p-5 flex items-center sm:w-8/12">
                    <h3 className="font-bold text-3xl mb-4 font-logo">Togetherable</h3>
                </div>
                <div className="p-5 sm:w-4/12">
                    <h3 className="font-medium text-lg mb-4">Contact us</h3>
                    <form className="mt-4">
                        <input 
                            className="border focus:outline-none placeholder:text-zinc-700 border-zinc-500 rounded-lg w-full px-2 py-3 bg-secondary text-zinc-500 leading-tight" 
                            type="email" 
                            placeholder="username@email.com" 
                        />
                        <textarea 
                            className="border focus:outline-none resize-none my-4 placeholder:text-zinc-700 border-zinc-500 h-24 rounded-lg w-full px-2 py-3 bg-secondary text-zinc-500 leading-tight"
                            placeholder="Type your message..."
                        ></textarea>
                        <button className='px-4 w-full py-3 bg-main rounded-lg hover:bg-[#9036c8] focus:outline-none disabled:bg-gray-800'>Send</button>
                    </form>
                </div>
            </div>
            <div className="flex py-5 m-auto text-zinc-500 text-sm flex-col items-center border-t border-zinc-500 max-w-screen-xl">
                <p>© Copyright 2024. All Rights Reserved.</p>
            </div>
        </footer>
    )
}

export default Footer
