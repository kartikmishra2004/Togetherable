import React from 'react'

const DeletePostModal = ({ setShowDeleteModal }) => {
    return (
        <div className='font-main text-primary'>
            <div class="fixed inset-0 z-40 min-h-full overflow-y-auto overflow-x-hidden transition flex items-center">
                <div aria-hidden="true" class="fixed inset-0 w-full h-full bg-black/60 backdrop-blur-sm cursor-pointer">
                </div>
                <div class="relative w-full cursor-pointer pointer-events-none transition my-auto p-4">
                    <div
                        class="w-full py-2 bg-secondary border border-zinc-800 cursor-default pointer-events-auto dark:bg-gray-800 relative rounded-xl mx-auto max-w-sm">
                        <button onClick={() => setShowDeleteModal(false)} tabindex="-1" type="button" class="absolute top-2 right-2 rtl:right-auto rtl:left-2">
                            <svg title="Close" tabindex="-1" class="h-4 w-4 cursor-pointer text-gray-400"
                                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fill-rule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clip-rule="evenodd"></path>
                            </svg>
                            <span class="sr-only">
                                Close
                            </span>
                        </button>
                        <div class="space-y-2 p-2">
                            <div class="p-4 space-y-2 text-center">
                                <h2 class="text-xl font-bold tracking-tight" id="page-action.heading">
                                    Delete post
                                </h2>
                                <p class="text-gray-500">
                                    Are you sure you would like to delete this post?
                                </p>
                            </div>
                        </div>
                        <div class="space-y-2">
                            <div aria-hidden="true" class="border-t border-zinc-500 px-2"></div>
                            <div class="px-6 py-2">
                                <div class="grid gap-2 grid-cols-[repeat(auto-fit,minmax(0,1fr))]">
                                    <button onClick={() => setShowDeleteModal(false)} type="button"
                                        class="inline-flex items-center justify-center py-1 gap-1 rounded-lg border outline-none min-h-[2.25rem] px-4 text-sm border-zinc-500 bg-secondary">
                                        <span class="flex items-center gap-1">
                                            <span class="">
                                                Cancel
                                            </span>
                                        </span>
                                    </button>
                                    <button onClick={() => setShowDeleteModal(false)} type="submit"
                                        class="inline-flex items-center justify-center py-1 gap-1 rounded-lg outline-none min-h-[2.25rem] px-4 text-sm bg-red-500 hover:bg-red-600">
                                        <span class="flex items-center gap-1">
                                            <span class="">
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
