import React, { useEffect, useState } from 'react';
import {
  GoogleMap,
  LoadScript,
  Marker,
  MarkerClusterer
} from '@react-google-maps/api';
import { Incident } from '../../types/Incident';

const containerStyle = {
  width: '100%',
  height: '500px'
};

const center = {
  lat: 52.5200,
  lng: 13.4050
};

const options = {
  imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
};

const MapComponent: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);

  useEffect(() => {
    fetch('http://141.45.146.183:8080/bikelin/api/incidents')
      .then(response => response.json())
      .then(data => {
        console.log("Geladene Incidents:", data); // Prüfe, was tatsächlich geladen wird
        setIncidents(data);
      })
      .catch(error => console.error('Error fetching incidents:', error));
  }, []);

  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
      >
        <MarkerClusterer options={options}>
          {clusterer => (
            <React.Fragment>  {/* Verwende ein Fragment, um das Array von Markern zu umschließen */}
              {incidents.map((incident) => (
                <Marker
                  key={incident._id}
                  position={{ lat: incident.latitude, lng: incident.longitude }}
                  clusterer={clusterer}
                />
              ))}
            </React.Fragment>
          )}
        </MarkerClusterer>
      </GoogleMap>
    </LoadScript>
  );
}

export default MapComponent;
