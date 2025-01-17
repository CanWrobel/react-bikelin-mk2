import React from 'react';
import { InfoWindow } from '@react-google-maps/api';
import { Incident } from '../../types/Incidents';

interface InfoWindowProps {
  incident: Incident;
  onClose: () => void;
}

const CustomInfoWindow: React.FC<InfoWindowProps> = ({ incident, onClose }) => {
  return (
    <InfoWindow
      position={{ lat: incident.latitude, lng: incident.longitude }}
      onCloseClick={onClose}
    >
      <div style={{ color: 'black', fontSize: '16px', maxWidth: '300px' }}>
        <h2>{incident.title}</h2>
        <p>{incident.description}</p>
        <p><strong>Datum:</strong> {incident.date} um {incident.time}</p>
        <p><strong>Adresse:</strong> {incident.street}, {incident.zip} {incident.city}</p>
        <p><strong>Gefahrenstufe:</strong> {incident.dangerLevel}</p>
        <p><strong>Kategorie:</strong> {incident.category} ({incident.timeCategory})</p>
        {incident.username && <p><strong>Eingereicht von:</strong> {incident.username}</p>}
        {incident.image && <p><strong>Bild:</strong> <img src={`http://141.45.146.183:8080/bikelin/api/image/${incident.image}`} alt="Incident" style={{ width: '100%' }} /></p>}
      </div>
    </InfoWindow>
  );
};

export default CustomInfoWindow;
