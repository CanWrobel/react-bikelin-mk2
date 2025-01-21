export interface RouteInfo {
    startTime: string;
    startLocation: { lat: number, lng: number } | null;
    startAddress: string;
    endAddress: string;
    endLocation: { lat: number, lng: number } | null;
    duration: string;
  }
  
  export interface RouteContextType {
    routeInfo: RouteInfo;
    setStartTime: (time: string) => void;
    setDuration: (duration: string) => void;
    setStartLocation: (location: { lat: number, lng: number }) => void;
    setEndLocation: (location: { lat: number, lng: number }) => void;
    setStartAddress: (address: string) => void;
    setEndAddress: (address: string) => void;
  }