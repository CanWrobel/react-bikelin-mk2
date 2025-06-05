// @ts-nocheck

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, DirectionsRenderer } from '@react-google-maps/api';
import { useRoute } from '../../contexts/RouteContext';
import DetailedWeatherComponentInTheMap from '../weather/DetailedWeatherInTheMap';
import DetailedForecastZiel from '../weather/DetailedForecastZiel';
import { useUser } from '../../contexts/UserContext';



declare global {
  interface Window {
    isCoordinateUpdateLocked?: boolean;
  }
}

const containerStyle = {
  width: '100%',
  height: '50vh'
};

const defaultCenter = {
  lat: 52.52,
  lng: 13.405
};

interface MapPickerProps {
  onSelect: (location: { lat: number, lng: number }) => void;
  onCancel: () => void;
  pickingType: 'start' | 'end';
  coordinates?: string;
}

const MapPicker: React.FC<MapPickerProps> = ({
  onSelect,
  onCancel,
  pickingType,
  coordinates
}) => {
  const { 
    routeInfo, 
    setArrivalTime, 
    setArrivalTimeUnix,
    setCalculateEnabled,

  } = useRoute();
  const [purpleMarkers, setPurpleMarkers] = useState<{ lat: number; lng: number }[]>([]);

  const [startMarker, setStartMarker] = useState<{ lat: number, lng: number } | null>(null);
  const [endMarker, setEndMarker] = useState<{ lat: number, lng: number } | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [distance, setDistance] = useState<string | null>(null);
  const [duration, setDuration] = useState<string | null>(null);
  const [startTime, setStartTimeOnForm] = useState<string>('');
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [mapZoom, setMapZoom] = useState(10);
  const [incidents, setIncidents] = useState<Incident[]>([]);

  const isCalculatingRoute = useRef(false);
  
  const lastRouteRequest = useRef<string | null>(null);
  const { token } = useUser();

useEffect(() => {
  if (!coordinates) return;
  
  try {
    if (window.isCoordinateUpdateLocked) {
      console.log('Coordinate update locked, skipping this update');
      return;
    }
    
    window.isCoordinateUpdateLocked = true;
    
    const parts = coordinates.split(',');
    if (parts.length !== 2) {
      console.error(`Invalid coordinates format: ${coordinates}`);
      window.isCoordinateUpdateLocked = false;
      return;
    }
    
    const lat = parseFloat(parts[0]);
    const lng = parseFloat(parts[1]);
    
    if (isNaN(lat) || isNaN(lng)) {
      console.error(`Invalid coordinates values: lat=${lat}, lng=${lng}`);
      window.isCoordinateUpdateLocked = false;
      return;
    }
    
    const location = { lat, lng };
    
    if (pickingType === 'start' && startMarker && 
        startMarker.lat === location.lat && 
        startMarker.lng === location.lng) {
      console.log('Start marker already has these coordinates, skipping update');
      window.isCoordinateUpdateLocked = false;
      setCalculateEnabled(false)
      return;
    }
    
    if (pickingType === 'end' && endMarker && 
        endMarker.lat === location.lat && 
        endMarker.lng === location.lng) {
      console.log('End marker already has these coordinates, skipping update');
      window.isCoordinateUpdateLocked = false;
      setCalculateEnabled(false)
      return;
    }
    
    console.log(`Setting ${pickingType} marker to:`, location);
    
    setMapCenter(location);
    setMapZoom(14);
    
    setTimeout(() => {
      if (pickingType === 'start') {
        setStartMarker(location);
      } else {
        setEndMarker(location);
      }
      
      setTimeout(() => {
        onSelect(location);
        window.isCoordinateUpdateLocked = false;
      }, 100);
    }, 200);
  } catch (error) {
    console.error('Error processing coordinates:', error);
    window.isCoordinateUpdateLocked = false;
  }
  
  return () => {
    window.isCoordinateUpdateLocked = false;
  };
}, [coordinates, pickingType, onSelect, startMarker, endMarker]);

  useEffect(() => {
        console.log('🔵 MapPicker received coordinates:', coordinates);
        if (!routeInfo.calculateEnabled) {
          console.log('🔒 Route calculation is disabled.');
          return;
        }    if (startMarker && endMarker) {
      const startStr = `${startMarker.lat.toFixed(6)},${startMarker.lng.toFixed(6)}`;
      const endStr = `${endMarker.lat.toFixed(6)},${endMarker.lng.toFixed(6)}`;
      const routeKey = `${startStr}|${endStr}`;
      
      if (routeKey === lastRouteRequest.current) {
        console.log('Skipping duplicate route calculation');
        return;
      }
      
      if (isCalculatingRoute.current) {
        console.log('Route calculation already in progress, skipping');
        return;
      }
      
      lastRouteRequest.current = routeKey;
      calculateRoute(startMarker, endMarker);
      setCalculateEnabled(false)
    }
  }, [startMarker, endMarker, routeInfo.calculateEnabled]);

  useEffect(() => {
    if (duration && startTime) {
      try {
        const arrivalTime = calculateArrivalTime(startTime, duration);
        setArrivalTime(arrivalTime);
      } catch (error) {
        console.error('Error calculating arrival time:', error);
      }
    }
  }, [duration, startTime, setArrivalTime]);

  const handleMapClick = useCallback((event: google.maps.MapMouseEvent) => {
    try {
      if (!event.latLng) {
        console.error('Invalid map click event: No latLng property');
        return;
      }
      
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      
      if (isNaN(lat) || isNaN(lng)) {
        console.error(`Invalid coordinates from map click: lat=${lat}, lng=${lng}`);
        return;
      }
      
      const location = { lat, lng };
      
      if (window.isCoordinateUpdateLocked) {
        console.log('Map click ignored - update already in progress');
        return;
      }
      
      window.isCoordinateUpdateLocked = true;
      
      if (pickingType === 'start') {
        setStartMarker(location);
      } else {
        setEndMarker(location);
      }
      
      setTimeout(() => {
        onSelect(location);
        window.isCoordinateUpdateLocked = false;
      }, 100);
    } catch (error) {
      console.error('Error handling map click:', error);
      window.isCoordinateUpdateLocked = false;
    }
  }, [pickingType, onSelect]);

  const calculateRoute = useCallback((start: { lat: number, lng: number }, end: { lat: number, lng: number }) => {
    if (!start || !end) return;
    
    if (isNaN(start.lat) || isNaN(start.lng) || isNaN(end.lat) || isNaN(end.lng)) {
      console.error('Invalid coordinates for route calculation');
      return;
    }

    try {
      isCalculatingRoute.current = true;
      console.log('Calculating route...', start, end);
      
      const directionsService = new google.maps.DirectionsService();
      directionsService.route(
        {
          origin: start,
          destination: end,
          travelMode: google.maps.TravelMode.BICYCLING,
        },
        (result, status) => {
          isCalculatingRoute.current = false;
          
          if (status === google.maps.DirectionsStatus.OK && result) {
            setDirections(result);
            
            try {
              const route = result.routes[0];
              if (!route || !route.legs || route.legs.length === 0) {
                console.error('Invalid route result structure');
                return;
              }
              
              const leg = route.legs[0];
              setDistance(leg.distance?.text || '');
              setDuration(leg.duration?.text || '');
              
              if (routeInfo && typeof routeInfo.startTimeUnix === 'number') {
                const durationValue = leg.duration?.value || 0;
                const arrivalUnix = routeInfo.startTimeUnix + durationValue;
                setArrivalTimeUnix(arrivalUnix);
                
                const arrivalDate = new Date(arrivalUnix * 1000);
                const hours = String(arrivalDate.getHours()).padStart(2, '0');
                const minutes = String(arrivalDate.getMinutes()).padStart(2, '0');
                setArrivalTime(`${hours}:${minutes}`);
              }
            } catch (err) {
              console.error('Error processing directions result:', err);
            }
          } else {
            console.error(`Error fetching directions: ${status}`);
            setDistance(null);
            setDuration(null);
          }
        }
      );
    } catch (error) {
      console.error('Error calling directions service:', error);
      isCalculatingRoute.current = false;
    }
  }, [routeInfo, setArrivalTime, setArrivalTimeUnix]);

  
  const calculateArrivalTime = (startTime: string, durationText: string): string => {
    try {
      
      const [startHours, startMinutes] = startTime.split(':').map(Number);
      if (isNaN(startHours) || isNaN(startMinutes)) {
        throw new Error(`Invalid start time format: ${startTime}`);
      }
      
      const startDate = new Date();
      startDate.setHours(startHours, startMinutes, 0, 0);
      
      
      let totalMinutes = 0;
      
      
      const hourMatch = durationText.match(/(\d+)\s*hour/i);
      if (hourMatch && hourMatch[1]) {
        totalMinutes += parseInt(hourMatch[1], 10) * 60;
      }
      
      
      const minMatch = durationText.match(/(\d+)\s*min/i);
      if (minMatch && minMatch[1]) {
        totalMinutes += parseInt(minMatch[1], 10);
      }
      
      if (totalMinutes === 0) {
        console.warn(`Could not parse duration: "${durationText}"`);
        return startTime;
      }
      
      
      startDate.setMinutes(startDate.getMinutes() + totalMinutes);
      
      const hours = String(startDate.getHours()).padStart(2, '0');
      const minutes = String(startDate.getMinutes()).padStart(2, '0');
      return `${hours}:${minutes}`;
    } catch (error) {
      console.error('Error in calculateArrivalTime:', error);
      return startTime; 
    }
  };

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartTime = e.target.value;
    setStartTimeOnForm(newStartTime);
    
    if (duration) {
      try {
        const arrivalTime = calculateArrivalTime(newStartTime, duration);
        setArrivalTime(arrivalTime);
      } catch (error) {
        console.error('Error updating arrival time:', error);
      }
    }
  };

  const [showComponent, setShowComponent] = useState(false);
  const handleLoadComponentTrue = () => {
    setShowComponent(true); 
  };
  const handleLoadComponentFalse = () => {
    const container = document.querySelector('.container');
    if (container) {
      container.style.overflow = 'auto'; // oder 'scroll' je nach Wunsch
      container.style.height = 'auto';   // wichtig, sonst bleibt 100vh bestehen
    }
  
    setShowComponent(false);
  };

  const openGoogleMapsRoute = (start: { lat: number; lng: number }, end: { lat: number; lng: number }) => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${start.lat},${start.lng}&destination=${end.lat},${end.lng}&travelmode=bicycling`;
    window.open(url, '_blank');
  };
  const addPurpleMarker = async () => {
    const newMarker = {
      lat: mapCenter.lat,
      lng: mapCenter.lng,
    };
  
    setPurpleMarkers(prev => [...prev, newMarker]);
  
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/purplemarkers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // nur wenn nötig
        },
        body: JSON.stringify(newMarker),
      });
  
      if (!response.ok) {
        throw new Error(`Fehler vom Server: ${response.status}`);
      }
  
      console.log('Marker erfolgreich gesendet!');
    } catch (err) {
      console.error('Fehler beim Senden des Markers:', err);
    }
  };
  const loadIncidents = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/incidents`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      setIncidents(data);
    } catch (error) {
      console.error('Fehler beim Laden der Incidents:', error);
    }
  };
  
  
  return (
    
    <div className="space-y-4">



            
<GoogleMap
  mapContainerStyle={containerStyle}
  center={mapCenter}
  zoom={mapZoom}
  onClick={handleMapClick}
  options={{
    fullscreenControl: false,
    mapTypeControl: true,
    streetViewControl: false,
    zoomControl: true
  }}
>
  {/* Start- und Endmarker */}
  {startMarker && <Marker position={startMarker} label="" />}
  {endMarker && <Marker position={endMarker} label="" />}

  {/* Lila Incident-Marker vom Backend */}
  {incidents.map((incident, index) => (
    <Marker
      key={`incident-${incident._id || index}`}
      position={{ lat: incident.latitude, lng: incident.longitude }}
      icon={{
        path: google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: '#800080',
        fillOpacity: 1,
        strokeWeight: 1,
        strokeColor: '#660066',
      }}
    />
  ))}

  {/* Routenanzeige */}
  {directions && <DirectionsRenderer directions={directions} />}
</GoogleMap>


      {showComponent && 
            <button
            onClick={handleLoadComponentFalse}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Wettervorhersage für Start und Ziel ausblenden
          </button>
            }
<div className="flex gap-4">
    {showComponent && <DetailedWeatherComponentInTheMap />}
    {showComponent && <DetailedForecastZiel />}
</div>


      <div className="space-y-2">
        <div className="flex gap-4">
          <div className="flex-1">
        { !showComponent &&
          <button
        onClick={handleLoadComponentTrue}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Wettervorhersage für Start und Ziel einblenden
      </button> }

      <button
  onClick={loadIncidents}
  className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
>
  Incidents anzeigen
</button>







            <p className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
  Startzeit: {routeInfo.startTime}
</p>


          </div>
          <div className="flex-1">
            <label htmlFor="arrivalTime" className="block text-sm font-medium text-gray-700">
              Ankunftszeit
            </label>
            <input
              type="time"
              id="arrivalTime"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={routeInfo.arrivalTime}
              readOnly
            />
            <br></br>
          </div>
        </div>
      </div>

      {distance && duration && (
        <div className="space-y-2">
          <p>Distanz: {distance}</p>
          <p>Dauer: {duration}</p>
        </div>
      )}
      <br />
      <button
  onClick={() => openGoogleMapsRoute(startMarker!, endMarker!)}
  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
>
  Route in Google Maps öffnen
</button>
      <br />
      <button
        onClick={onCancel}
        className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        
      >
        Abbrechen
      </button>
    </div>
  );
};

export default MapPicker;