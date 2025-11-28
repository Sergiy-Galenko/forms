import { createContext, useContext, useState, useEffect } from 'react';

const ExperienceContext = createContext();

export const useExperience = () => {
  const context = useContext(ExperienceContext);
  if (!context) {
    throw new Error('useExperience must be used within ExperienceProvider');
  }
  return context;
};

export const ExperienceProvider = ({ children }) => {
  const [experience, setExperience] = useState({
    guidedMode: true, // Default to true for "simple and convenient"
    showHints: true
  });

  const toggleGuidedMode = () => {
    setExperience(prev => ({
      ...prev,
      guidedMode: !prev.guidedMode
    }));
  };

  const value = {
    experience,
    toggleGuidedMode
  };

  return (
    <ExperienceContext.Provider value={value}>
      {children}
    </ExperienceContext.Provider>
  );
};
