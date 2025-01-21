export const RouteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [routeInfo, setRouteInfo] = useState<RouteInfo>(defaultRouteInfo);
  
    const setStartTime = (time: string) => {
      setRouteInfo(prev => ({ ...prev, startTime: time }));
    };
  
    const setDuration = (duration: string) => {
      setRouteInfo(prev => ({ ...prev, duration }));
    };
  
    const setStartLocation = (location: { lat: number, lng: number }) => {
      setRouteInfo(prev => ({ ...prev, startLocation: location }));
    };
  
    const setEndLocation = (location: { lat: number, lng: number }) => {
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
  