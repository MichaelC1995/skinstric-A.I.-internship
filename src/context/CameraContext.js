import React, { createContext, useContext, useState } from 'react';

const CameraContext = createContext();

export const CameraProvider = ({ children }) => {
    const [isCameraViewActive, setIsCameraViewActive] = useState(false);

    return (
        <CameraContext.Provider value={{ isCameraViewActive, setIsCameraViewActive }}>
            {children}
        </CameraContext.Provider>
    );
};

export const useCamera = () => useContext(CameraContext);