import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { useAnalysis } from '../context/AnalysisContext';
import {ActionButton, DottedBorder} from "../components/ActionButton.jsx";

const API_URL = process.env.REACT_APP_API_URL || 'https://us-central1-api-skinstric-ai.cloudfunctions.net/skinstricPhaseTwo';

const Result = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showCameraModal, setShowCameraModal] = useState(false);
    const navigate = useNavigate();
    const { setAnalysisData } = useAnalysis();

    const handleFileChange = (event) => {
        setError(null);
        const file = event.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setError('Please select an image file.');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
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
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: base64String }),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error('Failed to upload image.');
            }

            const result = await response.json();
            alert('Image successfully analyzed!');
            if (!result || typeof result !== 'object') {
                throw new Error('Invalid response from server.');
            }

            setAnalysisData(result);
            navigate('/select');
        } catch (err) {
            setError(err.name === 'AbortError' ? 'Request timed out. Please try again.' : err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCameraClick = () => {
        setError(null);
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
        <div className="fixed inset-0 bg-white text-center overflow-hidden z-0">
            <div className="absolute inset-0 flex flex-col md:flex-row items-center justify-center md:gap-x-[15vw] gap-y-[15vw]">
                <div className="flex flex-col items-center">
                    <div className="block md:hidden mb-4">
                        <p className="text-[12px] text-center font-normal leading-[20px]">
                            ALLOW A.I.<br />TO SCAN YOUR FACE
                        </p>
                    </div>
                    <ActionButton
                        iconSrc="/camera.jpg"
                        altText="Open camera for skin analysis"
                        text="ALLOW A.I.<br />TO SCAN YOUR FACE"
                        onClick={handleCameraClick}
                        textPosition="top-[-65px] right-[-150px]"
                    />
                </div>
                <div className={`flex flex-col items-center transition-opacity duration-300 ${showCameraModal ? 'opacity-30' : 'opacity-100'}`}>
                    <ActionButton
                        iconSrc="/gallery.jpg"
                        altText="Upload image from gallery for skin analysis"
                        text="ALLOW A.I.<br />ACCESS GALLERY"
                        onClick={() => document.getElementById('fileInput')?.click()}
                        textPosition="bottom-[-65px] left-[-150px]"
                    />
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

            <div className="absolute top-16 left-4 sm:left-9 text-left z-10">
                <p className="font-bold text-[10px] sm:text-xs">TO START ANALYSIS</p>
            </div>

            <div className="absolute bottom-12 sm:bottom-8 w-full flex justify-between px-4 sm:px-9 opacity-100">
                <Link to="/testing" className="group flex flex-row items-center justify-center">
                    <div className="relative w-12 h-12 flex items-center justify-center border border-[#1A1B1C] rotate-45 group-hover:scale-[0.92] transition-transform duration-300">
                        <FaArrowLeft className="absolute rotate-[-45deg] scale-[0.9] group-hover:scale-[0.92] transition-transform duration-300" />
                    </div>
                    <span className="ml-4 text-sm font-semibold hidden sm:block">BACK</span>
                </Link>
            </div>

            {showCameraModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50" role="dialog" aria-modal="true" aria-labelledby="modal-title">
                    <div className="bg-black rounded-lg w-[90%] max-w-[300px] h-32 flex flex-col">
                        <div className="flex-1 flex items-start justify-start p-4">
                            <p id="modal-title" className="text-base font-semibold text-white">
                                Allow A.I. to access your camera?
                            </p>
                        </div>
                        <div className="border-t border-white"></div>
                        <div className="h-1/6 flex justify-end items-center gap-4 p-2">
                            <button
                                className="bg-black text-gray-500 rounded-md text-sm font-bold px-4 hover:scale-105 duration-300 transition-transform"
                                onClick={handleModalDeny}
                                aria-label="Deny camera access"
                            >
                                DENY
                            </button>
                            <button
                                className="bg-black text-gray-400 rounded-md text-sm font-bold px-4 hover:scale-105 duration-300 transition-transform"
                                onClick={handleModalAllow}
                                aria-label="Allow camera access"
                            >
                                ALLOW
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isLoading && (
                <div className="fixed inset-0 bg-white flex items-center justify-center z-50 animate-fade-in" role="status" aria-live="polite">
                    <DottedBorder sizes={[300, 270, 240]} animation={['slowest', 'slower', 'slow']} />
                    <div className="relative flex flex-col items-center justify-center z-20">
                        <p className="text-[16px] md:text-[18px] font-semibold text-center">Preparing your analysis</p>
                        <div className="flex space-x-1 justify-center items-center mt-2">
                            <span className="text-3xl font-bold animate-pulse">.</span>
                            <span className="text-3xl font-bold animate-pulse delay-100">.</span>
                            <span className="text-3xl font-bold animate-pulse delay-200">.</span>
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
    );
};

export default Result;