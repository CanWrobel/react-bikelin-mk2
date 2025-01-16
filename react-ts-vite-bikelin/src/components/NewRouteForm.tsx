import React, { useState } from 'react';

const NewRouteForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [routeData, setRouteData] = useState({
    startPoint: '',
    endPoint: '',
    description: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRouteData({ ...routeData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Route Data:', routeData);
    onClose(); // Close the form after submission
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Start Point:
        <input type="text" name="startPoint" value={routeData.startPoint} onChange={handleChange} required />
      </label>
      <br />
      <label>
        End Point:
        <input type="text" name="endPoint" value={routeData.endPoint} onChange={handleChange} required />
      </label>
      <br />
      <label>
        Description:
        <input type="text" name="description" value={routeData.description} onChange={handleChange} required />
      </label>
      <br />
      <button type="submit">Route Berechnen</button>
      <button type="button" onClick={onClose}>Abbrechen</button>
    </form>
  );
};

export default NewRouteForm;
