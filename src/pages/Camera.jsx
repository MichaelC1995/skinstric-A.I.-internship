import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAnalysis } from '../context/AnalysisContext';
import { MdRadioButtonUnchecked } from "react-icons/md";
import { FaArrowLeft, FaCamera } from "react-icons/fa";
import {useCamera} from "../context/CameraContext";

const Camera = () => {
    const [showCameraLoading, setShowCameraLoading] = useState(true);
    const [showCameraView, setShowCameraView] = useState(false);
    const [error, setError] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [stream, setStream] = useState(null);
    const navigate = useNavigate();
    const { setAnalysisData } = useAnalysis();
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const loadingTimeoutRef = useRef(null);
    const { isCameraViewActive, setIsCameraViewActive } = useCamera();

    useEffect(() => {
        setIsCameraViewActive(true);

        return () => {
            setIsCameraViewActive(false);
        };
    }, [setIsCameraViewActive]);

    useEffect(() => {
        console.log('Component mounted, showCameraLoading:', showCameraLoading);
        initializeCamera();

        return () => {
            console.log('Component unmounting, cleaning up...');
            cleanupCamera();
        };
    }, []);

    const cleanupCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        if (loadingTimeoutRef.current) {
            clearTimeout(loadingTimeoutRef.current);
            loadingTimeoutRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
    };

    const initializeCamera = async () => {
        console.log('Initializing camera...');
        setShowCameraLoading(true);
        setError(null);

        try {
            // Request camera access
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: 'user'
                },
                audio: false
            });

            console.log('Camera access granted, setting up stream...');
            setStream(mediaStream);

            // Wait for minimum loading time (2 seconds)
            loadingTimeoutRef.current = setTimeout(() => {
                console.log('Camera ready, showing camera view...');
                setShowCameraLoading(false);
                setShowCameraView(true);

                // Set up video element
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                    videoRef.current.play().catch(err => console.warn('Video play failed:', err));
                }
            }, 2000);

        } catch (err) {
            console.error('Camera access failed:', err);
            setShowCameraLoading(false);

            if (err.name === 'NotAllowedError') {
                setError('Camera access denied. Please allow camera access and try again.');
            } else if (err.name === 'NotFoundError') {
                setError('No camera found. Please connect a camera.');
            } else if (err.name === 'NotSupportedError') {
                setError('Camera not supported by this browser.');
            } else {
                setError('Failed to access camera. Please try again.');
            }
        }
    };

    const handleCameraCapture = () => {
        console.log('Capturing photo...');
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            const base64Image = canvas.toDataURL('image/jpeg', 0.8);

            cleanupCamera();
            setShowCameraView(false);
            uploadImage(base64Image);
        }
    };


    const uploadImage = async (base64String) => {
        console.log('Uploading image...');
        setIsUploading(true);
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
            setIsUploading(false);
        }
    };

    const closeCameraView = () => {
        console.log('Closing camera view...');
        cleanupCamera();
        setShowCameraView(false);
        navigate('/result');
    };

    const handleGoBack = () => {
        console.log('Going back...');
        cleanupCamera();
        navigate('/result');
    };

    return (
        <>
            {/* Camera View */}
            {showCameraView && !isUploading && !error && (
                <div className="fixed inset-0 bg-black z-10 overflow-hidden">
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover z-15"
                    />

                    {/* Close Button in Bottom-Left */}
                    <div className="absolute bottom-4 left-4 z-20">
                        <button onClick={closeCameraView} aria-label="Close">
                            <div className="group">
                                <div className="relative w-12 h-12 flex items-center justify-center border border-white rotate-45">
                                    <FaArrowLeft className="rotate-[-45deg] scale-[1.2] text-white" />
                                </div>
                            </div>
                        </button>
                    </div>

                    {/* Capture Button and Text on Right, Vertically Centered */}
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex items-center">
                        <span className="text-white text-sm font-semibold mr-4">TAKE PICTURE</span>
                        <button
                            onClick={handleCameraCapture}
                            className="w-16 h-16 bg-white rounded-full border-4 border-gray-200 hover:scale-110 flex items-center justify-center"
                        >
                            <FaCamera className="w-8 h-8 text-black" />
                        </button>
                    </div>

                    <canvas ref={canvasRef} style={{ display: 'none' }} />
                </div>
            )}

            {/* Camera Loading Screen */}
            {showCameraLoading && (
                <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center px-4">
                    {/* Rotating Dotted Borders */}
                    <div className="absolute inset-0 z-40">
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
                    </div>
                    {/* Camera Icon and Heading */}
                    <div className="absolute inset-0 flex items-center justify-center z-50">
                        <img
                            src="/camera.jpg"
                            alt="Camera Icon"
                            className="w-20 h-20 md:w-24 md:h-24 object-contain"
                        />
                    </div>
                    {/* Setting Up Camera Text - Below Center */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 translate-y-12 z-50">
                        <h2 className="text-sm font-semibold text-black tracking-wide text-center">
                            <div className="flex justify-center items-center">
                                SETTING UP CAMERA
                                <span className="animate-dot-bounce-1">   .</span>
                                <span className="animate-dot-bounce-2">.</span>
                                <span className="animate-dot-bounce-3">.</span>
                            </div>
                        </h2>
                    </div>
                    {/* Text Block at Bottom Quarter */}
                    <div className="absolute bottom-1/4 w-full z-50 px-4">
                        <div className="text-center space-y-4 max-w-4xl mx-auto">
                            <p className="text-xs md:text-sm text-gray-600 font-medium">
                                TO GET BETTER RESULTS MAKE SURE TO HAVE
                            </p>
                            <div className="flex flex-row items-center justify-center space-x-2 sm:space-x-4 md:space-x-8 text-xs md:text-sm text-black flex-nowrap">
                                <div className="flex items-center space-x-1 flex-shrink-0">
                                    <MdRadioButtonUnchecked className="flex-shrink-0" />
                                    <span className="font-medium whitespace-nowrap">NEUTRAL EXPRESSION</span>
                                </div>
                                <div className="flex items-center space-x-1 flex-shrink-0">
                                    <MdRadioButtonUnchecked className="flex-shrink-0" />
                                    <span className="font-medium whitespace-nowrap">FRONTAL POSE</span>
                                </div>
                                <div className="flex items-center space-x-1 flex-shrink-0">
                                    <MdRadioButtonUnchecked className="flex-shrink-0" />
                                    <span className="font-medium whitespace-nowrap">ADEQUATE LIGHTING</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Upload Loading Screen */}
            {isUploading && (
                <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
                    {[70, 55, 40].map((size, i) => (
                        <div key={i} className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div
                                className={`absolute border-dotted border-2 border-black opacity-${5 + i * 5} rotate-45 animate-spin-${['slowest', 'slower', 'slow'][i]}`}
                                style={{
                                    width: `${300 - i * 30}px`,
                                    height: `${300 - i * 30}px`,
                                    left: '50%',
                                    top: '50%',
                                    transform: 'translate(-50%, -50%)'
                                }}
                            />
                        </div>
                    ))}
                    <div className="absolute inset-20 flex flex-col items-center justify-center z-20">
                        <p className="text-[16px] font-semibold text-center">Preparing your analysis</p>
                        <div className="flex justify-center items-center mt-2">
                            <span className="text-3xl font-bold animate-dot-bounce-1">.</span>
                            <span className="text-3xl font-bold animate-dot-bounce-2">.</span>
                            <span className="text-3xl font-bold animate-dot-bounce-3">.</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Error Screen */}
            {error && !showCameraLoading && !isUploading && (
                <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50 px-4">
                    <div className="text-center">
                        <h2 className="text-2xl font-semibold mb-4">Camera Error</h2>
                        <p className="text-red-600 mb-6 max-w-md mx-auto">{error}</p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <button
                                onClick={() => {
                                    setError(null);
                                    initializeCamera();
                                }}
                                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Try Again
                            </button>
                            <button
                                onClick={handleGoBack}
                                className="bg-gray-600 text-white px-6 py-2 rounded-md hover:scale-105 transition-transform"
                            >
                                Go Back
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Camera;