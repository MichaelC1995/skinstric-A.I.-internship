import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from "react-icons/fa";
import { useAnalysis } from '../context/AnalysisContext';
import { Link } from 'react-router-dom';

const Result = () => {
    const [previewImage, setPreviewImage] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
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
            console.log('Analysis Result:', result);
            setAnalysisData(result);
            alert('Image successfully analyzed!');
            navigate('/select');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-white text-center overflow-hidden px-4 pt-20 pb-20">

            <div className="absolute top-2 left-4 sm:left-9 text-left z-10">
                <p className="font-semibold text-[10px] sm:text-xs">TO START ANALYSIS</p>
            </div>

            <div className="w-full h-full flex flex-col md:flex-row items-center justify-center space-y-[100px] md:space-y-0 gap-y-[10px] md:gap-x-[150px]">

                <div className="relative w-[270px] h-[270px] md:w-[290px] md:h-[290px] flex flex-col items-center justify-center">
                    {[70, 55, 40].map((size, i) => (
                        <div key={i} className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div
                                className={`absolute border-dotted border-2 border-black opacity-${5 + i * 5} transition-opacity duration-300 rotate-45`}
                                style={{
                                    width: `${size}vw`,
                                    height: `${size}vw`,
                                    maxWidth: `${260 - i * 30}px`,
                                    maxHeight: `${260 - i * 30}px`,
                                    left: '50%',
                                    top: '50%',
                                    transform: 'translate(-50%, -50%) rotate(45deg)'
                                }}
                            />
                        </div>
                    ))}
                    <div className="absolute top-0 right-0 p-4">
                        <p className="text-[12px] md:text-[14px] font-normal leading-[20px] min-w-[120px]">
                            ALLOW A.I.<br/>TO SCAN YOUR FACE
                        </p>
                    </div>
                    <div className="absolute top-[60px] right-[80px] w-[2px] h-[60px] bg-black rotate-[35deg] origin-top z-50" />
                    <div className="relative flex flex-col items-center justify-center z-20">
                        <img
                            alt="Camera Icon"
                            src="/camera.jpg"
                            className="w-[90px] h-[90px] md:w-[110px] md:h-[110px] hover:scale-108 duration-700 ease-in-out cursor-pointer"
                        />
                    </div>
                </div>

                <div className="relative w-[270px] h-[270px] md:w-[290px] md:h-[290px] flex flex-col items-center justify-center">
                    <div className="absolute bottom-0 left-0 md:bottom-4 md:left-4 z-20">
                        <p className="text-[12px] md:text-[14px] font-normal leading-[20px] min-w-[120px]">
                            ALLOW A.I.<br/>ACCESS GALLERY
                        </p>
                    </div>
                    {[70, 55, 40].map((size, i) => (
                        <div key={i} className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div
                                className={`absolute border-dotted border-2 border-black opacity-${5 + i * 5} transition-opacity duration-300 rotate-45`}
                                style={{
                                    width: `${size}vw`,
                                    height: `${size}vw`,
                                    maxWidth: `${260 - i * 30}px`,
                                    maxHeight: `${260 - i * 30}px`,
                                    left: '50%',
                                    top: '50%',
                                    transform: 'translate(-50%, -50%) rotate(45deg)'
                                }}
                            />
                        </div>
                    ))}
                    <div className="relative flex flex-col items-center justify-center z-10">
                        <div className="absolute md:top-[95px] md:right-[78px] top-[70px] right-[65px] w-[2px] h-[60px] bg-black rotate-[35deg] origin-top z-50" />
                        <img
                            alt="Photo Upload Icon"
                            src="/gallery.jpg"
                            className="w-[90px] h-[90px] md:w-[110px] md:h-[110px] hover:scale-108 duration-700 ease-in-out cursor-pointer"
                            onClick={() => document.getElementById('fileInput')?.click()}
                        />
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

            <div className="absolute bottom-8 w-full flex justify-between px-4 sm:px-9 z-10">
                <Link to="/testing">
                    <div className="group hidden sm:flex items-center relative">
                        <div className="w-12 h-12 border border-[#1A1B1C] rotate-45 group-hover:scale-[0.92] ease duration-300"></div>
                        <FaArrowLeft className="absolute left-[16px] bottom-[15px]" />
                        <span className="text-sm font-semibold ml-6">BACK</span>
                    </div>
                    <div className="sm:hidden relative w-12 h-12 flex items-center justify-center border border-[#1A1B1C] rotate-45">
                        <span className="rotate-[-45deg] text-xs font-semibold">BACK</span>
                    </div>
                </Link>
            </div>

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

            {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        </div>
    );
};

export default Result;