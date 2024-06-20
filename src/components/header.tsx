'use client'
import { useState } from "react";
import DetailModal from "./modal";
import { Input } from "./ui/input";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Button } from "./ui/button";

const AppHeader = () => {
    const [showModalChangePassword, setShowModalChangePassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const handleCloseDetailModal = () => {
        setShowModalChangePassword(false);
    };
    return (
        <>
            <div className='shadow-md font-sans tracking-wide relative z-50'>
                <div className='flex flex-wrap items-center justify-between gap-4 px-10 py-4 bg-nashtech min-h-[70px]'>
                    <div id="collapseMenu"
                        className='max-lg:hidden lg:!block max-lg:before:fixed max-lg:before:bg-black max-lg:before:opacity-50 max-lg:before:inset-0 max-lg:before:z-50'>
                        <button id="toggleClose" className='lg:hidden fixed top-2 right-4 z-[100] rounded-full bg-white p-3'>
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 fill-black" viewBox="0 0 320.591 320.591">
                                <path
                                    d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"
                                    data-original="#000000"></path>
                                <path
                                    d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"
                                    data-original="#000000"></path>
                            </svg>
                        </button>

                        <ul
                            className='justify-between flex lg:gap-x-5 max-lg:space-y-3 max-lg:fixed max-lg:bg-white max-lg:w-1/2 max-lg:min-w-[300px] max-lg:top-0 max-lg:left-0 max-lg:p-6 max-lg:h-full max-lg:shadow-md max-lg:overflow-auto z-50'>
                            <li className='max-lg:border-b max-lg:py-3 px-3'>
                                <a href='#'
                                    className='hover:text-white text-white block font-bold text-[15px] bg-nashtech'>Home</a>
                            </li>
                            <li className='max-lg:border-b max-lg:py-3 px-3' onClick={() => setShowModalChangePassword(true)}><a href='#'
                                className='hover:text-white text-white block font-bold text-[15px] bg-nashtech'>binhvn</a>
                            </li>
                        </ul>
                    </div>

                    <div className='flex max-lg:ml-auto'>
                        <button id="toggleOpen" className='lg:hidden'>
                            <svg className="w-7 h-7" fill="#000" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd"
                                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                    clipRule="evenodd"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <DetailModal
                isOpen={showModalChangePassword}
                onClose={handleCloseDetailModal}
                title="Welcome to Online Asset Management"
            >
                <div className="text-gray pb-10">
                    <div className="flex mb-2 items-center"><span className="text-sm w-40">Username (*)</span> <Input type="email" placeholder="binhvn" disabled className="input-class bg-transparent border-gray dark:border-gray-200 px-3 py-2 rounded-md w-full"/></div>
                    <div className="flex mb-2 items-center">
                        <span className="text-sm w-40">Password (*)</span>
                        <div className="relative flex w-full">
                            <Input type={showPassword ? "text" : "password"} placeholder="Input here to change password" className="input-class bg-transparent border-gray dark:border-gray-200 px-3 py-2 rounded-md w-full"/>
                            <span
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute top-1 right-3 "
                            >
                                {showPassword ? (
                                    <VisibilityIcon />
                                ) : (
                                    <VisibilityOffIcon />
                                )}
                            </span>
                        </div>
                    </div>
                    <Button className="bg-nashtech text-white float-right mt-4">Login</Button>
                </div>
            </DetailModal>
        </>
    );
}

export default AppHeader;
