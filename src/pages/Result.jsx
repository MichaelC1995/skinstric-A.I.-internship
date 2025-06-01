import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

const Result = () => {
    const [previewImage, setPreviewImage] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate();

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
        setIsSuccess(false);

        try {
            const response = await fetch('https://us-central1-api-skinstric-ai.cloudfunctions.net/skinstricPhaseTwo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    image: base64String,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to upload image.');
            }

            const result = await response.json();
            console.log('API Response:', result);
            setIsSuccess(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isSuccess) {
            alert('Image successfully analyzed!');
            setIsSuccess(false);
            navigate('/select');
        }
    }, [isSuccess, navigate]);

    return (
        <div
            className="h-screen w-full flex flex-col items-center justify-center bg-white text-center overflow-hidden px-4 pt-20 pb-20">
            {/* Navbar */}
            <div className="absolute top-2 left-4 sm:left-9 text-left z-10">
                <p className="font-semibold text-[10px] sm:text-xs">TO START ANALYSIS</p>
            </div>
            {/* Main Content */}
            <div
                className="w-full h-full flex flex-col md:flex-row items-center justify-center space-y-[100px] md:space-y-0 gap-y-[10px] md:gap-x-[150px]">
                {/* Camera Section */}
                <div
                    className="relative w-[270px] h-[270px] md:w-[290px] md:h-[290px] flex flex-col items-center justify-center">
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div
                            className="absolute w-[70vw] h-[70vw] max-w-[260px] max-h-[260px] border-dotted border-2 border-black opacity-5 transition-opacity duration-300 rotate-45"
                            style={{left: '50%', top: '50%', transform: 'translate(-50%, -50%) rotate(45deg)'}}
                        ></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div
                            className="absolute w-[55vw] h-[55vw] max-w-[230px] max-h-[230px] border-dotted border-2 border-black opacity-10 transition-opacity duration-300 rotate-45"
                            style={{left: '50%', top: '50%', transform: 'translate(-50%, -50%) rotate(45deg)'}}
                        ></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div
                            className="absolute w-[40vw] h-[40vw] max-w-[200px] max-h-[200px] border-dotted border-2 border-black opacity-15 transition-opacity duration-300 rotate-45"
                            style={{left: '50%', top: '50%', transform: 'translate(-50%, -50%) rotate(45deg)'}}
                        ></div>
                    </div>
                    <div className="absolute top-0 right-0 p-4">
                        <p className="text-[12px] text-right md:text-[14px] font-normal leading-[20px] min-w-[120px]">
                            ALLOW A.I.<br/>TO SCAN YOUR FACE
                        </p>
                    </div>
                    <div className="absolute top-[60px] right-[75px] w-[2px] h-[60px] bg-black rotate-[35deg] origin-top z-50" />
                    <div className="relative flex flex-col items-center justify-center z-20">
                        <img
                            alt="Camera Icon"
                            loading="lazy"
                            width="136"
                            height="136"
                            decoding="async"
                            data-nimg="1"
                            className="w-[90px] h-[90px] md:w-[110px] md:h-[110px] hover:scale-108 duration-700 ease-in-out cursor-pointer"
                            src="/camera.jpg"
                            style={{color: 'transparent'}}
                        />
                    </div>
                </div>
                {/* Gallery Section */}
                <div
                    className="relative w-[270px] h-[270px] md:w-[290px] md:h-[290px] flex flex-col items-center justify-center">
                    <div className="absolute bottom-2 left-2 md:bottom-4 md:left-4 z-20">
                        <p className="text-[12px] text-left md:text-[14px] font-normal leading-[20px] min-w-[120px]">
                            ALLOW A.I.<br/>ACCESS GALLERY
                        </p>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div
                            className="absolute w-[70vw] h-[70vw] max-w-[260px] max-h-[260px] border-dotted border-2 border-black opacity-5 transition-opacity duration-300 rotate-45"
                            style={{left: '50%', top: '50%', transform: 'translate(-50%, -50%) rotate(45deg)'}}
                        ></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div
                            className="absolute w-[55vw] h-[55vw] max-w-[230px] max-h-[230px] border-dotted border-2 border-black opacity-10 transition-opacity duration-300 rotate-45"
                            style={{left: '50%', top: '50%', transform: 'translate(-50%, -50%) rotate(45deg)'}}
                        ></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div
                            className="absolute w-[40vw] h-[40vw] max-w-[200px] max-h-[200px] border-dotted border-2 border-black opacity-15 transition-opacity duration-300 rotate-45"
                            style={{left: '50%', top: '50%', transform: 'translate(-50%, -50%) rotate(45deg)'}}
                        ></div>
                    </div>
                    <div className="relative flex flex-col items-center justify-center z-10">
                        <div className="absolute top-[90px] right-[90px] w-[2px] h-[60px] bg-black rotate-[35deg] origin-top z-50" />
                        <img
                            alt="Photo Upload Icon"
                            loading="lazy"
                            width="136"
                            height="136"
                            decoding="async"
                            data-nimg="1"
                            className="w-[90px] h-[90px] md:w-[110px] md:h-[110px] hover:scale-108 duration-700 ease-in-out cursor-pointer"
                            src="/gallery.jpg"
                            style={{color: 'transparent'}}
                            onClick={() => {
                                console.log('Gallery image clicked');
                                const fileInput = document.getElementById('fileInput');
                                if (fileInput) {
                                    fileInput.click();
                                } else {
                                    console.error('File input not found');
                                }
                            }}
                        />
                    </div>
                </div>
                <input
                    id="fileInput"
                    accept="image/*"
                    className="hidden"
                    type="file"
                    onChange={handleFileChange}
                />
            </div>
            {/* Navigation */}
            <div className="absolute bottom-8 w-full flex justify-between px-4 sm:px-9 z-10">
                <a className="relative" aria-label="Back" href="/testing">
                    <div>
                        <div
                            className="relative w-12 h-12 flex items-center justify-center border border-[#1A1B1C] rotate-45 scale-[1] sm:hidden">
                            <span className="rotate-[-45deg] text-xs font-semibold sm:hidden">BACK</span>
                        </div>
                        <div className="group hidden sm:flex flex-row relative justify-center items-center">
                            <div
                                className="w-12 h-12 hidden sm:flex justify-center border border-[#1A1B1C] rotate-45 scale-[0.85] group-hover:scale-[0.92] ease duration-300"></div>
                            <span
                                className="absolute left-[15px] bottom-[13px] scale-[0.9] rotate-180 hidden sm:block group-hover:scale-[0.92] ease duration-300">▶</span>
                            <span className="text-sm font-semibold hidden sm:block ml-6">BACK</span>
                        </div>
                    </div>
                </a>
                <a href="/select">
                    <div className="hidden">
                        <div>
                            <div
                                className="w-12 h-12 flex items-center justify-center border border-[#1A1B1C] rotate-45 scale-[1] sm:hidden">
                                <span className="rotate-[-45deg] text-xs font-semibold sm:hidden">PROCEED</span>
                            </div>
                            <div className="group hidden sm:flex flex-row relative justify-center items-center">
                                <span className="text-sm font-semibold hidden sm:block mr-5">PROCEED</span>
                                <div
                                    className="w-12 h-12 hidden sm:flex justify-center border border-[#1A1B1C] rotate-45 scale-[0.85] group-hover:scale-[0.92] ease duration-300"></div>
                                <span
                                    className="absolute right-[15px] bottom-[13px] scale-[0.9] hidden sm:block group-hover:scale-[0.92] ease duration-300">▶</span>
                            </div>
                        </div>
                    </div>
                </a>
            </div>
            {/* Loading Overlay */}
            {isLoading && (
                <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50 animate-fade-in"
                     aria-live="polite" role="alert">
                    <div className="relative w-[270px] h-[270px] md:w-[290px] md:h-[290px]">
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div
                                className="absolute w-[70vw] h-[70vw] max-w-[300px] max-h-[300px] border-dotted border-2 border-black opacity-5 transition-opacity duration-300 rotate-45"
                                style={{left: '50%', top: '50%', transform: 'translate(-50%, -50%) rotate(45deg)'}}
                            ></div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div
                                className="absolute w-[55vw] h-[55vw] max-w-[270px] max-h-[270px] border-dotted border-2 border-black opacity-10 transition-opacity duration-300 rotate-45"
                                style={{left: '50%', top: '50%', transform: 'translate(-50%, -50%) rotate(45deg)'}}
                            ></div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div
                                className="absolute w-[40vw] h-[40vw] max-w-[240px] max-h-[240px] border-dotted border-2 border-black opacity-15 transition-opacity duration-300 rotate-45"
                                style={{left: '50%', top: '50%', transform: 'translate(-50%, -50%) rotate(45deg)'}}
                            ></div>
                        </div>
                        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                            <p className="text-[16px] md:text-[18px] font-semibold text-center">Preparing your
                                analysis</p>
                            <div className="flex space-x-1 justify-center items-center mt-2">
                                <span className="text-3xl font-bold animate-dot-bounce-1">.</span>
                                <span className="text-3xl font-bold animate-dot-bounce-2">.</span>
                                <span className="text-3xl font-bold animate-dot-bounce-3">.</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Error Message */}
            {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        </div>
    );
};

export default Result;