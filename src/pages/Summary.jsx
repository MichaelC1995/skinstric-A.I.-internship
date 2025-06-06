import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { MdRadioButtonChecked, MdRadioButtonUnchecked } from "react-icons/md";
import { Link } from "react-router-dom";
import { useAnalysis } from "../context/AnalysisContext";

const Summary = () => {
    const { analysisData } = useAnalysis();


    const [selectedRace, setSelectedRace] = useState('');
    const [selectedConfidence, setSelectedConfidence] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState('race');
    const [selectedLabel, setSelectedLabel] = useState('');

    const findHighestConfidence = (obj) => {
        if (!obj) return [null, 0];
        return Object.entries(obj).reduce((max, entry) => {
            const [key, value] = entry;
            return value > max[1] ? [key, value] : max;
        }, [null, -Infinity]);
    };

    useEffect(() => {
        if (analysisData && analysisData.data && analysisData.data.race) {
            const [predictedRace, raceConfidence] = findHighestConfidence(analysisData.data.race);
            if (predictedRace && selectedRace === '') {
                const formattedPredictedRace = predictedRace
                    .split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
                setSelectedRace(formattedPredictedRace);
                setSelectedConfidence(raceConfidence);
                setSelectedCategory('race');
                setSelectedLabel(formattedPredictedRace);
            }
        }
    }, [analysisData, selectedRace]);

    if (!analysisData || !analysisData.data) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-white text-center">
                <p className="text-lg font-semibold">No analysis data available.</p>
                <p className="text-sm text-gray-500">Please complete the analysis first.</p>
                <Link to="/result" className="mt-4 text-blue-500 underline">Go to Analysis</Link>
            </div>
        );
    }

    const { age, gender, race } = analysisData.data;

    const [predictedRace, raceConfidence] = findHighestConfidence(race);
    const formattedPredictedRace = predictedRace
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    const [ageRange, ageConfidence] = findHighestConfidence(age);
    const [genderKey, genderConfidence] = findHighestConfidence(gender);
    const sex = genderKey.toUpperCase();

    const racePredictions = Object.entries(race)
        .map(([race, confidence]) => ({
            race: race
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' '),
            confidence
        }))
        .sort((a, b) => b.confidence - a.confidence);

    const agePredictions = Object.entries(age)
        .map(([ageRange, confidence]) => ({
            age: ageRange,
            confidence
        }))
        .sort((a, b) => {
            // Parse lower bound of age range (e.g., "0-2" -> 0, "3-9" -> 3)
            const getLowerBound = (range) => {
                if (!range.includes('-')) return Number(range) || Infinity; // Handle "20+" or non-numeric
                const lower = range.split('-')[0];
                return Number(lower) || Infinity; // Fallback for malformed ranges
            };
            return getLowerBound(a.age) - getLowerBound(b.age);
        });

    const sexPredictions = Object.entries(gender)
        .map(([sex, confidence]) => ({
            sex: sex.toUpperCase(),
            confidence
        }))
        .sort((a, b) => b.confidence - a.confidence);


    const selectedConfidencePercentage = Math.round(selectedConfidence * 100);

    const handleRaceSelection = (raceName, confidence) => {
        setSelectedRace(raceName);
        setSelectedConfidence(confidence);
        setSelectedCategory('race');
        setSelectedLabel(raceName);
    };

    const handleAgeSelection = (ageValue, confidence) => {
        setSelectedConfidence(confidence);
        setSelectedCategory('age');
        setSelectedLabel(ageValue);
    };

    const handleSexSelection = (sexValue, confidence) => {
        setSelectedConfidence(confidence);
        setSelectedCategory('sex');
        setSelectedLabel(sexValue);
    };

    return (
        <div className="h-screen w-full flex flex-col bg-white overflow-y-auto">
            <div className="md:h-screen max-w-full mx-5 px-4 md:px-auto flex flex-col">
                <div className="text-start ml-4 mb-4 md:mb-10 md:ml-0">
                    <h2 className="text-base md:text-base font-semibold mb-1 leading-[24px]">A.I. ANALYSIS</h2>
                    <h3 className="text-4xl md:text-[72px] font-normal leading-[64px] tracking-tighter">DEMOGRAPHICS</h3>
                    <h4 className="text-sm mt-2 leading-[24px]">PREDICTED RACE & AGE</h4>
                </div>
                <div className="grid md:grid-cols-[1.5fr_8.5fr_3.15fr] gap-4 mt-10 mb-40 md:gap-4 pb-0 md:pb-0 md:mb-8 md:flex-1 md:min-h-0">
                    <div className="bg-white-100 space-y-3 md:flex md:flex-col md:min-h-0">
                        <div className="md:h-[calc((100%_-_32px)_/_2)] md:space-y-3 flex flex-col">
                            <div
                                onClick={handleRaceSelection.bind(null, selectedRace || formattedPredictedRace, selectedRace ? selectedConfidence : raceConfidence)}
                                className={`p-3 cursor-pointer flex-1 flex flex-col justify-between border-t transition-colors duration-200 ${
                                    selectedCategory === 'race'
                                        ? 'bg-black text-white hover:bg-gray-900'
                                        : 'bg-[#F3F3F4] hover:bg-[#E1E1E2]'
                                }`}
                            >
                                <p className="text-base font-semibold">{selectedRace || formattedPredictedRace}</p>
                                <h4 className="text-base font-semibold mb-1">RACE</h4>
                            </div>
                            <div
                                onClick={() => handleAgeSelection(selectedCategory === 'age' ? selectedLabel : ageRange, selectedCategory === 'age' ? selectedConfidence : ageConfidence)}
                                className={`p-3 cursor-pointer flex-1 flex flex-col justify-between border-t transition-colors duration-200 ${
                                    selectedCategory === 'age'
                                        ? 'bg-black text-white hover:bg-gray-900'
                                        : 'bg-[#F3F3F4] hover:bg-[#E1E1E2]'
                                }`}
                            >
                                <p className="text-base font-semibold">{selectedCategory === 'age' ? selectedLabel : ageRange}</p>
                                <h4 className="text-base font-semibold mb-1">AGE</h4>
                            </div>
                            <div
                                onClick={() => handleSexSelection(selectedCategory === 'sex' ? selectedLabel : sex, selectedCategory === 'sex' ? selectedConfidence : genderConfidence)}
                                className={`p-3 cursor-pointer flex-1 flex flex-col justify-between border-t transition-colors duration-200 ${
                                    selectedCategory === 'sex'
                                        ? 'bg-black text-white hover:bg-gray-900'
                                        : 'bg-[#F3F3F4] hover:bg-[#E1E1E2]'
                                }`}
                            >
                                <p className="text-base font-semibold">{selectedCategory === 'sex' ? selectedLabel : sex}</p>
                                <h4 className="text-base font-semibold mb-1">SEX</h4>
                            </div>
                        </div>
                    </div>

                    <div className="relative bg-gray-100 p-4 flex flex-col items-center justify-center md:border-t md:min-h-0">
                        <p className="hidden md:block md:absolute text-[40px] mb-2 left-5 top-2">{selectedLabel}</p>
                        <div className="relative md:absolute w-full max-w-[384px] aspect-square mb-4 md:right-5 md:bottom-2">
                            <div
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    maxHeight: "384px",
                                    position: "relative",
                                    transform: "scale(1)",
                                    transformOrigin: "center center"
                                }}
                            >
                                <svg className="CircularProgressbar text-[#1A1B1C]" viewBox="0 0 100 100" data-test-id="CircularProgressbar">
                                    <path
                                        className="CircularProgressbar-trail"
                                        d="M 50,50 m 0,-49.15 a 49.15,49.15 0 1 1 0,98.3 a 49.15,49.15 0 1 1 0,-98.3"
                                        strokeWidth="1.7"
                                        fillOpacity="0"
                                        style={{
                                            stroke: "rgb(200, 200, 200)",
                                            strokeLinecap: "butt",
                                            transitionDuration: "0.8s",
                                            strokeDasharray: "308.819px, 308.819px",
                                            strokeDashoffset: "0px"
                                        }}
                                    ></path>
                                    <path
                                        className="CircularProgressbar-path"
                                        d="M 50,50 m 0,-49.15 a 49.15,49.15 0 1 1 0,98.3 a 49.15,49.15 0 1 1 0,-98.3"
                                        strokeWidth="1.7"
                                        fillOpacity="0"
                                        style={{
                                            stroke: "rgb(26, 27, 28)",
                                            strokeLinecap: "butt",
                                            transitionDuration: "0.8s",
                                            strokeDasharray: "308.819px, 308.819px",
                                            strokeDashoffset: `${308.819 - (308.819 * selectedConfidence)}px`
                                        }}
                                    ></path>
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <p className="text-3xl md:text-[40px] font-normal">
                                        {selectedConfidencePercentage}<span className="absolute text-xl md:text-3xl">%</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <p className="md:absolute text-xs text-[#A0A4AB] md:text-sm lg:text-base font-normal mb-1 leading-[24px] md:bottom-[-15%] md:left-[22%] lg:left-[30%] xl:left-[40%] 2xl:left-[45%]">
                            {selectedCategory === 'race' ? 'If A.I. estimate is wrong, select the correct one.' : `A.I. confidence for ${selectedCategory.toUpperCase()}: ${selectedLabel}`}
                        </p>
                    </div>

                    <div className="bg-gray-100 pt-4 pb-4 md:border-t md:flex md:flex-col">
                        <div className="md:flex-1 md:flex md:flex-col">
                            <div className="flex justify-between px-4 md:flex-shrink-0">
                                <h4 className="text-base leading-[24px] tracking-tight font-medium mb-2">
                                    {selectedCategory.toUpperCase()}
                                </h4>
                                <h4 className="text-base leading-[24px] tracking-tight font-medium mb-2">A.I. CONFIDENCE</h4>
                            </div>
                            <div className={`md:flex-1 ${selectedCategory === 'age' ? 'min-h-[288px]' : ''}`}>
                                {selectedCategory === 'race' && racePredictions.map((prediction, index) => (
                                    <div
                                        key={index}
                                        onClick={() => handleRaceSelection(prediction.race, prediction.confidence)}
                                        className={`flex items-center justify-between h-[48px] hover:bg-[#E1E1E2] px-4 cursor-pointer transition-colors duration-200 ${
                                            prediction.race === selectedRace ? 'bg-black text-white hover:bg-gray-900' : ''
                                        }`}
                                    >
                                        <div className="flex items-center gap-1">
                                            {prediction.race === selectedRace ? (
                                                <MdRadioButtonChecked
                                                    className="w-[12px] h-[12px] mr-2"
                                                    style={{ color: '#FFFFFF' }}
                                                />
                                            ) : (
                                                <MdRadioButtonUnchecked
                                                    className="w-[12px] h-[12px] mr-2"
                                                    style={{ color: '#000000' }}
                                                />
                                            )}
                                            <span className="font-normal text-base leading-6 tracking-tight">{prediction.race}</span>
                                        </div>
                                        <span className="font-normal text-base leading-6 tracking-tight">
                                            {Math.round(prediction.confidence * 100)}%
                                        </span>
                                    </div>
                                ))}
                                {selectedCategory === 'age' && agePredictions.map((prediction, index) => (
                                    <div
                                        key={index}
                                        onClick={() => handleAgeSelection(prediction.age, prediction.confidence)}
                                        className={`flex items-center justify-between h-[48px] hover:bg-[#E1E1E2] px-4 cursor-pointer transition-colors duration-200 ${
                                            prediction.age === selectedLabel ? 'bg-black text-white hover:bg-gray-900' : ''
                                        }`}
                                    >
                                        <div className="flex items-center gap-1">
                                            {prediction.age === selectedLabel ? (
                                                <MdRadioButtonChecked
                                                    className="w-[12px] h-[12px] mr-2"
                                                    style={{ color: '#FFFFFF' }}
                                                />
                                            ) : (
                                                <MdRadioButtonUnchecked
                                                    className="w-[12px] h-[12px] mr-2"
                                                    style={{ color: '#000000' }}
                                                />
                                            )}
                                            <span className="font-normal text-base leading-6 tracking-tight">{prediction.age}</span>
                                        </div>
                                        <span className="font-normal text-base leading-6 tracking-tight">
                                            {Math.round(prediction.confidence * 100)}%
                                        </span>
                                    </div>
                                ))}
                                {selectedCategory === 'sex' && sexPredictions.map((prediction, index) => (
                                    <div
                                        key={index}
                                        onClick={() => handleSexSelection(prediction.sex, prediction.confidence)}
                                        className={`flex items-center justify-between h-[48px] hover:bg-[#E1E1E2] px-4 cursor-pointer transition-colors duration-200 ${
                                            prediction.sex === selectedLabel ? 'bg-black text-white hover:bg-gray-900' : ''
                                        }`}
                                    >
                                        <div className="flex items-center gap-1">
                                            {prediction.sex === selectedLabel ? (
                                                <MdRadioButtonChecked
                                                    className="w-[12px] h-[12px] mr-2"
                                                    style={{ color: '#FFFFFF' }}
                                                />
                                            ) : (
                                                <MdRadioButtonUnchecked
                                                    className="w-[12px] h-[12px] mr-2"
                                                    style={{ color: '#000000' }}
                                                />
                                            )}
                                            <span className="font-normal text-base leading-6 tracking-tight">{prediction.sex}</span>
                                        </div>
                                        <span className="font-normal text-base leading-6 tracking-tight">
                                            {Math.round(prediction.confidence * 100)}%
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-4 md:pt-[37px] pb-6 bg-white sticky bottom-40 md:static md:bottom-0 mb-8 md:mb-16 md:flex-shrink-0">
                <div className="w-full max-w-screen mx-auto px-4 md:px-4">
                    <div className="flex justify-between items-center">
                        <Link to="/select">
                            <div>
                                <div className="relative w-12 h-12 flex items-center justify-center border border-[#1A1B1C] rotate-45 scale-[1] sm:hidden">
                                    <span className="rotate-[-45deg] text-xs font-semibold sm:hidden">BACK</span>
                                </div>
                                <div className="group hidden sm:flex flex-row relative justify-center items-center">
                                    <div className="w-12 h-12 hidden sm:flex justify-center border border-[#1A1B1C] rotate-45 scale-[0.85] group-hover:scale-[0.92] ease duration-300"></div>
                                    <FaArrowLeft
                                        className="absolute left-[16px] bottom-[15px] scale-[0.9] hidden sm:block group-hover:scale-[0.92] ease duration-300"
                                    />
                                    <span className="text-sm font-semibold hidden sm:block ml-4">BACK</span>
                                </div>
                            </div>
                        </Link>
                        <div className="flex gap-4">
                            <button
                                className="bg-white text-black border-2 border-black rounded-md text-[12px] font-bold h-9 px-3 hover:scale-105 duration-300 transition-transform"
                                onClick={() => {
                                    setSelectedRace('');
                                    setSelectedConfidence(0);
                                    setSelectedCategory('race');
                                    setSelectedLabel('');
                                }}
                            >
                                Reset
                            </button>
                            <Link to="/">
                                <button
                                    className="bg-black text-white rounded-md text-[12px] font-bold h-9 px-3 hover:scale-105 duration-300 transition-transform"
                                >
                                    Confirm
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Summary;