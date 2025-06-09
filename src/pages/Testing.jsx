import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import NameForm from '../components/NameForm';
import LocationForm from '../components/LocationForm';
import ErrorStep from '../components/ErrorStep';

const STEPS = {
    NAME: 1,
    LOCATION: 2,
    ERROR: 3,
};

const Testing = () => {
    const { register, handleSubmit, formState: { errors }, watch, reset, setError } = useForm({
        defaultValues: { name: '', location: '' },
    });
    const [step, setStep] = useState(STEPS.NAME);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState('');
    const [isLocationFilled, setIsLocationFilled] = useState(false);
    const navigate = useNavigate();
    const cityInputRef = useRef(null);

    useEffect(() => {
        if (step === STEPS.LOCATION && !isTransitioning && !isSubmitting && cityInputRef.current) {
            cityInputRef.current.focus();
            setIsLocationFilled(false);
        }
    }, [step, isTransitioning, isSubmitting]);

    const handleTransition = useCallback((nextStep) => {
        setIsTransitioning(true);
        setTimeout(() => {
            setStep(nextStep);
            setIsTransitioning(false);
        }, 300);
    }, []);

    const handleNameSubmit = useCallback(() => {
        if (!errors.name) {
            handleTransition(STEPS.LOCATION);
        }
    }, [handleTransition, errors.name]);

    const handleLocationSubmit = useCallback(
        async (data) => {
            setIsSubmitting(true);
            try {
                const response = await fetch(
                    'https://us-central1-api-skinstric-ai.cloudfunctions.net/skinstricPhaseOne',
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data),
                    }
                );
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Failed to submit form: ${errorText || 'Unknown error'}`);
                }
                await response.json();
                alert('Submission successful!');
                navigate('/result');
            } catch (error) {
                setFormError(error.message);
                setError('location', { type: 'manual', message: error.message });
                handleTransition(STEPS.ERROR);
            } finally {
                setIsSubmitting(false);
            }
        },
        [handleTransition, navigate, setError]
    );

    const handleProceed = useCallback(() => {
        reset();
        setFormError('');
        setIsLocationFilled(false);
        handleTransition(STEPS.NAME);
    }, [handleTransition, reset]);

    return (
        <div className="relative bg-white text-center overflow-hidden px-4 mb-20" style={{ height: `calc(100vh - 60px)` }}>
            <div className="absolute top-0 left-4 sm:left-9 text-left z-10">
                <p className="font-bold text-[12px]">TO START ANALYSIS</p>
            </div>

            <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative flex flex-col items-center justify-center w-full sm:scale-100 scale-[0.6] pointer-events-auto">
                    {step === STEPS.NAME ? (
                        <NameForm onSubmit={handleSubmit(handleNameSubmit)} error={errors.name?.message} register={register} />
                    ) : step === STEPS.LOCATION ? (
                        <LocationForm
                            onSubmit={handleSubmit(handleLocationSubmit)}
                            error={errors.location?.message || formError}
                            isSubmitting={isSubmitting}
                            cityInputRef={cityInputRef}
                            isLocationFilled={isLocationFilled}
                            setIsLocationFilled={setIsLocationFilled}
                            register={register}
                        />
                    ) : step === STEPS.ERROR ? (
                        <ErrorStep
                            onRetry={() => handleTransition(STEPS.LOCATION)}
                            onRestart={handleProceed}
                            error={formError}
                        />
                    ) : null}
                </div>
            </div>

            <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
                <div
                    className={`absolute w-[70.56vw] md:w-[98vw] h-[70.56vw] md:h-[98vw] max-w-[241.92px] max-h-[241.92px] md:max-w-[420px] md:max-h-[420px] border-dotted border-2 border-black opacity-15 transition-opacity duration-300 rotate-45 ${
                        step === STEPS.LOCATION && isSubmitting ? 'animate-spin-slow' : ''
                    }`}
                ></div>
            </div>
            <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
                <div
                    className={`absolute w-[80.64vw] md:w-[112vw] h-[80.64vw] md:h-[112vw] max-w-[282.24px] max-h-[282.24px] md:max-w-[490px] md:max-h-[490px] border-dotted border-2 border-black opacity-10 transition-opacity duration-300 rotate-45 ${
                        step === STEPS.LOCATION && isSubmitting ? 'animate-spin-slower' : ''
                    }`}
                ></div>
            </div>
            <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
                <div
                    className={`absolute w-[90.72vw] md:w-[126vw] h-[90.72vw] md:h-[126vw] max-w-[322.56px] max-h-[322.56px] md:max-w-[560px] md:max-h-[560px] border-dotted border-2 border-black opacity-5 transition-opacity duration-300 rotate-45 ${
                        step === STEPS.LOCATION && isSubmitting ? 'animate-spin-slowest' : ''
                    }`}
                ></div>
            </div>

            <div className="absolute bottom-12 sm:bottom-8 w-full flex justify-between px-4 sm:px-9 opacity-100">
                <Link to="/" aria-label="Back to home">
                    <div>
                        <div className="relative w-12 h-12 flex items-center justify-center border border-[#1A1B1C] rotate-45 scale-[1] sm:hidden">
                            <span className="rotate-[-45deg] text-xs font-semibold sm:hidden">BACK</span>
                        </div>
                        <div className="group hidden sm:flex flex-row relative justify-center items-center">
                            <div className="w-12 h-12 hidden sm:flex justify-center border border-[#1A1B1C] rotate-45 scale-[0.85] group-hover:scale-[0.92] ease duration-300"></div>
                            <FaArrowLeft className="absolute left-[16px] bottom-[15px] scale-[0.9] hidden sm:block group-hover:scale-[0.92] ease duration-300" />
                            <span className="text-sm font-semibold hidden sm:block ml-6">BACK</span>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default Testing;