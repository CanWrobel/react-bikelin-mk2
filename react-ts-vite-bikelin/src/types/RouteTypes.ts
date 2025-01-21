//routeinfo.ts
export interface RouteInfo {
    startTime: string;
    startLocation: { lat: number, lng: number } | null;
    startAddress: string;
    endAddress: string;
    endLocation: { lat: number, lng: number } | null;
    arrivalTime: string;
  }
  
  export interface RouteContextType {
    routeInfo: RouteInfo;
    setStartTime: (time: string) => void;
    setArrivalTime: (arrivalTime: string) => void;
    setStartLocation: (location: { lat: number, lng: number }) => void;
    setEndLocation: (location: { lat: number, lng: number }) => void;
    setStartAddress: (address: string) => void;
    setEndAddress: (address: string) => void;
  }