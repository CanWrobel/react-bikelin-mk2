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

  const handleDelete = (id) => {
    axios.delete(`http://141.45.146.183:8080/bikelin/api/incident/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json, text/plain, */*',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 OPR/115.0.0.0',
        'Referer': 'http://141.45.146.183/'
      }
    })
    .then(() => {
      setIncidents(incidents.filter(incident => incident._id !== id));
      console.log('Incident erfolgreich gelöscht');
    })
    .catch(err => {
      console.error('Fehler beim Löschen des Incidents:', err);
      alert('Fehler beim Löschen des Incidents. Überprüfen Sie die Konsole für mehr Informationen.');
    });
  };
  
  

  if (loading) return <p>Lädt...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Incident Liste</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Incident</th>
            <th>Beschreibung</th>
            <th>Gefahrenstufe</th>
            <th>Kategorie</th>
            <th>Adresse</th>
            <th>Auftrittsdatum</th>
            <th>Zeitdauer</th>
            <th>Hinzugefügt von</th>
            <th>Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {incidents.map(incident => (
            <tr key={incident._id}>
              <td>{incident.title}</td>
              <td>{incident.description}</td>
              <td>{incident.dangerLevel}</td>
              <td>{incident.category}</td>
              <td>{`${incident.street}, ${incident.zip} ${incident.city}`}</td>
              <td>{`${incident.date} ${incident.time}`}</td>
              <td>{incident.timeCategory}</td>
              <td>{incident.username}</td>
              <td>
              <button 
  className="btn btn-danger" 
  onClick={() => handleDelete(incident._id)}
>
  ✖ Löschen
</button>

              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default IncidentsList;
