import React, { useState, useEffect, useRef } from 'react';
import { FaArrowLeft, FaArrowRight, FaCamera } from 'react-icons/fa';
import { MdRadioButtonUnchecked } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { useCamera } from '../context/CameraContext';

const CameraComponent = () => {
    const { isCameraViewActive, setIsCameraViewActive, navbarText, setNavbarText } = useCamera();
    const [stream, setStream] = useState(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [showCameraLoading, setShowCameraLoading] = useState(false);
    const [showCameraView, setShowCameraView] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState(null);
    const [analysisData, setAnalysisData] = useState(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        setIsCameraViewActive(true);
        // Initialize camera automatically on mount
        initializeCamera();
        return () => {
            setIsCameraViewActive(false);
            setNavbarText('');
            cleanupCamera();
        };
    }, [setIsCameraViewActive, setNavbarText]);

    // Assign stream to videoRef when showCameraView and stream are ready
    useEffect(() => {
        if (showCameraView && stream && videoRef.current) {
            console.log('Assigning stream to videoRef');
            videoRef.current.srcObject = stream;

            // Wait for metadata to load before playing
            const handleLoadedMetadata = () => {
                console.log('Video metadata loaded:', videoRef.current?.videoWidth, videoRef.current?.videoHeight);
                videoRef.current.play()
                    .then(() => console.log('Video playback started successfully'))
                    .catch(err => {
                        console.error('Video play failed:', err.name, err.message);
                        // Only show error if it's not an abort error
                        if (err.name !== 'AbortError') {
                            setError(`Failed to play video: ${err.message}`);
                        }
                    });
            };

            // Add event listener for metadata loaded
            videoRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);

            // Cleanup function to remove event listener
            return () => {
                if (videoRef.current) {
                    videoRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
                }
            };
        } else if (showCameraView && stream && !videoRef.current) {
            console.error('videoRef.current is null after showCameraView');
            setError('Video element not found. Please try again.');
        }
    }, [showCameraView, stream]);

    const cleanupCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        console.log('Camera cleaned up');
    };

    const initializeCamera = async () => {
        setShowCameraLoading(true);
        setError(null);
        try {
            // Check if mobile device
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

            const constraints = {
                video: {
                    facingMode: 'user',
                    width: { ideal: isMobile ? 1920 : 1280 },
                    height: { ideal: isMobile ? 1080 : 720 }
                },
                audio: false
            };

            const [mediaStream] = await Promise.all([
                navigator.mediaDevices.getUserMedia(constraints),
                new Promise(resolve => setTimeout(resolve, 500))
            ]);
            console.log('Media stream obtained:', mediaStream);
            console.log('Device type:', isMobile ? 'Mobile' : 'Desktop');
            setStream(mediaStream);
            setShowCameraLoading(false);
            setShowCameraView(true);
        } catch (err) {
            console.error('Camera access failed:', err.name, err.message);
            setShowCameraLoading(false);
            if (err.name === 'NotAllowedError') {
                setError('Camera access denied. Please allow camera access and try again.');
            } else if (err.name === 'NotFoundError') {
                setError('No camera found. Please connect a camera.');
            } else if (err.name === 'NotSupportedError') {
                setError('Camera not supported by this browser.');
            } else {
                setError(`Failed to access camera: ${err.message}`);
            }
        }
    };

    const handleCameraCapture = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            if (video.videoWidth === 0 || video.videoHeight === 0) {
                console.error('Invalid video dimensions:', video.videoWidth, video.videoHeight);
                setError('Camera feed not loaded. Please try again.');
                return;
            }

            // Use requestAnimationFrame to ensure video frame is ready
            requestAnimationFrame(() => {
                // Set canvas dimensions to match video
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;

                // Clear canvas first
                context.clearRect(0, 0, canvas.width, canvas.height);

                // Draw the video frame to canvas
                context.drawImage(video, 0, 0, canvas.width, canvas.height);

                // Convert to base64 with quality setting
                const base64Image = canvas.toDataURL('image/jpeg', 0.95);
                console.log('Captured base64 image length:', base64Image.length);
                console.log('Base64 image preview:', base64Image.substring(0, 100));
                console.log('Canvas dimensions:', canvas.width, 'x', canvas.height);

                // Validate the image
                if (!base64Image || base64Image === 'data:,' || base64Image.length < 100) {
                    console.error('Captured image is invalid');
                    setError('Failed to capture valid image. Please try again.');
                    return;
                }

                // Pause the video stream (don't stop it completely)
                if (stream) {
                    stream.getTracks().forEach(track => track.enabled = false);
                }

                setCapturedImage(base64Image);
                setShowCameraView(false);
                setShowPreview(true);
                setNavbarText('ANALYSIS');
            });
        } else {
            console.error('Video or canvas ref is null:', { videoRef: !!videoRef.current, canvasRef: !!canvasRef.current });
            setError('Failed to capture image. Please try again.');
        }
    };

    const uploadImage = async (base64String) => {
        setIsUploading(true);
        setError(null);
        try {
            // More thorough validation
            if (!base64String || typeof base64String !== 'string') {
                throw new Error('Invalid image data: not a string');
            }

            // Check if it's a valid data URL
            if (!base64String.startsWith('data:image/')) {
                throw new Error('Invalid image data: not a valid image data URL');
            }

            // Extract just the base64 part (remove data:image/jpeg;base64, prefix)
            const base64Data = base64String.split(',')[1];
            if (!base64Data || base64Data.length < 100) {
                throw new Error('Invalid image data: base64 content too small');
            }

            console.log('Uploading image...');
            console.log('Base64 data length:', base64Data.length);
            console.log('Full string length:', base64String.length);
            console.log('Image format:', base64String.substring(0, 30));

            const response = await fetch('https://us-central1-api-skinstric-ai.cloudfunctions.net/skinstricPhaseTwo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ image: base64String }),
            });

            const responseText = await response.text();
            console.log('Raw API response:', responseText);

            let result;
            try {
                result = JSON.parse(responseText);
            } catch (parseError) {
                console.error('Failed to parse response as JSON:', parseError);
                throw new Error(`Invalid response from server: ${responseText.substring(0, 100)}`);
            }

            console.log('Parsed API response:', result);
            console.log('Response status:', response.status);
            console.log('Response type:', typeof result);

            // Check for various API response formats
            if (response.status === 200 || response.status === 201) {
                // Success status codes
                console.log('API call successful');
            } else if (!response.ok) {
                console.error('API returned non-ok status:', response.status);
                throw new Error(`Upload failed with status ${response.status}: ${result.message || result.error || 'Unknown error'}`);
            }

            // Check if result indicates an error even with 200 status
            if (result.error || result.message === 'No analysis data available') {
                console.error('API returned error in response body:', result);
                throw new Error(result.error || result.message || 'Analysis failed');
            }

            // Ensure we have actual data
            if (!result || (typeof result === 'object' && Object.keys(result).length === 0)) {
                throw new Error('No analysis data received from server');
            }

            // Log the actual structure of the result
            console.log('=== API RESPONSE STRUCTURE ===');
            console.log('Full result:', JSON.stringify(result, null, 2));
            console.log('Result has data property:', !!result.data);
            console.log('Result has analysis property:', !!result.analysis);
            console.log('Result has results property:', !!result.results);

            // Mobile debug alert
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                alert(`API Response Debug:\nStatus: ${response.status}\nHas data: ${!!result}\nKeys: ${Object.keys(result || {}).join(', ')}\nFirst 100 chars: ${JSON.stringify(result).substring(0, 100)}`);
            }

            // The API might wrap the data in a property
            const analysisData = result.data || result.analysis || result.results || result;

            // Second debug alert to confirm data extraction
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                alert(`Extracted Data Debug:\nHas analysis data: ${!!analysisData}\nData keys: ${Object.keys(analysisData || {}).slice(0, 5).join(', ')}\nHas race data: ${!!analysisData?.race}`);
            }

            // Store in state and sessionStorage as backup
            setAnalysisData(analysisData);

            // Store in sessionStorage as a backup for navigation
            try {
                sessionStorage.setItem('analysisData', JSON.stringify(analysisData));
                sessionStorage.setItem('analysisTimestamp', Date.now().toString());
                console.log('Analysis data stored in sessionStorage');

                // Verify storage
                const verifyStored = sessionStorage.getItem('analysisData');
                console.log('Verified sessionStorage data exists:', !!verifyStored);
            } catch (storageError) {
                console.warn('Failed to store in sessionStorage:', storageError);
            }

            setNavbarText('ANALYSIS');

            // Log the exact data being passed
            console.log('=== NAVIGATION DEBUG ===');
            console.log('Result object:', analysisData);
            console.log('Result type:', typeof analysisData);
            console.log('Result keys:', Object.keys(analysisData || {}));
            console.log('Navigating to /select with data');

            // Navigate immediately without delay
            navigate('/select', {
                state: {
                    analysisData: analysisData,
                    timestamp: Date.now(),
                    debug: 'Camera navigation successful'
                }
            });

        } catch (err) {
            console.error('Upload error:', err);
            console.error('Error stack:', err.stack);
            setError(`Failed to upload image: ${err.message}`);
            setShowPreview(true); // Return to preview for retry
        } finally {
            setIsUploading(false);
        }
    };

    const handleProceed = () => {
        setShowPreview(false);
        setNavbarText('ANALYSIS');
        uploadImage(capturedImage);
    };

    const handleGoBack = () => {
        cleanupCamera();
        setShowCameraView(false);
        setShowPreview(false);
        setShowCameraLoading(false);
        setNavbarText('');
        navigate('/result');
    };

    const handleRetry = () => {
        setError(null);
        initializeCamera();
    };

    return (
        <>
            {(showCameraView || showCameraLoading || error) && !isUploading && !showPreview && (
                <div className="fixed inset-0 bg-black z-10 overflow-hidden">
                    {showCameraView && (
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover z-[15]"
                            style={{ display: 'block', transform: 'scaleX(-1)' }}
                            onError={(e) => console.error('Video element error:', e)}
                        />
                    )}

                    <div className="absolute bottom-10 left-10 z-30">
                        <button
                            onClick={handleGoBack}
                            aria-label="Back"
                            className="relative w-12 h-12 flex items-center justify-center border border-white rotate-45 hover:bg-white hover:bg-opacity-20 transition-all duration-200"
                        >
                            <FaArrowLeft className="rotate-[-45deg] scale-[1.2] text-white" />
                        </button>
                    </div>

                    {showCameraView && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex items-center">
                            <span className="text-white text-sm font-semibold mr-4">TAKE A PICTURE</span>
                            <button
                                onClick={handleCameraCapture}
                                className="w-16 h-16 bg-white rounded-full border-4 border-gray-200 hover:scale-110 flex items-center justify-center"
                            >
                                <FaCamera className="w-8 h-8 text-black" />
                            </button>
                        </div>
                    )}

                    <div className="absolute bottom-10 w-full z-20 px-4">
                        <div className="text-center space-y-5 max-w-4xl mx-auto">
                            <p className="text-xs md:text-sm text-white font-medium">
                                TO GET BETTER RESULTS MAKE SURE TO HAVE
                            </p>
                            <div className="flex flex-row items-center justify-center space-x-2 sm:space-x-4 md:space-x-12 text-xs md:text-sm text-white flex-nowrap">
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

                    <canvas ref={canvasRef} style={{ display: 'none' }} />
                </div>
            )}

            {showPreview && !isUploading && !error && (
                <div className="fixed inset-0 bg-black z-10 overflow-hidden">
                    <img
                        src={capturedImage}
                        alt="Captured Photo"
                        className="w-full h-full object-cover z-[15]"
                    />

                    <div className="absolute bottom-10 left-10 z-30 flex items-center">
                        <button
                            onClick={handleGoBack}
                            aria-label="Back"
                            className="relative w-12 h-12 flex items-center justify-center border border-white rotate-45 hover:bg-white hover:bg-opacity-20 transition-all duration-200"
                        >
                            <FaArrowLeft className="rotate-[-45deg] scale-[1.2] text-white" />
                        </button>
                        <span className="text-white text-sm font-semibold ml-4">BACK</span>
                    </div>

                    <div className="absolute bottom-10 w-full z-20 px-4">
                        <div className="text-center space-y-5 max-w-4xl mx-auto">
                            <p className="text-xs md:text-sm text-white font-medium">
                                TO GET BETTER RESULTS MAKE SURE TO HAVE
                            </p>
                            <div className="flex flex-row items-center justify-center space-x-2 sm:space-x-4 md:space-x-12 text-xs md:text-sm text-white flex-nowrap">
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

                    <div className="absolute bottom-10 right-10 z-20 flex items-center">
                        <span className="text-white text-sm font-semibold mr-4">PROCEED</span>
                        <button
                            onClick={handleProceed}
                            aria-label="Proceed"
                            className="relative w-12 h-12 flex items-center justify-center border border-white rotate-45 hover:bg-white hover:bg-opacity-20 transition-all duration-200"
                        >
                            <FaArrowRight className="rotate-[-45deg] scale-[1.2] text-white" />
                        </button>
                    </div>

                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                        <p className="text-white text-xl animate-fadeInOut">GREAT SHOT!</p>
                    </div>
                </div>
            )}

            {showCameraLoading && (
                <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center px-4">
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
                    <div className="absolute inset-0 flex items-center justify-center z-50">
                        <img
                            src="/camera.jpg"
                            alt="Camera Icon"
                            className="w-20 h-20 md:w-24 md:h-24 object-contain"
                        />
                    </div>

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

                    <div className="absolute bottom-0 w-full z-20 px-4">
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

            {isUploading && (
                <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
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

            {error && !showCameraLoading && !isUploading && !showPreview && (
                <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50 px-4">
                    <div className="text-center">
                        <h2 className="text-2xl font-semibold mb-4">Camera Error</h2>
                        <p className="text-red-600 mb-6 max-w-md mx-auto">{error}</p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <button
                                onClick={handleRetry}
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

export default CameraComponent;