import React, { useEffect, useState } from 'react';
import { GoogleMap, Marker, DirectionsRenderer } from '@react-google-maps/api';
import { Incident } from '../../types/Incidents.ts';
import { useUser } from '../../contexts/UserContext';
import CustomInfoWindow from './InfoWindow';

const containerStyle = {
  width: '100%',
  height: '100vh'
};

const center = {
  lat: 52.52,
  lng: 13.405
};

interface MapComponentProps {
  isPickerMode?: boolean;
  onLocationSelect?: (location: { lat: number, lng: number }) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ isPickerMode, onLocationSelect }) => {
  const { token } = useUser();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [markers, setMarkers] = useState([]);
  const [directions, setDirections] = useState(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    const initializeMap = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMapReady(true);
    };

    initializeMap();
  }, []);
  const API_BASE = import.meta.env.VITE_API_BASE_URL
  useEffect(() => {
    if (!token) return;
    const fetchIncidents = async () => {
      try {
        const response = await fetch(`${API_BASE}/incidents`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setIncidents(data);
      } catch (error) {
        console.error('Error fetching incidents:', error);
      }
    };

    fetchIncidents();
  }, [token]);

  const handleMapClick = (event) => {
    const newLocation = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    };

    if (isPickerMode && onLocationSelect) {
      onLocationSelect(newLocation);
    } else {
      setMarkers([...markers, newLocation]);
    }
  };

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={10}
      onClick={handleMapClick}
    >
      {!isPickerMode && token && incidents.map((incident) => (
        <Marker
          key={incident._id}
          position={{ lat: incident.latitude, lng: incident.longitude }}
          onClick={() => setSelectedIncident(incident)}
        />
      ))}
      {selectedIncident && (
        <CustomInfoWindow
          incident={selectedIncident}
          onClose={() => setSelectedIncident(null)}
        />
      )}
      {directions && <DirectionsRenderer directions={directions} />}
    </GoogleMap>
  );
  
};

export default MapComponent;
