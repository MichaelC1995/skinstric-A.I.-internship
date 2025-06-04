import React, { useEffect } from 'react';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom'; // Added for consistency
import { useAnalysis } from '../context/AnalysisContext';

const Select = () => {
    const { analysisResult } = useAnalysis();

    useEffect(() => {
        if (!analysisResult) {
        } else {
            console.log('Analysis result in select page:', analysisResult);
        }
    }, [analysisResult]);

    return (
        <div>
            <div className="absolute top-10 left-8 text-left mt-5">
                <h1 className="text-base font-semibold leading-[24px] tracking-tight">A.I. ANALYSIS</h1>
                <p className="text-sm mt-1 text-muted-foreground uppercase leading-[24px]">
                    A.I. has estimated the following.<br />Fix estimated information if needed.
                </p>
            </div>
            <div className="h-[78.3vh] flex flex-col items-center justify-center bg-white">
                <div className="relative group">
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div
                            className="absolute w-[400px] h-[400px] border-dotted border-2 border-black opacity-0 group-hover:opacity-15 transition-opacity duration-300 rotate-45"
                            style={{
                                left: '50%',
                                top: '50%',
                                transform: 'translate(-50%, -50%) rotate(45deg)',
                            }}
                        ></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div
                            className="absolute w-[450px] h-[450px] border-dotted border-2 border-black opacity-0 group-hover:opacity-10 transition-opacity duration-300 rotate-45"
                            style={{
                                left: '50%',
                                top: '50%',
                                transform: 'translate(-50%, -50%) rotate(45deg)',
                            }}
                        ></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div
                            className="absolute w-[500px] h-[500px] border-dotted border-2 border-black opacity-0 group-hover:opacity-5 transition-opacity duration-300 rotate-45"
                            style={{
                                left: '50%',
                                top: '50%',
                                transform: 'translate(-50%, -50%) rotate(45deg)',
                            }}
                        ></div>
                    </div>
                    <div className="relative z-10 grid grid-cols-3 grid-rows-3 gap-0">
                        <div className="flex items-center justify-center col-start-2">
                            <Link to="/summary">
                                <button
                                    className="w-[153.88px] h-[153.88px] bg-gray-200 hover:bg-gray-300 transform rotate-45 flex items-center justify-center -m-5 cursor-pointer font-semibold leading-[24px] tracking-tight uppercase hover:scale-[1.05] transition-transform duration-300"
                                >
                                    <span className="transform -rotate-45">Demographics</span>
                                </button>
                            </Link>
                        </div>
                        <div className="flex items-center justify-center row-start-2 col-start-1">
                            <button
                                className="w-[153.88px] h-[153.88px] bg-gray-100 hover:bg-gray-300 transform rotate-45 flex items-center justify-center -m-5 font-semibold leading-[24px] tracking-tight uppercase cursor-not-allowed"
                            >
                                <span className="transform -rotate-45">Cosmetic Concerns</span>
                            </button>
                        </div>
                        <div className="flex items-center justify-center row-start-2 col-start-3">
                            <button
                                className="w-[153.88px] h-[153.88px] bg-gray-100 hover:bg-gray-300 transform rotate-45 flex items-center justify-center -m-5 font-semibold leading-[24px] tracking-tight uppercase cursor-not-allowed"
                            >
                                <span className="transform -rotate-45">Skin Type Details</span>
                            </button>
                        </div>
                        <div className="flex items-center justify-center row-start-3 col-start-2">
                            <button
                                className="w-[153.88px] h-[153.88px] bg-gray-100 hover:bg-gray-300 transform rotate-45 flex items-center justify-center -m-5 font-semibold leading-[24px] tracking-tight uppercase cursor-not-allowed"
                            >
                                <span className="transform -rotate-45">Weather</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="pt-4 md:pt-[37px] pb-6 bg-white sticky bottom-40 md:static md:bottom-0 mb-8 md:mb-16 md:flex-shrink-0">
                <div className="w-full max-w-screen mx-auto px-4 md:px-4">
                    <div className="flex justify-between">
                        <Link to="/result">
                            <div>
                                <div className="relative w-12 h-12 flex items-center justify-center border border-[#1A1B1C] rotate-45 scale-[1] sm:hidden">
                                    <span className="rotate-[-45deg] text-xs font-semibold sm:hidden">BACK</span>
                                </div>
                                <div className="group hidden sm:flex flex-row relative justify-center items-center">
                                    <div className="w-12 h-12 hidden sm:flex justify-center border border-[#1A1B1C] rotate-45 scale-[0.85] group-hover:scale-[0.92] ease duration-300"></div>
                                    <FaArrowLeft
                                        className="absolute left-[16px] bottom-[15px] scale-[0.9] hidden sm:block group-hover:scale-[0.92] ease duration-300"
                                    />
                                    <span className="text-sm font-semibold hidden sm:block ml-4">BACK</span>
                                </div>
                            </div>
                        </Link>
                        <Link to="/summary">
                            <div>
                                <div className="w-12 h-12 flex items-center justify-center border border-[#1A1B1C] rotate-45 scale-[1] sm:hidden">
                                    <span className="rotate-[-45deg] text-xs font-semibold sm:hidden">SUM</span>
                                </div>
                                <div className="group hidden sm:flex flex-row relative justify-center items-center">
                                    <span className="text-sm font-semibold hidden sm:block mr-4">GET SUMMARY</span>
                                    <div className="w-12 h-12 hidden sm:flex justify-center border border-[#1A1B1C] rotate-45 scale-[0.85] group-hover:scale-[0.92] ease duration-300"></div>
                                    <FaArrowRight
                                        className="absolute right-[16px] bottom-[15px] scale-[0.9] hidden sm:block group-hover:scale-[0.92] ease duration-300"
                                    />
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Select;