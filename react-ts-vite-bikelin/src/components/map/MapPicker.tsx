import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, DirectionsRenderer } from '@react-google-maps/api';
import { useRoute } from '../../contexts/RouteContext';
import DetailedWeatherComponent from '../weather/DetailedWeatherComponent';
import DetailedWeatherComponentInTheMap from '../weather/DetailedWeatherInTheMap';
import DetailedForecastZiel from '../weather/DetailedForecastZiel';

// Global lock to prevent concurrent coordinate updates
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
    setArrivalTimeUnix
  } = useRoute();
  
  // State variables
  const [startMarker, setStartMarker] = useState<{ lat: number, lng: number } | null>(null);
  const [endMarker, setEndMarker] = useState<{ lat: number, lng: number } | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [distance, setDistance] = useState<string | null>(null);
  const [duration, setDuration] = useState<string | null>(null);
  const [startTime, setStartTimeOnForm] = useState<string>('');
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [mapZoom, setMapZoom] = useState(10);
  
  // Reference to track if a route calculation is in progress
  const isCalculatingRoute = useRef(false);
  
  // Reference to store the last calculated route points to prevent duplicate calls
  const lastRouteRequest = useRef<string | null>(null);

  // Process incoming coordinates with safety checks
 // Fix for the useEffect that processes incoming coordinates
