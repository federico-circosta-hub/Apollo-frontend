import React, { createContext, useState } from 'react';

export const VisitContext = createContext();

export const VisitProvider = ({ children }) => {
    const [selectedVisit, setSelectedVisit] = useState(null);

    return (
        <VisitContext.Provider value={{ selectedVisit, setSelectedVisit }}>
            {children}
        </VisitContext.Provider>
    );
};
