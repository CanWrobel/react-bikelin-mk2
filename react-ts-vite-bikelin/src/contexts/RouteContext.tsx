import React, { createContext, useState, useContext, ReactNode } from 'react';
import { RouteInfo, RouteContextType } from '../types/RouteTypes';

// Standardwerte für die RouteInfo
const defaultRouteInfo: RouteInfo = {
  startTime: 'default',
  startLocation: null,
  startAddress: 'start',
  endAddress: 'end',
  endLocation: null,
  duration: ''
};

// Standardwerte für den Context
const defaultContextValue: RouteContextType = {
  routeInfo: defaultRouteInfo,
  setStartTime: () => {},
  setDuration: () => {},
  setStartLocation: () => {},
  setEndLocation: () => {},
  setStartAddress: () => {},
  setEndAddress: () => {}
};

// Erstelle den Context mit den Standardwerten
export const RouteContext = createContext<RouteContextType>(defaultContextValue);

// Custom Hook für einfacheren Zugriff auf den Context
export const useRoute = () => useContext(RouteContext);

// RouteProvider-Komponente für den gesamten App-Wrapper
export const RouteProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [routeInfo, setRouteInfo] = useState<RouteInfo>(defaultRouteInfo);

  // Setter-Funktionen für das Aktualisieren des Routenstatus
  const setStartTime = (time: string) => {
    setRouteInfo(prev => ({ ...prev, startTime: time }));
  };

  const setDuration = (duration: string) => {
    setRouteInfo(prev => ({ ...prev, duration }));
  };

  const setStartLocation = (location: { lat: number; lng: number }) => {
    setRouteInfo(prev => ({ ...prev, startLocation: location }));
  };

  const setEndLocation = (location: { lat: number; lng: number }) => {
    setRouteInfo(prev => ({ ...prev, endLocation: location }));
  };

  const setStartAddress = (address: string) => {
    setRouteInfo(prev => ({ ...prev, startAddress: address }));
  };

  const setEndAddress = (address: string) => {
    setRouteInfo(prev => ({ ...prev, endAddress: address }));
  };

  return (
    <RouteContext.Provider value={{
      routeInfo,
      setStartTime,
      setDuration,
      setStartLocation,
      setEndLocation,
      setStartAddress,
      setEndAddress
    }}>
      {children}
    </RouteContext.Provider>
  );
};
