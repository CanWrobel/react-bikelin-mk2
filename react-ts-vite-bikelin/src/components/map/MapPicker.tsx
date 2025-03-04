import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, DirectionsRenderer } from '@react-google-maps/api';
import { useRoute } from '../../contexts/RouteContext';

const containerStyle = {
  width: '100%',
  height: '50vh'
};

const center = {
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
    setStartTimeUnix 
  } = useRoute();
  
  const [startMarker, setStartMarker] = useState<{ lat: number, lng: number } | null>(null);
  const [endMarker, setEndMarker] = useState<{ lat: number, lng: number } | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [distance, setDistance] = useState<string | null>(null);
  const [duration, setDuration] = useState<string | null>(null);
  const [startTime, setStartTimeOnForm] = useState<string>('');

  useEffect(() => {
    if (coordinates) {
      const [lat, lng] = coordinates.split(',').map(Number);
      const location = { lat, lng };

      if (pickingType === 'start') {
        setStartMarker(location);
      } else {
        setEndMarker(location);
      }
      onSelect(location);
    }
  }, [coordinates, pickingType]);

  useEffect(() => {
    if (startMarker && endMarker) {
      fetchRoute(startMarker, endMarker);
    }
  }, [startMarker, endMarker]);

  useEffect(() => {
    // Ankunftszeit automatisch setzen, wenn Dauer und Startzeit vorhanden sind
    if (duration && startTime) {
      const arrivalTime = calculateArrivalTime(startTime, duration);
      setArrivalTime(arrivalTime);
    }
  }, [duration, startTime]);

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    const location = {
      lat: event.latLng?.lat() ?? 0,
      lng: event.latLng?.lng() ?? 0
    };

    if (pickingType === 'start') {
      setStartMarker(location);
    } else {
      setEndMarker(location);
    }

    onSelect(location);
  };

  const fetchRoute = (start: { lat: number, lng: number }, end: { lat: number, lng: number }) => {
    if (!start || !end) return;

    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.BICYCLING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          setDirections(result);
          const route = result.routes[0];
          setDistance(route.legs[0].distance?.text || '');
          setDuration(route.legs[0].duration?.text || '');
          console.log('Full directions object:', result);
          setArrivalTimeUnix(routeInfo.startTimeUnix + (route.legs[0].duration?.value || 0))
          const hours = String(new Date(routeInfo.arrivalTimeUnix * 1000).getHours()).padStart(2, '0');
          const minutes = String(new Date(routeInfo.arrivalTimeUnix * 1000).getMinutes()).padStart(2, '0');
          
          setArrivalTime(`${hours}:${minutes}`);        } else {
          console.error(`Error fetching directions: ${status}`);
          setDistance(null);
          setDuration(null);
        }
      }
    );
  };

  const calculateArrivalTime = (startTime: string, duration: string) => {
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const startDate = new Date();
    startDate.setHours(startHours, startMinutes);

    const durationMatch = duration.match(/(\d+)\s*min|(\d+)\s*hour/gi);
    let totalMinutes = 0;

    if (durationMatch) {
      durationMatch.forEach((part) => {
        if (part.includes('hour')) {
          totalMinutes += parseInt(part) * 60;
        } else if (part.includes('min')) {
          totalMinutes += parseInt(part);
        }
      });
    }

    startDate.setMinutes(startDate.getMinutes() + totalMinutes);

    const hours = String(startDate.getHours()).padStart(2, '0');
    const minutes = String(startDate.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <div className="space-y-4">
      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={10}
          onClick={handleMapClick}
        >
          {startMarker && <Marker position={startMarker} label="S" />}
          {endMarker && <Marker position={endMarker} label="E" />}
          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
      </LoadScript>

      <div className="space-y-2">
        <div className="flex gap-4">
          <div className="flex-1">
            <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
              Startzeit
            </label>
            <input
              type="time"
              id="startTime"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={startTime}
              onChange={(e) => setStartTimeOnForm(e.target.value)}
            />
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
