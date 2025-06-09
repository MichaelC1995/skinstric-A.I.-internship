import React, { useState, useEffect } from 'react';
import { FaPlay } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Select = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [analysisData, setAnalysisData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log('=== SELECT COMPONENT DEBUG ===');
        console.log('Location state:', location.state);
        console.log('Location state type:', typeof location.state);
        console.log('Has analysisData in state:', !!location.state?.analysisData);

        // Mobile debug alert
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        if (isMobile) {
            alert(`Select Component Debug:\nHas location state: ${!!location.state}\nHas analysisData: ${!!location.state?.analysisData}\nSessionStorage check: ${!!sessionStorage.getItem('analysisData')}`);
        }

        // First try to get data from navigation state
        let data = location.state?.analysisData;

        // If not found, try sessionStorage as backup
        if (!data) {
            console.log('No data in location state, checking sessionStorage...');
            const storedData = sessionStorage.getItem('analysisData');
            const storedTimestamp = sessionStorage.getItem('analysisTimestamp');

            console.log('SessionStorage has data:', !!storedData);
            console.log('Data timestamp:', storedTimestamp);

            if (storedData) {
                try {
                    data = JSON.parse(storedData);
                    console.log('Retrieved analysis data from sessionStorage');
                    console.log('Parsed data:', data);
                    console.log('Data type:', typeof data);
                    console.log('Data keys:', Object.keys(data || {}));

                    if (isMobile) {
                        alert(`SessionStorage Data Found:\nKeys: ${Object.keys(data || {}).slice(0, 5).join(', ')}\nHas race: ${!!data?.race}`);
                    }
                } catch (e) {
                    console.error('Failed to parse stored analysis data:', e);
                    console.error('Raw stored data:', storedData);
                }
            }
        } else {
            console.log('Found data in location state');
            console.log('Data:', data);
            console.log('Data type:', typeof data);
            console.log('Data keys:', Object.keys(data || {}));
        }

        if (!data || (typeof data === 'object' && Object.keys(data).length === 0)) {
            console.error('No analysis data available or data is empty');
            if (isMobile) {
                alert(`Data validation failed:\ndata exists: ${!!data}\ntype: ${typeof data}\nkeys length: ${data ? Object.keys(data).length : 0}`);
            }
            setError('No analysis data available. Please take a photo first.');
            // Optionally redirect back to camera after a delay
            setTimeout(() => {
                navigate('/camera');
            }, 3000);
        } else {
            console.log('Analysis data successfully loaded:', data);
            if (isMobile) {
                alert(`Data validation passed!\nSetting analysis data with keys: ${Object.keys(data).slice(0, 5).join(', ')}`);
            }
            setAnalysisData(data);
            // Don't clear sessionStorage immediately - keep it as backup
        }
    }, [location.state, navigate]);

    // If there's an error, show error message
    if (error) {
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

    // If no analysis data yet, show loading
    if (!analysisData) {
        return (
            <div className="fixed inset-0 bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading analysis data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-white overflow-hidden">
            <div className="absolute top-10 left-8 text-left mt-5 z-10">
                <h1 className="text-base font-semibold leading-[24px] tracking-tight">A.I. ANALYSIS</h1>
                <p className="text-sm mt-1 text-muted-foreground uppercase leading-[24px]">
                    A.I. has estimated the following.<br />Fix estimated information if needed.
                </p>
                {/* Debug info - remove in production */}
                {process.env.NODE_ENV === 'development' && (
                    <div className="mt-2 text-xs text-gray-500">
                        <p>Data received: {analysisData ? 'Yes' : 'No'}</p>
                        {analysisData && <p>Keys: {Object.keys(analysisData).join(', ')}</p>}
                    </div>
                )}
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
                    <div className="relative z-10 grid grid-cols-3 grid-rows-3 gap-0">
                        <div className="flex items-center justify-center col-start-2">
                            <Link to="/summary" state={{ analysisData }}>
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
                    <Link to="/summary" state={{ analysisData }}>
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