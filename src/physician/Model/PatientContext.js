import React, { createContext, useState } from 'react';

export const PatientContext = createContext();

export const PatientProvider = ({ children }) => {
    const [selectedPatient, setSelectedPatient] = useState(null);

    return (
        <PatientContext.Provider value={{ selectedPatient, setSelectedPatient }}>
            {children}
        </PatientContext.Provider>
    );
};
