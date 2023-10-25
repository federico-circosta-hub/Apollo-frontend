import React, { createContext, useState } from "react";

export const StepContext = createContext();

export const StepProvider = ({ children }) => {
  const [completedStep, setCompletedStep] = useState({});

  return (
    <StepContext.Provider value={{ completedStep, setCompletedStep }}>
      {children}
    </StepContext.Provider>
  );
};
