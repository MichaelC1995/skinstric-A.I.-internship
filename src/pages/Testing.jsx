import React, { useState, useEffect, useCallback } from 'react';

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

    useEffect(() => {
        console.log('Current step after state update:', step);
        console.log(`Rendering Step ${step}: ${step === 1 ? 'Name form' : step === 2 ? 'City form' : step === 3 ? 'Confirmation' : 'Fallback'}`);
    }, [step]);

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
            setCityPrompt('Processing Submission');
            setCityPlaceholder('...');
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
                setCityPrompt('Thank you!');
                setCityPlaceholder('Proceed to the next step.');
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
        <div className="h-screen w-full flex flex-col items-center justify-center bg-white text-center overflow-hidden">
            <div className="absolute top-16 left-9 text-left">
                <p className="font-semibold text-xs">TO START ANALYSIS</p>
            </div>
            <div className="relative flex flex-col items-center justify-center w-full h-full overflow-hidden">
                {step === 1 ? (
                    <form
                        key="name-form"
                        onSubmit={handleNameSubmit}
                        className={`relative z-10 transition-opacity duration-300 ${
                            isTransitioning ? 'opacity-0' : 'opacity-100'
                        }`}
                    >
                        <div className="flex flex-col items-center opacity-100">
                            <p className="text-sm text-gray-400 tracking-wider uppercase mb-1 pointer-events-none">
                                CLICK TO TYPE
                            </p>
                            <input
                                className="text-5xl sm:text-6xl font-normal text-center bg-transparent border-b border-black focus:outline-none appearance-none w-[372px] sm:w-[432px] pt-1 tracking-[-0.07em] leading-[64px] text-[#1A1B1C] z-10"
                                placeholder="Introduce Yourself"
                                autoComplete="off"
                                type="text"
                                name="name"
                                onFocus={() => setNameError('')}
                            />
                            {nameError && (
                                <p className="text-red-500 text-sm mt-2">{nameError}</p>
                            )}
                            <button type="submit" className="sr-only">Submit</button>
                        </div>
                    </form>
                ) : step === 2 ? (
                    <form
                        key="city-form"
                        onSubmit={handleLocationSubmit}
                        className={`relative z-10 transition-opacity duration-300 ${
                            isTransitioning ? 'opacity-0' : 'opacity-100'
                        }`}
                    >
                        <div className="flex flex-col items-center opacity-100">
                            <p className="text-sm text-gray-400 tracking-wider uppercase mb-1 pointer-events-none">
                                {cityPrompt}
                            </p>
                            <input
                                className="text-5xl sm:text-6xl font-normal text-center bg-transparent border-b border-black focus:outline-none appearance-none w-[400px] sm:w-[550px] mt-4 pt-1 tracking-[-0.05em] leading-[48px] text-[#1A1B1C] z-10"
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
                                <p className="text-red-500 text-sm mt-2">{locationError}</p>
                            )}
                            <button type="submit" className="sr-only">Submit</button>
                        </div>
                    </form>
                ) : step === 3 ? (
                    <div
                        className={`relative z-10 flex flex-col items-center transition-opacity duration-300 ${
                            isTransitioning ? 'opacity-0' : 'opacity-100'
                        }`}
                    >
                        <p className="text-sm text-gray-400 tracking-wider uppercase mb-1 pointer-events-none">
                            Thank you!
                        </p>
                        <button
                            onClick={handleProceed}
                            className="text-lg text-black border-b border-black"
                        >
                            Proceed to the next step.
                        </button>
                    </div>
                ) : (
                    <div
                        className={`relative z-10 flex flex-col items-center transition-opacity duration-300 ${
                            isTransitioning ? 'opacity-0' : 'opacity-100'
                        }`}
                    >
                        <p className="text-sm text-gray-400 tracking-wider uppercase mb-1 pointer-events-none">
                            Something went wrong. Please try again.
                        </p>
                        <button
                            onClick={handleProceed}
                            className="text-lg text-black border-b border-black"
                        >
                            Restart
                        </button>
                    </div>
                )}
                <img
                    alt="Diamond Large"
                    loading="lazy"
                    className="absolute top-1/2 left-1/2 -translate-x-[50%] -translate-y-1/2 w-[762px] h-[762px] max-w-[480px] max-h-[480px] md:max-w-[762px] md:max-h-[762px] animate-spin-slow rotate-190 z-[1]"
                    src="/Rectangle%202780.png"
                />
                <img
                    alt="Diamond Medium"
                    loading="lazy"
                    className="absolute top-1/2 left-1/2 -translate-x-[50%] -translate-y-1/2 w-[682px] h-[682px] max-w-[400px] max-h-[400px] md:max-w-[682px] md:max-h-[682px] animate-spin-slower rotate-185 z-[2]"
                    src="/Rectangle%202779.png"
                />
                <img
                    alt="Diamond Small"
                    loading="lazy"
                    className="absolute top-1/2 left-1/2 w-[602px] h-[602px] max-w-[340px] max-h-[340px] -translate-x-[50%] -translate-y-1/2 md:max-w-[602px] md:max-h-[602px] animate-spin-slowest"
                    src="/Rectangle%202778.jpg"
                />
            </div>
            <div className="absolute bottom-8 w-full flex justify-between md:px-9 px-13 opacity-100">
                <a className="inset-0" aria-label="Back" href="/">
                    <div>
                        <div className="group flex flex-row relative justify-center items-center">
                            <div
                                className="w-20 h-20 flex justify-center rotate-45 scale-[1.0] group-hover:scale-[1.1] ease duration-300"
                            ></div>
                            <img
                                src="/back-icon-text-shrunk.jpg"
                                className="absolute left-[20px] bottom-[18px] scale-[1.1] group-hover:scale-[1.2] ease duration-300"
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
                                    className="absolute right-[20px] bottom-[18px] scale-[1.35] group-hover:scale-[1.45] ease duration-300"
                                />
                                <div
                                    className="w-20 h-20 flex justify-center rotate-45 scale-[1.1] group-hover:scale-[1.2] ease duration-300"
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