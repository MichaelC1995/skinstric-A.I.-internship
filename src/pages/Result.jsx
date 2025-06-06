import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft } from "react-icons/fa";
import { useAnalysis } from '../context/AnalysisContext';

const Result = () => {
    const [previewImage, setPreviewImage] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showCameraModal, setShowCameraModal] = useState(false);
    const navigate = useNavigate();
    const { setAnalysisData } = useAnalysis();

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setError('Please select an image file.');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                setPreviewImage(base64String);
                uploadImage(base64String);
            };
            reader.onerror = () => {
                setError('Failed to read the file.');
            };
            reader.readAsDataURL(file);
        } else {
            setError('No file selected. Please try again.');
        }
    };

    const uploadImage = async (base64String) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('https://us-central1-api-skinstric-ai.cloudfunctions.net/skinstricPhaseTwo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: base64String }),
            });

            if (!response.ok) {
                throw new Error('Failed to upload image.');
            }

            const result = await response.json();
            setAnalysisData(result);
            alert('Image successfully analyzed!');
            navigate('/select');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCameraClick = () => {
        setShowCameraModal(true);
    };

    const handleModalAllow = () => {
        setShowCameraModal(false);
        navigate('/camera');
    };

    const handleModalDeny = () => {
        setShowCameraModal(false);
    };

    return (
        <>
            <div className="fixed inset-0 bg-white text-center overflow-hidden z-0">
                <div className="absolute inset-0 flex flex-col md:flex-row items-center justify-center md:gap-x-[15vw] gap-y-[15vw]">
                    <div className="flex flex-col items-center">
                        <div className="block md:hidden mb-4">
                            <p className="text-[12px] text-center font-normal leading-[20px]">
                                ALLOW A.I.<br />TO SCAN YOUR FACE
                            </p>
                        </div>

                        <div className="relative w-[216px] h-[216px] md:w-[348px] md:h-[348px] flex flex-col items-center justify-center">
                            {[300, 270, 240].map((size, i) => (
                                <div key={i} className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div
                                        className={`absolute border-dotted border-2 border-black opacity-${5 + i * 5} transition-opacity duration-300 rotate-45 border-size-${i}`}
                                        style={{
                                            width: `${size}px`,
                                            height: `${size}px`,
                                            left: '50%',
                                            top: '50%',
                                            transform: 'translate(-50%, -50%) rotate(45deg)'
                                        }}
                                    />
                                </div>
                            ))}

                            <div className="relative flex flex-col items-center justify-center z-20">
                                <img
                                    alt="Camera Icon"
                                    src="/camera.jpg"
                                    className="w-[72px] h-[72px] md:w-[100px] md:h-[100px] lg:w-[132px] lg:h-[132px] hover:scale-108 duration-700 ease-in-out cursor-pointer"
                                    onClick={handleCameraClick}
                                />

                                <div className="hidden md:block absolute top-[-65px] right-[-150px]">
                                    <p className="text-[14px] text-left font-normal leading-[20px] min-w-[120px]">
                                        ALLOW A.I.<br />TO SCAN YOUR FACE
                                    </p>
                                    <div className="absolute top-[20px] right-[140px] w-[2px] h-[87px] bg-black rotate-[35deg] origin-top z-50" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={`flex flex-col items-center transition-opacity duration-300 ${showCameraModal ? 'opacity-30' : 'opacity-100'}`}>
                        <div className="relative w-[216px] h-[216px] md:w-[348px] md:h-[348px] flex flex-col items-center justify-center">
                            {[300, 270, 240].map((size, i) => (
                                <div key={i} className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div
                                        className={`absolute border-dotted border-2 border-black opacity-${5 + i * 5} transition-opacity duration-300 rotate-45 border-size-${i}`}
                                        style={{
                                            width: `${size}px`,
                                            height: `${size}px`,
                                            left: '50%',
                                            top: '50%',
                                            transform: 'translate(-50%, -50%) rotate(45deg)'
                                        }}
                                    />
                                </div>
                            ))}

                            <div className="relative flex flex-col items-center justify-center z-20">
                                <img
                                    alt="Photo Upload Icon"
                                    src="/gallery.jpg"
                                    className="w-[72px] h-[72px] md:w-[100px] md:h-[100px] lg:w-[132px] lg:h-[132px] hover:scale-108 duration-700 ease-in-out cursor-pointer"
                                    onClick={() => document.getElementById('fileInput')?.click()}
                                />

                                <div className="hidden md:block absolute bottom-[-65px] left-[-150px]">
                                    <p className="text-[14px] text-right font-normal leading-[20px] min-w-[120px]">
                                        ALLOW A.I.<br />ACCESS GALLERY
                                    </p>
                                    <div className="absolute bottom-[20px] left-[140px] w-[2px] h-[87px] bg-black rotate-[35deg] origin-bottom z-50" />
                                </div>
                            </div>
                        </div>

                        <div className="block md:hidden mt-4">
                            <p className="text-[12px] text-center font-normal leading-[20px]">
                                ALLOW A.I.<br />ACCESS GALLERY
                            </p>
                        </div>
                    </div>

                    <input
                        id="fileInput"
                        accept="image/*"
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </div>

                <div className="absolute top-2 left-4 sm:left-9 text-left z-10">
                    <p className="font-semibold text-[10px] sm:text-xs">TO START ANALYSIS</p>
                </div>

                <div className="absolute bottom-12 sm:bottom-8 w-full flex justify-between px-4 sm:px-9 opacity-100">
                    <Link to="/testing">
                        <div>
                            <div
                                className="relative w-12 h-12 flex items-center justify-center border border-[#1A1B1C] rotate-45 scale-[1] sm:hidden"
                            >
                                <span className="rotate-[-45deg] text-xs font-semibold sm:hidden">BACK</span>
                            </div>
                            <div className="group hidden sm:flex flex-row relative justify-center items-center">
                                <div
                                    className="w-12 h-12 hidden sm:flex justify-center border border-[#1A1B1C] rotate-45 scale-[0.85] group-hover:scale-[0.92] ease duration-300"
                                ></div>
                                <FaArrowLeft
                                    className="absolute left-[16px] bottom-[15px] scale-[0.9] hidden sm:block group-hover:scale-[0.92] ease duration-300"
                                />
                                <span className="text-sm font-semibold hidden sm:block ml-6">BACK</span>
                            </div>
                        </div>
                    </Link>
                </div>

                {showCameraModal && (
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="bg-black rounded-lg w-[90%] max-w-[300px] h-32 flex flex-col">
                            <div className="flex-1 flex items-start justify-start p-4">
                                <p className="text-base font-semibold text-white">
                                    Allow A.I. to access your camera?
                                </p>
                            </div>
                            <div className="border-t border-white"></div>
                            <div className="h-1/6 flex justify-end items-center gap-4 p-2">
                                <button
                                    className="bg-black text-gray-500 rounded-md text-sm font-bold px-4 hover:scale-105 duration-300 transition-transform"
                                    onClick={handleModalDeny}
                                >
                                    DENY
                                </button>
                                <button
                                    className="bg-black text-gray-400 rounded-md text-sm font-bold px-4 hover:scale-105 duration-300 transition-transform"
                                    onClick={handleModalAllow}
                                >
                                    ALLOW
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {isLoading && (
                    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50 animate-fade-in" role="alert">
                        {[70, 55, 40].map((size, i) => (
                            <div key={i} className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div
                                    className={`absolute border-dotted border-2 border-black opacity-${5 + i * 5} rotate-45 animate-spin-${['slowest', 'slower', 'slow'][i]}`}
                                    style={{
                                        width: `${size}vw`,
                                        height: `${size}vw`,
                                        maxWidth: `${300 - i * 30}px`,
                                        maxHeight: `${300 - i * 30}px`,
                                        left: '50%',
                                        top: '50%',
                                        transform: 'translate(-50%, -50%) rotate(45deg)'
                                    }}
                                />
                            </div>
                        ))}
                        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                            <p className="text-[16px] md:text-[18px] font-semibold text-center">Preparing your analysis</p>
                            <div className="flex space-x-1 justify-center items-center mt-2">
                                <span className="text-3xl font-bold animate-dot-bounce-1">.</span>
                                <span className="text-3xl font-bold animate-dot-bounce-2">.</span>
                                <span className="text-3xl font-bold animate-dot-bounce-3">.</span>
                            </div>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="absolute bottom-16 w-full text-center z-10">
                        <p className="text-red-500 text-[12px] md:text-[14px]">{error}</p>
                    </div>
                )}
            </div>
        </>
    );
};

export default Result;