import React, { createContext, useState } from 'react';

export const NewVisitContext = createContext();

export const NewVisitProvider = ({ children }) => {
    const [newVisit, setNewVisit] = useState(null);

    return (
        <NewVisitContext.Provider value={{ newVisit, setNewVisit }}>
            {children}
        </NewVisitContext.Provider>
    );
};
