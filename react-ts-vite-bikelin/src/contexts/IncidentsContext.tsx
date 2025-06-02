import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Incident } from '../types/Incidents';

interface IncidentsContextType {
  incidents: Incident[];
  setIncidents: React.Dispatch<React.SetStateAction<Incident[]>>;
  toggleVisibility: () => void;
  isVisible: boolean;
}

const IncidentsContext = createContext<IncidentsContextType | undefined>(undefined);

export const IncidentsProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [isVisible, setIsVisible] = useState(true);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <IncidentsContext.Provider value={{ incidents, setIncidents, toggleVisibility, isVisible }}>
      {children}
    </IncidentsContext.Provider>
  );
};

export const useIncidents = () => {
  const context = useContext(IncidentsContext);
  if (!context) {
    throw new Error('useIncidents must be used within a IncidentsProvider');
  }
  return context;
};