useEffect(() => {
  if (!coordinates) return;
  
  try {
    // Prevent concurrent updates with a lock
    if (window.isCoordinateUpdateLocked) {
      console.log('Coordinate update locked, skipping this update');
      return;
    }
    
    window.isCoordinateUpdateLocked = true;
    
    // Parse coordinates with validation
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
    
    // Check if the marker already has these coordinates to prevent loop
    if (pickingType === 'start' && startMarker && 
        startMarker.lat === location.lat && 
        startMarker.lng === location.lng) {
      console.log('Start marker already has these coordinates, skipping update');
      window.isCoordinateUpdateLocked = false;
      return;
    }
    
    if (pickingType === 'end' && endMarker && 
        endMarker.lat === location.lat && 
        endMarker.lng === location.lng) {
      console.log('End marker already has these coordinates, skipping update');
      window.isCoordinateUpdateLocked = false;
      return;
    }
    
    console.log(`Setting ${pickingType} marker to:`, location);
    
    // Center map on new location
    setMapCenter(location);
    setMapZoom(14);
    
    // Update appropriate marker based on picking type
    setTimeout(() => {
      if (pickingType === 'start') {
        setStartMarker(location);
      } else {
        setEndMarker(location);
      }
      
      // Notify parent with a delay to avoid race conditions
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
    // Ensure lock is released if component unmounts during processing
    window.isCoordinateUpdateLocked = false;
  };
}, [coordinates, pickingType, onSelect, startMarker, endMarker]);

  // Calculate route when both markers are set
  useEffect(() => {
        console.log('🔵 MapPicker received coordinates:', coordinates);

    if (startMarker && endMarker) {
      const startStr = `${startMarker.lat.toFixed(6)},${startMarker.lng.toFixed(6)}`;
      const endStr = `${endMarker.lat.toFixed(6)},${endMarker.lng.toFixed(6)}`;
      const routeKey = `${startStr}|${endStr}`;
      
      // Skip if this exact route was already calculated
      if (routeKey === lastRouteRequest.current) {
        console.log('Skipping duplicate route calculation');
        return;
      }
      
      // Skip if we're already calculating a route
      if (isCalculatingRoute.current) {
        console.log('Route calculation already in progress, skipping');
        return;
      }
      
      // Update the route request reference
      lastRouteRequest.current = routeKey;
      calculateRoute(startMarker, endMarker);
    }
  }, [startMarker, endMarker]);

  // Update arrival time when duration and start time change
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

  // Handle map click with debounce
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
      
      // Debounce to prevent duplicate calls
      if (window.isCoordinateUpdateLocked) {
        console.log('Map click ignored - update already in progress');
        return;
      }
      
      window.isCoordinateUpdateLocked = true;
      
      // Update appropriate marker
      if (pickingType === 'start') {
        setStartMarker(location);
      } else {
        setEndMarker(location);
      }
      
      // Notify parent with a delay
      setTimeout(() => {
        onSelect(location);
        window.isCoordinateUpdateLocked = false;
      }, 100);
    } catch (error) {
      console.error('Error handling map click:', error);
      window.isCoordinateUpdateLocked = false;
    }
  }, [pickingType, onSelect]);

  // Calculate route between points with error handling
  const calculateRoute = useCallback((start: { lat: number, lng: number }, end: { lat: number, lng: number }) => {
    if (!start || !end) return;
    
    if (isNaN(start.lat) || isNaN(start.lng) || isNaN(end.lat) || isNaN(end.lng)) {
      console.error('Invalid coordinates for route calculation');
      return;
    }

    try {
      // Set the calculating flag to prevent duplicate calls
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
          // Reset the calculating flag
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

  // Parse duration string and calculate arrival time
  const calculateArrivalTime = (startTime: string, durationText: string): string => {
    try {
      // Parse start time
      const [startHours, startMinutes] = startTime.split(':').map(Number);
      if (isNaN(startHours) || isNaN(startMinutes)) {
        throw new Error(`Invalid start time format: ${startTime}`);
      }
      
      const startDate = new Date();
      startDate.setHours(startHours, startMinutes, 0, 0);
      
      // Parse duration text with better regex
      let totalMinutes = 0;
      
      // Handle "X hour(s) Y min" format
      const hourMatch = durationText.match(/(\d+)\s*hour/i);
      if (hourMatch && hourMatch[1]) {
        totalMinutes += parseInt(hourMatch[1], 10) * 60;
      }
      
      // Handle "Y min" format
      const minMatch = durationText.match(/(\d+)\s*min/i);
      if (minMatch && minMatch[1]) {
        totalMinutes += parseInt(minMatch[1], 10);
      }
      
      if (totalMinutes === 0) {
        console.warn(`Could not parse duration: "${durationText}"`);
        return startTime; // Return unchanged if parsing fails
      }
      
      // Calculate arrival time
      startDate.setMinutes(startDate.getMinutes() + totalMinutes);
      
      const hours = String(startDate.getHours()).padStart(2, '0');
      const minutes = String(startDate.getMinutes()).padStart(2, '0');
      return `${hours}:${minutes}`;
    } catch (error) {
      console.error('Error in calculateArrivalTime:', error);
      return startTime; // Return original on error
    }
  };

  // Handle start time change
  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartTime = e.target.value;
    setStartTimeOnForm(newStartTime);
    
    // Recalculate arrival time if we have duration
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
    setShowComponent(true); // Beim Klick wird die Komponente sichtbar
  };
  const handleLoadComponentFalse  = () => {
    setShowComponent(false); // Beim Klick wird die Komponente sichtbar
  };


  return (
    
    <div className="space-y-4">
            {showComponent && <DetailedWeatherComponentInTheMap />}
            {showComponent && <DetailedForecastZiel />}

            {showComponent && 
            <button
            onClick={handleLoadComponentFalse}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Wettervorhersage ausblenden
          </button>
            }
            

      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
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
          {startMarker && <Marker position={startMarker} label="S" />}
          {endMarker && <Marker position={endMarker} label="E" />}
          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
      </LoadScript>


      <div className="space-y-2">
        <div className="flex gap-4">
          <div className="flex-1">

          <button
        onClick={handleLoadComponentTrue}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Lade Komponente
      </button>
            <p className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
  Startzeit: {routeInfo.startTime}
</p>

            {/* <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
              Startzeit
            </label>
            <input
              type="time"
              id="startTime"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={startTime}
              onChange={handleStartTimeChange}
            /> */}
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