import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {FaArrowLeft, FaArrowRight} from 'react-icons/fa';

const Home = () => {
    const [textDirection, setTextDirection] = useState('center');

    const getTextTransform = () => {
        switch (textDirection) {
            case 'left':
                return '-translate-x-[20vw]';
            case 'right':
                return 'translate-x-[20vw]';
            default:
                return 'translate-x-0';
        }
    };

    const getSpanTransform = () => {
        switch (textDirection) {
            case 'left':
                return '-translate-x-[4.5vw]';
            case 'right':
                return 'translate-x-[4.5vw]';
            default:
                return 'translate-x-0';
        }
    };

    return (
        <div className="max-sm:scale-[0.75] max-sm:origin-center max-sm:p-6">
            <div
                className="flex flex-col items-center justify-center h-[71dvh] md:fixed md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2">
                <div className="absolute inset-0 flex items-center justify-center lg:hidden">
                    <div
                        className="w-[350px] h-[350px] border border-[#A0A4AB] rotate-45 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center lg:hidden">
                    <div
                        className="w-[420px] h-[420px] border border-[#A0A4AB] rotate-45 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                </div>

                <div id="main-heading" className="relative z-10 text-center">
                    <h1
                        className={`text-[60px] text-[#1A1B1C] lg:text-[100px] font-inter font-normal tracking-tighter leading-none transition-transform duration-500 ease-in-out ${getTextTransform()}`}
                        style={{opacity: 1}}
                    >
                        Sophisticated<br/>
                        <span
                            className={`block text-[#1A1B1C] transition-transform duration-500 ease-in-out ${getSpanTransform()}`}
                        >
              skincare
            </span>
                    </h1>
                </div>

                <p className="z-10 block lg:hidden w-[30ch] mt-4 text-[16px] font-semibold text-center text-muted-foreground text-[#1a1b1c83]">
                    Skinstric developed an A.I. that creates a highly-personalized routine tailored to what your skin
                    needs.
                </p>

                <div className="z-10 mt-4 lg:hidden flex justify-center items-center">
                    <Link to="/testing" className="relative group block">
                        <button
                            className="relative z-10 flex items-center justify-center gap-4 hover:scale-105 duration-300">
                            <span className="text-[12px] font-bold cursor-pointer">ENTER EXPERIENCE</span>
                            <div
                                className="w-[24px] h-[24px] border-2 border-solid border-black rotate-45 cursor-pointer flex items-center justify-center">
                                <svg viewBox="0 0 24 24" width="12" height="12"
                                     className="fill-current text-black -rotate-45">
                                    <path d="M8 5v14l11-7z"></path>
                                </svg>
                            </div>
                        </button>
                    </Link>
                </div>

                <div
                    className="hidden lg:block fixed bottom-[calc(-7vh)] left-[calc(-20vw)] xl:left-[calc(-27vw)] 2xl:left-[calc(-31vw)] [@media(width>=1920px)]:left-[calc(-33vw)] font-normal text-sm text-[#1A1B1C] space-y-3 uppercase">
                    <p>
                        Skinstric developed an A.I. that creates a<br/>highly-personalized routine tailored to<br/>what
                        your skin needs.
                    </p>
                </div>

                <div
                    id="left-section"
                    className={`hidden lg:block fixed left-[calc(-53vw)] xl:left-[calc(-50vw)] top-1/2 -translate-y-1/2 w-[450px] h-[450px] transition-opacity duration-500 ease-in-out ${
                        textDirection === 'left' ? 'opacity-0 pointer-events-none duration-700' : 'opacity-100'
                    }`}
                >
                    <div className="relative group w-full h-full">
                        <div
                            className="w-full h-full border-2 border-dotted border-[#A0A4AB] bg-transparent rotate-45 opacity-90"></div>

                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div
                                className="w-full h-full border-dotted border-2 border-black opacity-0 group-hover:opacity-10 rotate-45 transition duration-300 transform scale-[1.1]"></div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div
                                className="w-full h-full border-dotted border-2 border-black opacity-0 group-hover:opacity-5 rotate-45 transition duration-300 transform scale-[1.2]"></div>
                        </div>

                        <div className="absolute top-1/2 left-1/2 translate-x-1/2 -translate-y-1/2">
                            <button
                                id="discover-button"
                                className="relative z-10 inline-flex items-center justify-center gap-4 whitespace-nowrap rounded-md text-sm font-normal text-[#1A1B1C] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer disabled:opacity-50 h-9 px-3 py-1"
                                onMouseEnter={() => setTextDirection('right')}
                                onMouseLeave={() => setTextDirection('center')}
                            >
                                <div
                                    className="w-[30px] h-[30px] border-2 border-solid border-black rotate-45 cursor-pointer group-hover:scale-110 duration-300 flex items-center justify-center">
                                    <FaArrowLeft className="scale-[0.9] -rotate-45 group-hover:scale-80 duration-300"/>
                                </div>
                                <span className="text-sm font-semibold">Discover A.I.</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    id="right-section"
                    className={`hidden lg:block fixed right-[calc(-53vw)] xl:right-[calc(-50vw)] top-1/2 -translate-y-1/2 w-[450px] h-[450px] transition-opacity duration-500 ease-in-out ${
                        textDirection === 'right' ? 'opacity-0 pointer-events-none duration-700' : 'opacity-100'
                    }`}
                >
                    <Link to="/testing" className="relative group w-full h-full block">
                        <div
                            className="w-full h-full border-2 rotate-45 border-dotted border-[#A0A4AB] bg-transparent opacity-100"></div>

                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div
                                className="w-full h-full border-dotted border-2 border-black opacity-0 group-hover:opacity-10 rotate-45 transition duration-300 transform scale-[1.1]"></div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div
                                className="w-full h-full border-dotted border-2 border-black opacity-0 group-hover:opacity-5 rotate-45 transition duration-300 transform scale-[1.2]"></div>
                        </div>


                        <div className="absolute top-1/2 right-1/2 -translate-x-2/3 -translate-y-1/2">
                            <button
                                id="take-test-button"
                                className="relative z-10 inline-flex items-center justify-center gap-4 whitespace-nowrap rounded-md text-sm font-normal text-[#1A1B1C] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer disabled:opacity-50 h-9 px-3 py-1"
                                onMouseEnter={() => setTextDirection('left')}
                                onMouseLeave={() => setTextDirection('center')}
                            >
                                <span className="text-sm font-semibold">Take Test</span>
                                <div
                                    className="w-[30px] h-[30px] border-2 border-solid border-black rotate-45 cursor-pointer group-hover:scale-110 duration-300 flex items-center justify-center">
                                    <FaArrowRight className="scale-[0.9] -rotate-45 group-hover:scale-80 duration-300"/>
                                </div>
                            </button>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;