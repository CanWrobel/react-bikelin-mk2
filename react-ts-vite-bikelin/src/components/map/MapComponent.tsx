import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { Incident } from '../../types/Incidents'; // Stelle sicher, dass der Pfad zu deiner Incident-Typdefinition korrekt ist.

const containerStyle = {
  width: '100%',
  height: '100vh'  // Setze die Höhe auf 100% des Viewport Height
};

const center = {
  lat: 52.5200,  // Zentrum der Karte (Berlin)
  lng: 13.4050
};

const MapComponent: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  useEffect(() => {
    fetch('http://141.45.146.183:8080/bikelin/api/incidents')
      .then(response => response.json())
      .then(data => {
        console.log("Geladene Incidents:", data);  // Logging der geladenen Daten zur Überprüfung
        setIncidents(data);
      })
      .catch(error => console.error('Error fetching incidents:', error));
  }, []);

  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}  // Stellen Sie sicher, dass Ihr API-Schlüssel korrekt ist
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
      >
        {incidents.map((incident) => (
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
      {/* Weitere Felder hinzufügen, die angezeigt werden sollen */}
    </div>
  </InfoWindow>
)}

      </GoogleMap>
    </LoadScript>
  );
}

export default MapComponent;
