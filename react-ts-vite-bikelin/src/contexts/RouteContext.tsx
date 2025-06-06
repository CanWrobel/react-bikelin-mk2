import React, { createContext, useState, useContext, ReactNode } from 'react';
import { RouteInfo, RouteContextType } from '../types/RouteTypes';

const defaultRouteInfo: RouteInfo = {
  startTime: 'default',
  startTimeUnix: 0,
  startLocation: null,
  startAddress: 'start',
  endAddress: 'end',
  endLocation: null,
  arrivalTime: '',
  arrivalTimeUnix: 0,
  calculateEnabled: false,
};

const defaultContextValue: RouteContextType = {
  routeInfo: defaultRouteInfo,
  setCalculateEnabled: () => {},
  setStartTime: () => {},
  setStartTimeUnix: () => {},
  setArrivalTime: () => {}, 
  setArrivalTimeUnix: () => {},
  setStartLocation: () => {},
  setEndLocation: () => {},
  setStartAddress: () => {},
  setEndAddress: () => {}
};

export const RouteContext = createContext<RouteContextType>(defaultContextValue);

export const useRoute = () => useContext(RouteContext);

export const RouteProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [routeInfo, setRouteInfo] = useState<RouteInfo>(defaultRouteInfo);

  const setStartTime = (time: string) => {
    setRouteInfo(prev => ({ ...prev, startTime: time }));
  };
  const setStartTimeUnix = (timeUnix: number) => {
    setRouteInfo(prev => ({ ...prev, startTimeUnix: timeUnix }));
  };

  const setArrivalTime = (arrivalTime: string) => {
    setRouteInfo(prev => ({ ...prev, arrivalTime }));
  };

  const setArrivalTimeUnix = (arrivalTimeUnix: number) => {
    setRouteInfo(prev => ({ ...prev, arrivalTimeUnix: arrivalTimeUnix }));
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
  const setCalculateEnabled = (bool: boolean) => {
    setRouteInfo(prev => ({
        ...prev,
        calculateEnabled: bool
    }));
};


  return (
    <RouteContext.Provider value={{
      routeInfo,
      setCalculateEnabled,
      setStartTime,
      setArrivalTimeUnix,
      setArrivalTime,  
      setStartTimeUnix,
      setStartLocation,
      setEndLocation,
      setStartAddress,
      setEndAddress
    }}>
      {children}
    </RouteContext.Provider>
  );
};
