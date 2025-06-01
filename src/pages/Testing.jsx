import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';

const Testing = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({ name: '', location: '' });
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [cityPrompt, setCityPrompt] = useState('Click to type');
    const [cityPlaceholder, setCityPlaceholder] = useState('Where are you from?');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isApiSuccess, setIsApiSuccess] = useState(false);
    const [nameError, setNameError] = useState('');
    const [locationError, setLocationError] = useState('');

    const cityInputRef = useRef(null);

    useEffect(() => {
        console.log('Current step after state update:', step);
        console.log(`Rendering Step ${step}: ${step === 1 ? 'Name form' : step === 2 ? 'City form' : step === 3 ? 'Confirmation' : 'Fallback'}`);
        if (step === 2 && !isTransitioning && !isSubmitting && cityInputRef.current) {
            cityInputRef.current.focus();
        }
    }, [step, isTransitioning, isSubmitting]);

    const handleTransition = useCallback((nextStep) => {
        setIsTransitioning(true);
        setTimeout(() => {
            setStep(nextStep);
            setIsTransitioning(false);
        }, 300);
    }, []);

    const validateString = (input, fieldName) => {
        if (!input || input.trim() === '') {
            return `${fieldName} cannot be empty.`;
        }
        const validStringRegex = /^[a-zA-Z\s'-]+$/;
        if (!validStringRegex.test(input)) {
            return `${fieldName} can only contain letters, spaces, hyphens, or apostrophes.`;
        }
        return '';
    };

    const handleNameSubmit = useCallback(
        (event) => {
            event.preventDefault();
            const formData = new FormData(event.target);
            const submittedName = formData.get('name');
            console.log('Name form submitted, name:', submittedName);

            const nameValidationError = validateString(submittedName, 'Name');
            if (nameValidationError) {
                setNameError(nameValidationError);
                alert(nameValidationError);
                return;
            }

            setNameError('');
            setFormData((prev) => ({ ...prev, name: submittedName }));
            handleTransition(2);
        },
        [handleTransition]
    );

    const handleLocationSubmit = useCallback(
        async (event) => {
            event.preventDefault();
            const formDataFromEvent = new FormData(event.target);
            const location = formDataFromEvent.get('location');
            console.log('City form submitted, location:', location);

            const locationValidationError = validateString(location, 'City');
            if (locationValidationError) {
                setLocationError(locationValidationError);
                alert(locationValidationError);
                return;
            }

            setLocationError('');
            setIsSubmitting(true);
            setCityPrompt('Where are you from?');
            setCityPlaceholder('City Name');
            setFormData((prev) => ({ ...prev, location: '' }));

            const payload = { name: formData.name, location: location };
            console.log('Sending API request with:', payload);
            try {
                const response = await fetch('https://us-central1-api-skinstric-ai.cloudfunctions.net/skinstricPhaseOne', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                });

                console.log('API response status:', response.status);
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`API request failed: ${response.status} - ${errorText}`);
                }

                const text = await response.text();
                console.log('Raw response:', text);
                let result;
                try {
                    result = JSON.parse(text);
                } catch (parseError) {
                    console.error('Failed to parse API response:', parseError);
                    result = { message: 'Response received but could not parse JSON' };
                }
                console.log('API response:', result);
                setIsApiSuccess(true);
                alert('Submission successful!');
            } catch (error) {
                console.error('Error submitting form:', error);
                alert('Failed to submit form. Please try again.');
            } finally {
                setIsSubmitting(false);
                handleTransition(3);
            }
        },
        [handleTransition, formData.name]
    );

    const handleCityFocus = useCallback(() => {
        if (!isSubmitting) {
            setCityPrompt('Where are you from?');
            setCityPlaceholder('City Name');
            setLocationError('');
        }
    }, [isSubmitting]);

    const handleLocationChange = useCallback((event) => {
        setFormData((prev) => ({ ...prev, location: event.target.value }));
        setLocationError('');
    }, []);

    const handleProceed = useCallback(() => {
        setFormData({ name: '', location: '' });
        setCityPrompt('Click to type');
        setCityPlaceholder('Where are you from?');
        setIsApiSuccess(false);
        setNameError('');
        setLocationError('');
        handleTransition(1);
    }, [handleTransition]);

    return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-white text-center overflow-hidden px-4 pt-20 pb-20">
            <div className="absolute top-16 left-4 sm:left-9 text-left">
                <p className="font-semibold text-[10px] sm:text-xs">TO START ANALYSIS</p>
            </div>
            <div
                className="relative flex flex-col items-center justify-center w-full h-full overflow-hidden"
            >
                {step === 1 ? (
                    <form
                        key="step-1"
                        onSubmit={handleNameSubmit}
                        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 transition-opacity duration-300 ${
                            isTransitioning ? 'opacity-0' : 'opacity-100 animate-fade-in'
                        }`}
                    >
                        <div className="flex flex-col items-center opacity-100 max-w-[200px]">
                            <p className="text-[10px] sm:text-xs text-gray-400 tracking-wider uppercase mb-1 pointer-events-none">
                                CLICK TO TYPE
                            </p>
                            <input
                                className="text-2xl sm:text-3xl font-normal text-center bg-transparent border-b border-black focus:outline-none appearance-none w-[60vw] max-w-[200px] min-w-[160px] pt-1 tracking-[-0.05em] leading-[36px] sm:leading-[40px] text-[#1A1B1C] z-20"
                                placeholder="Introduce Yourself"
                                autoComplete="off"
                                type="text"
                                name="name"
                                onFocus={() => setNameError('')}
                            />
                            {nameError && (
                                <p className="text-red-500 text-[10px] sm:text-xs mt-2">{nameError}</p>
                            )}
                            <button type="submit" className="sr-only">Submit</button>
                        </div>
                    </form>
                ) : step === 2 ? (
                    <form
                        key="step-2"
                        onSubmit={handleLocationSubmit}
                        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 transition-opacity duration-300 ${
                            isTransitioning ? 'opacity-0' : 'opacity-100 animate-fade-in'
                        }`}
                    >
                        <div className="flex flex-col items-center opacity-100 max-w-[200px]">
                            {isSubmitting ? (
                                <>
                                    <p className="text-[12px] sm:text-sm font-semibold text-center">
                                        Processing Submission
                                    </p>
                                    <div className="flex space-x-2 mt-2">
                                        <span className="text-xl sm:text-2xl font-bold animate-pulse-dot">.</span>
                                        <span className="text-xl sm:text-2xl font-bold animate-pulse-dot delay-100">.</span>
                                        <span className="text-xl sm:text-2xl font-bold animate-pulse-dot delay-200">.</span>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p className="text-[10px] sm:text-xs text-gray-400 tracking-wider uppercase mb-1 pointer-events-none">
                                        {cityPrompt}
                                    </p>
                                    <input
                                        ref={cityInputRef}
                                        className="text-2xl sm:text-3xl font-normal text-center bg-transparent border-b border-black focus:outline-none appearance-none w-[60vw] max-w-[200px] min-w-[160px] mt-2 pt-1 tracking-[-0.05em] leading-[36px] sm:leading-[40px] text-[#1A1B1C] z-20"
                                        placeholder={cityPlaceholder}
                                        autoComplete="off"
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleLocationChange}
                                        onFocus={handleCityFocus}
                                        disabled={isSubmitting}
                                    />
                                    {locationError && (
                                        <p className="text-red-500 text-[10px] sm:text-xs mt-2">{locationError}</p>
                                    )}
                                </>
                            )}
                            <button type="submit" className="sr-only">Submit</button>
                        </div>
                    </form>
                ) : step === 3 ? (
                    <div
                        key="step-3"
                        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center transition-opacity duration-300 ${
                            isTransitioning ? 'opacity-0' : 'opacity-100 animate-fade-in'
                        }`}
                    >
                        <p className="text-[10px] sm:text-xs text-gray-400 tracking-wider uppercase mb-1 pointer-events-none">
                            Thank you!
                        </p>
                        <Link to="/result">
                            <button
                                onClick={handleProceed}
                                className="text-sm sm:text-base text-black border-b border-black"
                            >
                                Proceed to the next step.
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div
                        key="step-4"
                        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center transition-opacity duration-300 ${
                            isTransitioning ? 'opacity-0' : 'opacity-100 animate-fade-in'
                        }`}
                    >
                        <p className="text-[10px] sm:text-xs text-gray-400 tracking-wider uppercase mb-1 pointer-events-none">
                            Something went wrong. Please try again.
                        </p>
                        <button
                            onClick={handleProceed}
                            className="text-sm sm:text-base text-black border-b border-black"
                        >
                            Restart
                        </button>
                    </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div
                        className="absolute w-[70vw] h-[70vw] max-w-[300px] max-h-[300px] border-dotted border-2 border-black opacity-15 transition-opacity duration-300 rotate-45"
                        style={{
                            left: '50%',
                            top: '50%',
                            transform: 'translate(-50%, -50%) rotate(45deg)',
                        }}
                    ></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div
                        className="absolute w-[80vw] h-[80vw] max-w-[350px] max-h-[350px] border-dotted border-2 border-black opacity-10 transition-opacity duration-300 rotate-45"
                        style={{
                            left: '50%',
                            top: '50%',
                            transform: 'translate(-50%, -50%) rotate(45deg)',
                        }}
                    ></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div
                        className="absolute w-[90vw] h-[90vw] max-w-[400px] max-h-[400px] border-dotted border-2 border-black opacity-5 transition-opacity duration-300 rotate-45"
                        style={{
                            left: '50%',
                            top: '50%',
                            transform: 'translate(-50%, -50%) rotate(45deg)',
                        }}
                    ></div>
                </div>
            </div>
            <div className="absolute bottom-12 sm:bottom-8 w-full flex justify-between px-4 sm:px-9 opacity-100">
                <a className="inset-0" aria-label="Back" href="/">
                    <div>
                        <div className="group flex flex-row relative justify-center items-center">
                            <div
                                className="w-16 sm:w-20 h-16 sm:h-20 flex justify-center rotate-45 scale-[1.0] group-hover:scale-[1.1] ease duration-300"
                            ></div>
                            <img
                                src="/back-icon-text-shrunk.jpg"
                                className="absolute left-[16px] sm:left-[20px] bottom-[14px] sm:bottom-[18px] scale-100 sm:scale-[1.1] group-hover:scale-110 sm:group-hover:scale-[1.2] ease duration-300"
                            />
                        </div>
                    </div>
                </a>
                {isApiSuccess && (
                    <a className="inset-0" aria-label="Forward" href="/result">
                        <div>
                            <div className="group flex flex-row relative justify-center items-center">
                                <img
                                    src="/proceed-icon.jpg"
                                    className="absolute right-[16px] sm:right-[20px] bottom-[14px] sm:bottom-[18px] scale-125 sm:scale-[1.35] group-hover:scale-[1.35] sm:group-hover:scale-[1.45] ease duration-300"
                                />
                                <div
                                    className="w-16 sm:w-20 h-16 sm:h-20 flex justify-center rotate-45 scale-[1.0] sm:scale-[1.1] group-hover:scale-[1.1] sm:group-hover:scale-[1.2] ease duration-300"
                                ></div>
                            </div>
                        </div>
                    </a>
                )}
            </div>
        </div>
    );
};

export default Testing;