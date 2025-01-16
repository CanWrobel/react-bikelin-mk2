import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow, DirectionsRenderer } from '@react-google-maps/api';
import { Incident } from '../../types/Incidents';
import { useUser } from '../../contexts/UserContext'; // Authentifizierungsstatus

const containerStyle = {
  width: '100%',
  height: '100vh'
};

const center = {
  lat: 52.52,
  lng: 13.405
};

const MapComponent: React.FC = () => {
  const { token } = useUser(); // Authentifizierungsstatus
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [markers, setMarkers] = useState([]);
  const [directions, setDirections] = useState(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    const initializeMap = async () => {
      // Simuliere Verzögerung oder prüfe, ob API-Schlüssel verfügbar sind
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMapReady(true);
    };
  
    initializeMap();
  }, []);

  useEffect(() => {
    if (!token) return; // Abruf überspringen, wenn nicht authentifiziert
    const fetchIncidents = async () => {
      try {
        const response = await fetch('http://141.45.146.183:8080/bikelin/api/incidents', {
          headers: { Authorization: `Bearer ${token}` }, // Authentifizierung hinzufügen
        });
        const data = await response.json();
        console.log("Geladene Incidents:", data);

        // Künstliche Verzögerung
        await new Promise(resolve => setTimeout(resolve, 350));

        setIncidents(data);
      } catch (error) {
        console.error('Error fetching incidents:', error);
      }
    };

    fetchIncidents();
  }, [token]);

  const handleMapClick = (event) => {
    const newMarker = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    };
    setMarkers([...markers, newMarker]);
  };

  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        onClick={handleMapClick}
      >
        {token && incidents.map((incident) => ( // Nur anzeigen, wenn authentifiziert
          <Marker
            key={incident._id}
            position={{ lat: incident.latitude, lng: incident.longitude }}
            onClick={() => setSelectedIncident(incident)}
          />
        ))}
        {selectedIncident && (
          <InfoWindow
            position={{ lat: selectedIncident.latitude, lng: selectedIncident.longitude }}
            onCloseClick={() => setSelectedIncident(null)}
          >
            <div style={{ color: 'black', fontSize: '16px', maxWidth: '300px' }}>
              <h2>{selectedIncident.title}</h2>
              <p>{selectedIncident.description}</p>
              <p><strong>Datum:</strong> {selectedIncident.date} um {selectedIncident.time}</p>
              <p><strong>Adresse:</strong> {selectedIncident.street}, {selectedIncident.zip} {selectedIncident.city}</p>
              <p><strong>Gefahrenstufe:</strong> {selectedIncident.dangerLevel}</p>
              <p><strong>Kategorie:</strong> {selectedIncident.category} ({selectedIncident.timeCategory})</p>
              {selectedIncident.username && <p><strong>Eingereicht von:</strong> {selectedIncident.username}</p>}
              {selectedIncident.image && <p><strong>Bild:</strong> <img src={`http://141.45.146.183:8080/bikelin/api/image/${selectedIncident.image}`} alt="Incident" style={{ width: '100%' }} /></p>}
            </div>
          </InfoWindow>
        )}
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;
