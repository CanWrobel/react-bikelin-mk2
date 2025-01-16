import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Incident {
  _id: string;
  title: string;
  description: string;
  dangerLevel: string;
  category: string;
  date: string;
  time: string;
  timeCategory: string;
  street: string;
  zip: number;
  city: string;
  username: string;
  longitude: number;
  latitude: number;
  incident_id: number;
}

interface IncidentsListProps {
  token: string;
}

const IncidentsList: React.FC<IncidentsListProps> = ({ token }) => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get(`http://141.45.146.183:8080/bikelin/api/incidents/${token}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    })
    .then(response => {
      setIncidents(response.data);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setError('Fehler beim Laden der Incidents');
      setLoading(false);
    });
  }, [token]);

  if (loading) return <p>Lädt...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Incident Liste</h1>
      {incidents.map(incident => (
        <div key={incident._id}>
          <h2>{incident.title}</h2>
          <p>{incident.description}</p>
        </div>
      ))}
    </div>
  );
};

export default IncidentsList;
