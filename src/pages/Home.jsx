import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaPlay } from 'react-icons/fa';

const Home = () => {
    const [textDirection, setTextDirection] = useState('center');

    const getTextTransform = () => {
        return textDirection === 'left' ? 'max-sm:translate-x-0 -translate-x-[20vw]' :
            textDirection === 'right' ? 'max-sm:translate-x-0 translate-x-[20vw]' :
                'translate-x-0';
    };

    const getSpanTransform = () => {
        return textDirection === 'left' ? 'max-sm:translate-x-0 -translate-x-[19%]' :
            textDirection === 'right' ? 'max-sm:translate-x-0 translate-x-[19%]' :
                'translate-x-0';
    };

    return (
        <div className="min-h-screen flex items-center justify-center max-w-full max-sm:scale-[0.60] max-sm:origin-center">
            <div className="flex flex-col items-center justify-center h-[71dvh] w-full max-w-full md:fixed md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2">
                {/* Mobile-specific squares */}
                <div className="absolute inset-0 flex items-center justify-center sm:hidden">
                    <div
                        className="w-[350px] h-[350px] border border-[#A0A4AB] max-sm:border-[1.6px] rotate-45 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    ></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center sm:hidden">
                    <div
                        className="w-[420px] h-[420px] border border-[#A0A4AB] max-sm:border-[1.6px] rotate-45 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    ></div>
                </div>

                {/* Main heading */}
                <div id="main-heading" className="relative z-10 text-center">
                    <h1
                        className={`text-[60px] max-sm:text-[48px] text-[#1A1B1C] lg:text-[100px] font-inter font-normal tracking-tighter leading-none transition-transform duration-700 ease-in-out ${getTextTransform()}`}
                        style={{ opacity: 1 }}
                    >
                        Sophisticated<br />
                        <span
                            className={`block text-[#1A1B1C] max-sm:text-[48px] transition-transform duration-500 ease-in-out ${getSpanTransform()}`}
                        >
              skincare
            </span>
                    </h1>
                </div>

                {/* Mobile-specific description and button */}
                <p className="z-10 block sm:hidden w-[30ch] mt-4 text-[16px] max-sm:text-[12.8px] font-semibold text-center text-muted-foreground text-[#1a1b1c83]">
                    Skinstric developed an A.I. that creates a highly-personalized routine tailored to what your skin needs.
                </p>

                <div className="z-10 mt-4 sm:hidden flex justify-center items-center">
                    <Link to="/testing" className="relative group block">
                        <button className="relative z-10 flex items-center justify-center gap-4 hover:scale-105 duration-300">
              <span className="text-[12px] max-sm:text-[9.6px] font-bold cursor-pointer">
                ENTER EXPERIENCE
              </span>
                            <div
                                className="w-[32px] h-[32px] border-2 max-sm:border-[1.6px] border-solid border-black rotate-45 cursor-pointer flex items-center justify-center"
                            >
                                <FaPlay className="scale-[0.7] -rotate-45 translate-x-[1px]" />
                            </div>
                        </button>
                    </Link>
                </div>

                {/* Description for larger screens */}
                <div className="hidden sm:block fixed bottom-[calc(-7vh)] left-[calc(-20vw)] xl:left-[calc(-27vw)] 2xl:left-[calc(-31vw)] [@media(width>=1920px)]:left-[calc(-33vw)] font-normal text-sm text-[#1A1B1C] space-y-3 uppercase">
                    <p>
                        Skinstric developed an A.I. that creates a<br />highly-personalized routine tailored to<br />what your skin needs.
                    </p>
                </div>

                {/* Left Section */}
                <div
                    id="left-section"
                    className={`hidden sm:block fixed left-[-250px] top-1/2 -translate-y-1/2 w-[500px] h-[500px] z-20 transition-opacity duration-500 ease-in-out ${
                        textDirection === 'left' ? 'opacity-0 pointer-events-none duration-700' : 'opacity-100'
                    }`}
                >
                    <div
                        className="relative group w-full h-full block cursor-not-allowed"
                        onMouseEnter={() => setTextDirection('right')}
                        onMouseLeave={() => setTextDirection('center')}
                    >
                        <div className="w-full h-full border-2 max-sm:border-[1.6px] border-dotted border-[#A0A4AB] bg-transparent rotate-45 opacity-60"></div>

                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-full h-full border-dotted border-2 max-sm:border-[1.6px] border-black opacity-0 group-hover:opacity-10 rotate-45 transition duration-300 transform scale-[1.1]"></div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-full h-full border-dotted border-2 max-sm:border-[1.6px] border-black opacity-0 group-hover:opacity-5 rotate-45 transition duration-300 transform scale-[1.2]"></div>
                        </div>

                        <div className="absolute top-1/2 left-1/2 translate-x-1/2 -translate-y-1/2">
                            <button
                                id="discover-button"
                                className="relative z-10 inline-flex items-center justify-center gap-4 group-hover:font-bold group-hover:cursor-not-allowed group-hover:gap-10 whitespace-nowrap rounded-md text-sm max-sm:text-[11.2px] font-normal text-[#1A1B1C] transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer disabled:opacity-50 h-9 px-3 py-1 group/button duration-300"
                            >
                                <div className="relative w-[36px] h-[36px] border border-solid border-black max-sm:border-[0.8px] -rotate-45 group-hover:cursor-not-allowed group-hover:scale-[1.8] duration-300 flex items-center justify-center">
                                    <div className="absolute inset-[3px] border border-dotted border-[#A0A4AB] max-sm:border-[0.8px] opacity-0 group-hover:opacity-80 transition-opacity duration-300"></div>
                                    <FaPlay className="scale-[1.0] -rotate-[135deg] group-hover:scale-[0.6] duration-300" />
                                </div>
                                <span className="text-sm max-sm:text-[11.2px]">DISCOVER A.I.</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Section */}
                <div
                    id="right-section"
                    className={`hidden sm:block fixed right-[-250px] top-1/2 -translate-y-1/2 w-[500px] h-[500px] z-20 transition-opacity duration-500 ease-in-out ${
                        textDirection === 'right' ? 'opacity-0 pointer-events-none duration-700' : 'opacity-100'
                    }`}
                >
                    <Link
                        to="/testing"
                        className="relative group w-full h-full block"
                        onMouseEnter={() => setTextDirection('left')}
                        onMouseLeave={() => setTextDirection('center')}
                    >
                        <div className="w-full h-full border-2 max-sm:border-[1.6px] border-dotted border-[#A0A4AB] bg-transparent rotate-45 opacity-60"></div>

                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-full h-full border-dotted border-2 max-sm:border-[1.6px] border-black opacity-0 group-hover:opacity-10 rotate-45 transition duration-300 transform scale-[1.1]"></div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-full h-full border-dotted border-2 max-sm:border-[1.6px] border-black opacity-0 group-hover:opacity-5 rotate-45 transition duration-300 transform scale-[1.2]"></div>
                        </div>

                        <div className="absolute top-1/2 right-1/2 -translate-x-2/3 -translate-y-1/2">
                            <button
                                id="take-test-button"
                                className="relative z-10 inline-flex items-center justify-center gap-4 group-hover:font-bold group-hover:gap-10 whitespace-nowrap rounded-md text-sm max-sm:text-[11.2px] font-normal text-[#1A1B1C] transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer disabled:opacity-50 h-9 px-3 py-1 group/button duration-300"
                            >
                                <span className="text-sm max-sm:text-[11.2px]">TAKE TEST</span>
                                <div className="relative w-[36px] h-[36px] border border-solid border-black max-sm:border-[0.8px] rotate-45 cursor-pointer group-hover:scale-[1.8] duration-300 flex items-center justify-center">
                                    <div className="absolute inset-[3px] border border-dotted border-[#A0A4AB] max-sm:border-[0.8px] opacity-0 group-hover:opacity-80 transition-opacity duration-300"></div>
                                    <FaPlay className="scale-[1.0] -rotate-45 group-hover:scale-[0.6] duration-300 translate-x-[1px]" />
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