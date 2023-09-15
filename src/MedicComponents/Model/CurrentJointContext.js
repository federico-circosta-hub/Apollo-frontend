import React, { createContext, useState } from 'react';

export const CurrentJointContext = createContext();

export const CurrentJointProvider = ({ children }) => {
    const [currentJoint, setCurrentJoint] = useState(null);

    return (
        <CurrentJointContext.Provider value={{ currentJoint, setCurrentJoint }}>
            {children}
        </CurrentJointContext.Provider>
    );
};
