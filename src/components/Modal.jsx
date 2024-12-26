import React from 'react'

const Modal = ({ setModal, completionPercentage }) => {
    return (
        <div className='font-main'>
            <div className="fixed inset-0 z-40 min-h-full overflow-y-auto overflow-x-hidden transition flex items-center">
                <div aria-hidden="true" className="fixed inset-0 w-full h-full bg-black/60 backdrop-blur-sm cursor-pointer"></div>
                <div className="relative w-full cursor-pointer pointer-events-none transition my-auto p-4">
                    <div className="w-full py-2 bg-secondary border border-zinc-800 cursor-default pointer-events-auto dark:bg-gray-800 relative rounded-lg mx-auto max-w-sm">
                        <button onClick={() => setModal(false)} type="button" className="absolute cursor-pointer hover:rotate-180 transition-all ease-in-out duration-500  top-2 right-2 rtl:right-auto rtl:left-2">
                            <svg xlinkTitle="Close" className="h-6 w-6 text-gray-400"
                                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"></path>
                            </svg>
                            <span className="sr-only">
                                Close
                            </span>
                        </button>
                        <div className="space-y-2 p-2">
                            <div className="p-2 space-y-2 text-center dark:text-white">
                                <h2 className="text-xl font-bold tracking-tight" id="page-action.heading">
                                    {completionPercentage === 100 ? 'Edit profile' : 'Complete your profile'}
                                </h2>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div aria-hidden="true" className="border-t border-gray-700 px-2"></div>

                            <div className="grid grid-cols-1 place-items-center px-4 py-2">
                                <form noValidate className="space-y-4">
                                    <input
                                        autoComplete="off"
                                        type="text"
                                        name="fullName"
                                        placeholder="Full name"
                                        // value={formData.fullName}
                                        // onChange={handleChange}
                                        className="px-2 w-full py-3 border rounded-lg focus:outline-none bg-transparent text-primary placeholder:text-zinc-700 border-zinc-500"
                                    />
                                    <input
                                        autoComplete="off"
                                        type="email"
                                        name="email"
                                        placeholder="Email"
                                        // value={formData.email}
                                        // onChange={handleChange}
                                        className="px-2 w-full py-3 border rounded-lg focus:outline-none bg-transparent text-primary placeholder:text-zinc-700 border-zinc-500"
                                    />
                                    <input
                                        autoComplete="off"
                                        type="text"
                                        name="phone"
                                        placeholder="Phone"
                                        // value={formData.phone}
                                        // onChange={handleChange}
                                        className="px-2 w-full py-3 border rounded-lg focus:outline-none bg-transparent text-primary placeholder:text-zinc-700 border-zinc-500"
                                    />
                                    <textarea
                                        autoComplete='off'
                                        name='bio'
                                        // value={messageData.bio}
                                        // onChange={handleChange}
                                        className="border focus:outline-none resize-none my-4 placeholder:text-zinc-700 border-zinc-500 h-24 rounded-lg w-full px-2 py-3 bg-secondary text-zinc-500 leading-tight"
                                        placeholder="Write something about you..."
                                    ></textarea>
                                </form>
                            </div>

                            <div aria-hidden="true" className="border-b border-gray-700 px-2"></div>
                            <div className="px-6 py-2">
                                <div className="grid gap-2 grid-cols-[repeat(auto-fit,minmax(0,1fr))]">
                                    <button onClick={() => setModal(false)} type="button"
                                        className="inline-flex items-center justify-center py-1 gap-1 font-medium rounded-lg border transition-colors outline-none focus:ring-offset-2 focus:ring-2 focus:ring-inset dark:focus:ring-offset-0 min-h-[2.25rem] px-4 text-sm text-gray-800 bg-white border-gray-300 hover:bg-gray-50 focus:ring-primary-600 focus:text-primary-600 focus:bg-primary-50 focus:border-primary-600 dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-600 dark:hover:border-gray-500 dark:text-gray-200 dark:focus:text-primary-400 dark:focus:border-primary-400 dark:focus:bg-gray-800">
                                        Cancel
                                    </button>

                                    <button onClick={() => setModal(false)} type="submit"
                                        className="inline-flex items-center justify-center py-1 gap-1 font-medium rounded-lg border transition-colors outline-none focus:ring-offset-2 focus:ring-2 focus:ring-inset dark:focus:ring-offset-0 min-h-[2.25rem] px-4 text-sm text-white shadow focus:ring-white border-transparent bg-[#4d1b80] hover:bg-[#7127BA] focus:bg-[#11071F] focus:ring-offset-[#11071F]">

                                        <span className="flex items-center gap-1">
                                            <span className="">
                                                Send
                                            </span>
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Modal
