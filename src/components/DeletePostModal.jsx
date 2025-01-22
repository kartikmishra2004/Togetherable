import React from 'react'

const DeletePostModal = ({ setShowDeleteModal, deletePost, communityId, postId, postDone, setPostDone }) => {

    const handleDelete = async () => {
        setShowDeleteModal(false);
        await deletePost(communityId, postId);
        setPostDone(!postDone);
    }
    return (
        <div className='font-main text-primary'>
            <div className="fixed inset-0 z-40 min-h-full overflow-y-auto overflow-x-hidden transition flex items-center">
                <div aria-hidden="true" className="fixed inset-0 w-full h-full bg-black/60 backdrop-blur-sm cursor-pointer">
                </div>
                <div className="relative w-full cursor-pointer pointer-events-none transition my-auto p-4">
                    <div
                        className="w-full py-2 bg-secondary border border-zinc-800 cursor-default pointer-events-auto dark:bg-gray-800 relative rounded-xl mx-auto max-w-sm">
                        <button onClick={() => setShowDeleteModal(false)} tabIndex="-1" type="button" className="absolute top-2 right-2 rtl:right-auto rtl:left-2">
                            <svg title="Close" tabIndex="-1" className="h-4 w-4 cursor-pointer text-gray-400"
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
                            <div className="p-4 space-y-2 text-center">
                                <h2 className="text-xl font-bold tracking-tight" id="page-action.heading">
                                    Delete post
                                </h2>
                                <p className="text-gray-500">
                                    Are you sure you would like to delete this post?
                                </p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div aria-hidden="true" className="border-t border-zinc-500 px-2"></div>
                            <div className="px-6 py-2">
                                <div className="grid gap-2 grid-cols-[repeat(auto-fit,minmax(0,1fr))]">
                                    <button onMouseEnter={() => responsiveVoice.speak("Cancel")} onClick={() => setShowDeleteModal(false)} type="button"
                                        className="inline-flex items-center justify-center py-1 gap-1 rounded-lg border outline-none min-h-[2.25rem] px-4 text-sm border-zinc-500 bg-secondary">
                                        <span className="flex items-center gap-1">
                                            <span className="">
                                                Cancel
                                            </span>
                                        </span>
                                    </button>
                                    <button onMouseEnter={() => responsiveVoice.speak("Delete")} onClick={handleDelete} type="submit"
                                        className="inline-flex items-center justify-center py-1 gap-1 rounded-lg outline-none min-h-[2.25rem] px-4 text-sm bg-red-500 hover:bg-red-600">
                                        <span className="flex items-center gap-1">
                                            <span className="">
                                                Delete
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

export default DeletePostModal
