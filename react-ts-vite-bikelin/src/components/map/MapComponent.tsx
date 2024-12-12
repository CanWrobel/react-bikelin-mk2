import React from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

console.log('API Key:', apiKey); // zum Testen, ob der Key geladen wird


const containerStyle = {
  width: '100%', // volle Breite für mobile Ansichten
  height: '1000px' // Höhe der Karte anpassen
};

const center = {
  lat: 52.5200, // Koordinaten für Berlin
  lng: 13.4050
};

const MapComponent: React.FC = () => {
  return (
    <LoadScript
      googleMapsApiKey={apiKey}
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10} // Anpassbar für die gewünschte Anfangsvergrößerung
      >
        {/* Hier könnten weitere Elemente wie Marker oder Routen eingefügt werden */}
      </GoogleMap>
    </LoadScript>
  );
}

export default MapComponent;
