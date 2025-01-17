import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: 52.52,
  lng: 13.405
};

interface MapPickerProps {
  onSelect: (location: { lat: number, lng: number }) => void;
  onCancel: () => void;
  pickingType: 'start' | 'end';
}

const MapPicker: React.FC<MapPickerProps> = ({ onSelect, onCancel, pickingType }) => {
  const [startMarker, setStartMarker] = useState<{lat: number, lng: number} | null>(null);
  const [endMarker, setEndMarker] = useState<{lat: number, lng: number} | null>(null);

  const handleMapClick = (event: google.maps.MouseEvent) => {
    const location = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    };

    if (pickingType === 'start') {
      setStartMarker(location);
    } else {
      setEndMarker(location);
    }
    
    onSelect(location);
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
          {startMarker && (
            <Marker
              position={startMarker}
              label="S"
            />
          )}
          {endMarker && (
            <Marker
              position={endMarker}
              label="E"
            />
          )}
        </GoogleMap>
      </LoadScript>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

export default MapPicker;