import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const Testing = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({ name: '', location: '' });
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isApiSuccess, setIsApiSuccess] = useState(false);
    const [nameError, setNameError] = useState('');
    const [locationError, setLocationError] = useState('');

    const cityInputRef = useRef(null);

    useEffect(() => {
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

            const locationValidationError = validateString(location, 'City');
            if (locationValidationError) {
                setLocationError(locationValidationError);
                alert(locationValidationError);
                return;
            }

            setLocationError('');
            setIsSubmitting(true);
            setFormData((prev) => ({ ...prev, location: '' }));

            const payload = { name: formData.name, location };

            try {
                const response = await fetch(
                    'https://us-central1-api-skinstric-ai.cloudfunctions.net/skinstricPhaseOne',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(payload),
                    }
                );

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`API request failed: ${response.status} - ${errorText}`);
                }

                const result = await response.json();
                setIsApiSuccess(true);
                alert('Submission successful!');
            } catch (error) {
                console.error('❌ Error submitting form:', error);
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
            setLocationError('');
        }
    }, [isSubmitting]);

    const handleLocationChange = useCallback((event) => {
        setFormData((prev) => ({ ...prev, location: event.target.value }));
        setLocationError('');
    }, []);

    const handleProceed = useCallback(() => {
        setFormData({ name: '', location: '' });
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
            <div className="relative flex flex-col items-center justify-center w-full h-full overflow-hidden">
                {step === 1 ? (
                    <form
                        key="step-1"
                        onSubmit={handleNameSubmit}
                        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 transition-opacity duration-300 ${
                            isTransitioning ? 'opacity-0' : 'opacity-100 animate-fade-in'
                        }`}
                    >
                        <div className="flex flex-col items-center opacity-100 max-w-[300px]">
                            <p className="text-[10px] sm:text-xs text-gray-400 tracking-wider uppercase mb-1 pointer-events-none">
                                CLICK TO TYPE
                            </p>
                            <input
                                className="text-2xl sm:text-3xl font-normal text-center bg-transparent border-b border-black focus:outline-none appearance-none w-[70vw] max-w-[320px] min-w-[200px] pt-1 px-2 tracking-[-0.05em] leading-[36px] sm:leading-[50px] text-[#1A1B1C] z-20 placeholder:text-black placeholder:opacity-100 sm:placeholder:text-[32px]"
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
                        <div className="flex flex-col items-center opacity-100 max-w-[300px]">
                            {isSubmitting ? (
                                <>
                                    <p className="text-[12px] sm:text-sm font-semibold text-center">
                                        Processing Submission
                                    </p>
                                    <div className="flex space-x-2 mt-2">
                                        <span className="text-xl sm:text-2xl font-bold animate-dot-bounce-1">.</span>
                                        <span className="text-xl sm:text-2xl font-bold animate-dot-bounce-2 delay-100">.</span>
                                        <span className="text-xl sm:text-2xl font-bold animate-dot-bounce-3 delay-200">.</span>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p className="text-[10px] sm:text-xs text-gray-400 tracking-wider uppercase mb-1 pointer-events-none">
                                        CLICK TO TYPE
                                    </p>
                                    <input
                                        ref={cityInputRef}
                                        className="text-2xl sm:text-3xl font-normal text-center bg-transparent border-b border-black focus:outline-none appearance-none w-[70vw] max-w-[320px] min-w-[200px] mt-2 pt-1 px-2 tracking-[-0.05em] leading-[36px] sm:leading-[40px] text-[#1A1B1C] z-20 placeholder:text-black placeholder:opacity-100 sm:placeholder:text-[32px]"
                                        placeholder="Where are you from?"
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
                        className={`absolute w-[70vw] h-[70vw] max-w-[300px] max-h-[300px] border-dotted border-2 border-black opacity-15 transition-opacity duration-300 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45 ${
                            step === 2 && isSubmitting ? 'animate-spin-slow' : ''
                        }`}
                    ></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div
                        className={`absolute w-[80vw] h-[80vw] max-w-[350px] max-h-[350px] border-dotted border-2 border-black opacity-10 transition-opacity duration-300 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45 ${
                            step === 2 && isSubmitting ? 'animate-spin-slower' : ''
                        }`}
                    ></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div
                        className={`absolute w-[90vw] h-[90vw] max-w-[400px] max-h-[400px] border-dotted border-2 border-black opacity-5 transition-opacity duration-300 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45 ${
                            step === 2 && isSubmitting ? 'animate-spin-slowest' : ''
                        }`}
                    ></div>
                </div>
            </div>
            <div className="absolute bottom-12 sm:bottom-8 w-full flex justify-between px-4 sm:px-9 opacity-100">
                <Link to="/" aria-label="Back">
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
                {isApiSuccess && (
                    <Link to="/result" aria-label="Forward">
                        <div>
                            <div
                                className="w-12 h-12 flex items-center justify-center border border-[#1A1B1C] rotate-45 scale-[1] sm:hidden"
                            >
                                <span className="rotate-[-45deg] text-xs font-semibold sm:hidden">PROCEED</span>
                            </div>
                            <div className="group hidden sm:flex flex-row relative justify-center items-center">
                                <span className="text-sm font-semibold hidden sm:block mr-5">PROCEED</span>
                                <div
                                    className="w-12 h-12 hidden sm:flex justify-center border border-[#1A1B1C] rotate-45 scale-[0.85] group-hover:scale-[0.92] ease duration-300"
                                ></div>
                                <FaArrowRight
                                    className="absolute right-[16px] bottom-[15px] scale-[0.9] hidden sm:block group-hover:scale-[0.92] ease duration-300"
                                />
                            </div>
                        </div>
                    </Link>
                )}
            </div>
        </div>
    );
};

export default Testing;