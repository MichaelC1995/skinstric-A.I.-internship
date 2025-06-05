import React from 'react';
import { Link } from 'react-router-dom';
import { useCamera } from '../context/CameraContext';

const Navbar = () => {
    const { isCameraViewActive } = useCamera();

    return (
        <div
            className={`flex flex-row h-[64px] w-full justify-between py-3 mb-3 relative z-[1000] ${
                isCameraViewActive ? 'text-white' : 'text-[#1A1B1C]'
            }`}
        >
            <div className="flex flex-row pt-1 scale-75 justify-center items-center">
                <Link
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md transition-colors h-9 px-4 py-2 font-semibold text-sm mr-2 line-clamp-4 leading-[16px] z-[1000]"
                    to="/"
                >
                    SKINSTRIC
                </Link>
                <svg
                    className="w-[4px] h-[17px]"
                    viewBox="0 0 4 17"
                    fill="currentColor"
                    aria-label="left-bracket"
                >
                    <path d="M0 0h2v17H0V0z M2 0h2v2H2V0z M2 15h2v2H2v-2z" />
                </svg>
                <p
                    className={`text-sm font-semibold ml-1.5 mr-1.5 ${
                        isCameraViewActive ? 'text-white' : 'text-[#1a1b1c83]'
                    }`}
                >
                    INTRO
                </p>
                <svg
                    className="w-[4px] h-[17px]"
                    viewBox="0 0 4 17"
                    fill="currentColor"
                    aria-label="right-bracket"
                >
                    <path d="M4 0H2v17h2V0z M2 0H0v2h2V0z M2 15H0v2h2v-2z" />
                </svg>
            </div>
            <button
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-colors disabled:pointer-events-none text-white shadow hover:bg-primary/90 h-9 px-4 py-2 mx-4 scale-[0.8] text-[10px] bg-[#1A1B1C] leading-[16px]"
            >
                ENTER CODE
            </button>
        </div>
    );
};

export default Navbar;