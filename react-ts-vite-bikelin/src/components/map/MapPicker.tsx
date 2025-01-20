import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';

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
  onRouteWeather?: (startMarker: { lat: number, lng: number }, 
                    endMarker: { lat: number, lng: number }, 
                    duration: string) => void;
}

const MapPicker: React.FC<MapPickerProps> = ({
  onSelect,
  onCancel,
  pickingType,
  coordinates,
  onRouteWeather
}) => {
  const [startMarker, setStartMarker] = useState<{lat: number, lng: number} | null>(null);
  const [endMarker, setEndMarker] = useState<{lat: number, lng: number} | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [distance, setDistance] = useState<string | null>(null);
  const [duration, setDuration] = useState<string | null>(null);

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

  const handleMapClick = (event: google.maps.MouseEvent) => {
    const location = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    };
    if (pickingType === 'start') {
      setStartMarker(location);
      if (endMarker) {
        fetchRoute(location, endMarker);
      }
    } else {
      setEndMarker(location);
      if (startMarker) {
        fetchRoute(startMarker, location);
      }
    }
   
    onSelect(location);
  };

  const handleGetRouteWeather = () => {
    if (startMarker && endMarker && duration && onRouteWeather) {
      onRouteWeather(startMarker, endMarker, duration);
    }
  };

  const fetchRoute = (start: {lat: number, lng: number}, end: {lat: number, lng: number}) => {
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
          setDistance(route.legs[0].distance.text);
          setDuration(route.legs[0].duration.text);
        } else {
          console.error(`Error fetching directions ${result}`);
          setDistance(null);
          setDuration(null);
        }
      }
    );
  };

  return (
    <div>
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
      {distance && duration && (
        <div>
          <p>Distance: {distance}</p>
          <p>Duration: {duration}</p>
          {startMarker && endMarker && (
            <button
              onClick={handleGetRouteWeather}
              style={{
                padding: '10px 20px',
                margin: '10px 0',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Get Route Weather Forecast
            </button>
          )}
        </div>
      )}
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

export default MapPicker;