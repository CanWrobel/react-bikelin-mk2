// MapPicker.tsx
import React from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';

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
}

const MapPicker: React.FC<MapPickerProps> = ({ onSelect, onCancel }) => {
  const handleMapClick = (event) => {
    onSelect({
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    });
  };

  return (
    <div>
      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={10}
          onClick={handleMapClick}
        />
      </LoadScript>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

export default MapPicker;