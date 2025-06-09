import React, { useState, useEffect, useRef } from 'react';
import { FaPlay } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAnalysis } from '../context/AnalysisContext';

const Select = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { setAnalysisData: setContextAnalysisData } = useAnalysis();
    const [analysisData, setAnalysisData] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const dataLoadedRef = useRef(false);

    useEffect(() => {
        if (dataLoadedRef.current) {
            return;
        }

        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        let data = location.state?.analysisData;


        if (!data) {
            const storedData = sessionStorage.getItem('analysisData');

            if (storedData) {
                try {
                    data = JSON.parse(storedData);
                } catch (e) {
                    console.error('Failed to parse stored analysis data:', e);
                    if (process.env.NODE_ENV === 'development') {
                        console.error('Raw stored data:', storedData);
                    }
                }
            }
        }

        if (!data || (typeof data === 'object' && Object.keys(data).length === 0)) {
            setError('No analysis data available. Please take a photo first.');
            setIsLoading(false);
            setTimeout(() => {
                navigate('/camera');
            }, 3000);
        } else {
            dataLoadedRef.current = true;
            setAnalysisData(data);

            setContextAnalysisData({ data: data });

            setIsLoading(false);
            setError(null);
        }
    }, []);

    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading analysis data...</p>
                </div>
            </div>
        );
    }

    if (error && !analysisData) {
        return (
            <div className="fixed inset-0 bg-white flex items-center justify-center">
                <div className="text-center px-4">
                    <h2 className="text-xl font-semibold mb-4">Error</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <p className="text-sm text-gray-500">Redirecting to camera...</p>
                </div>
            </div>
        );
    }

    if (!analysisData) {
        return (
            <div className="fixed inset-0 bg-white flex items-center justify-center">
                <div className="text-center px-4">
                    <h2 className="text-xl font-semibold mb-4">Error</h2>
                    <p className="text-gray-600 mb-4">Failed to load analysis data</p>
                    <button
                        onClick={() => navigate('/camera')}
                        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Back to Camera
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-white">
            <div className="absolute top-10 left-8 text-left mt-5 z-10">
                <h1 className="text-base font-semibold leading-[24px] tracking-tight">A.I. ANALYSIS</h1>
                <p className="text-sm mt-1 text-muted-foreground uppercase leading-[24px]">
                    A.I. has estimated the following.<br />Fix estimated information if needed.
                </p>
            </div>

            <div className="flex flex-col items-center justify-center h-full">
                <div className="relative group max-h-[calc(100vh-200px)]">
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
                    <div className="relative z-10 grid grid-cols-3 grid-rows-3 gap-1 md:gap-0">
                        <div className="flex items-center justify-center col-start-2">
                            <Link to="/summary">
                                <button
                                    className="w-[140px] h-[140px] md:w-[155px] md:h-[155px] bg-gray-200 hover:bg-gray-300 transform rotate-45 flex items-center justify-center -m-5 cursor-pointer font-semibold leading-[24px] tracking-tight uppercase hover:scale-[1.05] transition-transform duration-300"
                                >
                                    <span className="transform -rotate-45">Demographics</span>
                                </button>
                            </Link>
                        </div>
                        <div className="flex items-center justify-center row-start-2 col-start-1">
                            <button
                                className="w-[140px] h-[140px] md:w-[155px] md:h-[155px] bg-gray-100 hover:bg-gray-300 transform rotate-45 flex items-center justify-center -m-5 font-semibold leading-[24px] tracking-tight uppercase cursor-not-allowed"
                            >
                                <span className="transform -rotate-45">Cosmetic Concerns</span>
                            </button>
                        </div>
                        <div className="flex items-center justify-center row-start-2 col-start-3">
                            <button
                                className="w-[140px] h-[140px] md:w-[155px] md:h-[155px] bg-gray-100 hover:bg-gray-300 transform rotate-45 flex items-center justify-center -m-5 font-semibold leading-[24px] tracking-tight uppercase cursor-not-allowed"
                            >
                                <span className="transform -rotate-45">Skin Type Details</span>
                            </button>
                        </div>
                        <div className="flex items-center justify-center row-start-3 col-start-2">
                            <button
                                className="w-[140px] h-[140px] md:w-[155px] md:h-[155px] bg-gray-100 hover:bg-gray-300 transform rotate-45 flex items-center justify-center -m-5 font-semibold leading-[24px] tracking-tight uppercase cursor-not-allowed"
                            >
                                <span className="transform -rotate-45">Weather</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 bg-white px-4 py-4 z-10">
                <div className="w-full max-w-screen mx-auto flex justify-between">
                    <Link to="/result">
                        <div>
                            <div className="relative w-12 h-12 flex items-center justify-center border border-[#1A1B1C] rotate-45 scale-[1] sm:hidden">
                                <span className="rotate-[-45deg] text-xs font-semibold sm:hidden">BACK</span>
                            </div>
                            <div className="group hidden sm:flex flex-row relative justify-center items-center">
                                <div className="w-12 h-12 hidden sm:flex justify-center border border-[#1A1B1C] rotate-45 scale-[0.85] group-hover:scale-[0.92] ease duration-300"></div>
                                <FaPlay
                                    className="absolute left-[16px] bottom-[15px] rotate-[180deg] scale-[0.9] hidden sm:block group-hover:scale-[0.92] ease duration-300"
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
                                <FaPlay
                                    className="absolute right-[16px] bottom-[15px] scale-[0.9] hidden sm:block group-hover:scale-[0.92] ease duration-300"
                                />
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Select;