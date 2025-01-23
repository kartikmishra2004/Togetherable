import React, { useState } from 'react'
import { useFirebase } from '../context/firebase';
import { useScript } from '../context/TTScontext';

const Modal = ({ setModal, completionPercentage, userData }) => {
    const { updateProfile, uploadImage } = useFirebase();
    const { isScriptAdded } = useScript();

    const [data, setData] = useState({
        fullName: userData.fullName || '',
        email: userData.email || '',
        phone: userData.phone || '',
        bio: userData.bio || '',
        photoURL: userData.photoURL || '',
    });
    const [previewPhoto, setPreviewPhoto] = useState(userData.photoURL);
    const [photoUploading, setPhotoUploading] = useState(false);

    const handleChange = (e) => {
        const value = e.target.value;
        const name = e.target.name;
        setData({
            ...data,
            [name]: value,
        });
    };

    const handlePhotoChange = async (e) => {
        setPhotoUploading(true);
        const file = e.target.files[0];
        if (file) {
            const url = await uploadImage(file);
            setPreviewPhoto(URL.createObjectURL(file));
            setPhotoUploading(false);
            setData({
                ...data,
                photoURL: url ,
            });
        }
    };

    return (
        <div className='font-main'>
            <div className="fixed inset-0 z-40 min-h-full mt-4 overflow-y-auto overflow-x-hidden transition flex items-center">
                <div aria-hidden="true" className="fixed inset-0 w-full h-full bg-black/60 backdrop-blur-sm cursor-pointer"></div>
                <div className="relative w-full cursor-pointer pointer-events-none transition my-auto lg:p-4 p-1">
                    <div className="w-full py-2 bg-secondary border border-zinc-800 cursor-default pointer-events-auto dark:bg-gray-800 relative rounded-lg mx-auto max-w-[30rem]">

                        <button onClick={() => setModal(false)} type="button" className="absolute cursor-pointer top-2 right-2 rtl:right-auto rtl:left-2">
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
                            <div className="flex justify-evenly items-center">
                                <img src={previewPhoto || 'https://res.cloudinary.com/dlwudcsu1/image/upload/v1723743051/Picsart_24-08-15_23-00-10-662_bix7iy.png'} className={`rounded-full w-24 h-24 object-cover bg-primary ${photoUploading ? 'animate-pulse' : ''}`} />
                                <input accept="image/*" id='editPhoto' type="file" className='hidden' onChange={handlePhotoChange} />
                                <label onMouseEnter={isScriptAdded ? () => responsiveVoice.speak("Select photo") : null} htmlFor={`${photoUploading ? '' : 'editPhoto'}`}>
                                    <div className={`w-max ${photoUploading ? 'bg-gray-800 cursor-not-allowed' : 'bg-main hover:bg-[#9036c8]'} h-max  text-white px-4 py-2 rounded-lg`}>Select photo</div>
                                </label>
                            </div>
                            <div className="grid grid-cols-1 place-items-center px-4 py-2">
                                <form noValidate className="space-y-4">
                                    <input
                                        autoComplete="off"
                                        type="text"
                                        name="fullName"
                                        placeholder="Full name"
                                        value={data.fullName}
                                        onChange={handleChange}
                                        className="px-2 w-full py-3 border rounded-lg focus:outline-none bg-transparent text-primary placeholder:text-zinc-700 border-zinc-500"
                                    />
                                    <input
                                        autoComplete="off"
                                        type="email"
                                        name="email"
                                        placeholder="Email"
                                        value={data.email}
                                        onChange={handleChange}
                                        className="px-2 w-full py-3 border rounded-lg focus:outline-none bg-transparent text-primary placeholder:text-zinc-700 border-zinc-500"
                                    />
                                    <input
                                        autoComplete="off"
                                        type="text"
                                        name="phone"
                                        placeholder="Phone"
                                        value={data.phone}
                                        onChange={handleChange}
                                        className="px-2 w-full py-3 border rounded-lg focus:outline-none bg-transparent text-primary placeholder:text-zinc-700 border-zinc-500"
                                    />
                                    <textarea
                                        autoComplete='off'
                                        name='bio'
                                        value={data.bio}
                                        onChange={handleChange}
                                        className="border focus:outline-none resize-none my-4 placeholder:text-zinc-700 border-zinc-500 h-24 rounded-lg w-full px-2 py-3 bg-secondary leading-tight"
                                        placeholder="Write something about you..."
                                    ></textarea>
                                </form>
                            </div>

                            <div aria-hidden="true" className="border-b border-gray-700 px-2"></div>
                            <div className="px-6 py-2">
                                <div onMouseEnter={isScriptAdded ? () => responsiveVoice.speak("Cancel") : null} className="grid gap-2 grid-cols-[repeat(auto-fit,minmax(0,1fr))]">
                                    <button onClick={() => setModal(false)} type="button"
                                        className="inline-flex items-center justify-center py-1 gap-1 font-medium rounded-lg border border-zinc-500 min-h-[2.25rem] px-4 text-sm text-primary bg-secondary">
                                        Cancel
                                    </button>

                                    <button onMouseEnter={isScriptAdded ? () => responsiveVoice.speak("Save") : null} disabled={photoUploading ? true : false} onClick={() => { setModal(false); updateProfile(data); }} type="submit"
                                        className="inline-flex items-center disabled:bg-gray-800 disabled:cursor-not-allowed justify-center py-1 gap-1 font-medium rounded-lg min-h-[2.25rem] px-4 text-sm text-primary shadow bg-main hover:bg-[#9036c8]">
                                        <span className="flex items-center gap-1">
                                            <span className="">
                                                {photoUploading ? 'Please wait...' : 'Save'}
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
