import React, { createContext, useContext, useState } from 'react';

const CameraContext = createContext();

export const CameraProvider = ({ children }) => {
    const [isCameraViewActive, setIsCameraViewActive] = useState(false);
    const [navbarText, setNavbarText] = useState('');

    return (
        <CameraContext.Provider value={{ isCameraViewActive, setIsCameraViewActive, navbarText, setNavbarText }}>
            {children}
        </CameraContext.Provider>
    );
};

export const useCamera = () => useContext(CameraContext);