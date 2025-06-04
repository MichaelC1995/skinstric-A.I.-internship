import React, { createContext, useContext, useState, useEffect } from 'react';

const AnalysisContext = createContext();

export const AnalysisProvider = ({ children }) => {
    const [analysisData, setAnalysisDataState] = useState(null);

    useEffect(() => {
        const storedData = localStorage.getItem('analysisData');
        if (storedData) {
            setAnalysisDataState(JSON.parse(storedData));
        }
    }, []);

    const setAnalysisData = (data) => {
        setAnalysisDataState(data);
        localStorage.setItem('analysisData', JSON.stringify(data));
    };

    return (
        <AnalysisContext.Provider value={{ analysisData, setAnalysisData }}>
            {children}
        </AnalysisContext.Provider>
    );
};

export const useAnalysis = () => useContext(AnalysisContext);
