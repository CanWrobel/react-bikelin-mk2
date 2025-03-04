//routeinfo.ts
export interface RouteInfo {
    startTime: string;
    startTimeUnix: number;
    startLocation: { lat: number, lng: number } | null;
    startAddress: string;
    endAddress: string;
    endLocation: { lat: number, lng: number } | null;
    arrivalTime: string;
    arrivalTimeUnix: number;
    calculateEnabled: boolean;
  }
  
  export interface RouteContextType {
    routeInfo: RouteInfo;
    setCalculateEnabled: (bool: boolean) => void;
    setStartTime: (time: string) => void;
    setStartTimeUnix: (timeUnix: number) => void;
    setArrivalTime: (arrivalTime: string) => void;
    setArrivalTimeUnix: (arrivalTimeUnix: number) => void;
    setStartLocation: (location: { lat: number, lng: number }) => void;
    setEndLocation: (location: { lat: number, lng: number }) => void;
    setStartAddress: (address: string) => void;
    setEndAddress: (address: string) => void;
  }