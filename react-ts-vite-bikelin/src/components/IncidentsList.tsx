import React, { useEffect, useState } from 'react';
import { useUser } from '../contexts/UserContext';

interface Incident {
  id: string;
  title: string;
  description: string;
  date: string;
  // Füge weitere Felder hinzu, falls nötig
}

const IncidentsList: React.FC = () => {
  const { token } = useUser();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const response = await fetch(`http://141.45.146.183:8080/bikelin/api/incidents/${token}`, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setIncidents(data);
      } catch (err) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchIncidents();
    }
  }, [token]);

  if (loading) return <p>Loading incidents...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h3>Incidents</h3>
      {incidents.length > 0 ? (
        <ul>
          {incidents.map((incident) => (
            <li key={incident.id}>
              <strong>{incident.title}</strong>: {incident.description} ({incident.date})
            </li>
          ))}
        </ul>
      ) : (
        <p>No incidents found.</p>
      )}
    </div>
  );
};

export default IncidentsList;
