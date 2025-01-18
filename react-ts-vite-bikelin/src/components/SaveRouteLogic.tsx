// SaveRouteLogic.tsx

import { RouteData } from '../types/RouteData';

export const toggleSaveRoute = (routeData: RouteData, setRouteData: Function) => {
    setRouteData((prev: RouteData) => ({ ...prev, saveRoute: !prev.saveRoute }));
  };