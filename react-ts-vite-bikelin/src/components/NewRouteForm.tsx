import React, { useState } from 'react';


// NewRouteForm props
interface NewRouteFormProps {
  onClose: () => void;
  onPickLocation: (type: 'start' | 'end') => void;
}

const NewRouteForm: React.FC<{ onClose: () => void, onPickLocation: () => void }> = ({ onClose, onPickLocation }) => {
  const [routeData, setRouteData] = useState({
    startAddress: '',
    startHouseNumber: '',
    startPostalCode: '',
    startPoint: '',
    endAddress: '',
    endHouseNumber: '',
    endPostalCode: '',
    endPoint: '',
    description: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRouteData({ ...routeData, [e.target.name]: e.target.value });
  };

  return (
    <form>
      <h3>Start Point Details</h3>
      <input type="text" name="startAddress" placeholder="Address" value={routeData.startAddress} onChange={handleChange} />
      <input type="text" name="startHouseNumber" placeholder="House Number" value={routeData.startHouseNumber} onChange={handleChange} />
      <input type="text" name="startPostalCode" placeholder="Postal Code" value={routeData.startPostalCode} onChange={handleChange} />
      <input type="button" value="Select on Map" onClick={() => onPickLocation('start')} />
      <input type="text" name="startPoint" placeholder="Coordinates" value={routeData.startPoint} readOnly />

      <h3>End Point Details</h3>
      <input type="text" name="endAddress" placeholder="Address" value={routeData.endAddress} onChange={handleChange} />
      <input type="text" name="endHouseNumber" placeholder="House Number" value={routeData.endHouseNumber} onChange={handleChange} />
      <input type="text" name="endPostalCode" placeholder="Postal Code" value={routeData.endPostalCode} onChange={handleChange} />
      <input type="button" value="Select on Map" onClick={() => onPickLocation('end')} />
      <input type="text" name="endPoint" placeholder="Coordinates" value={routeData.endPoint} readOnly />

      <h3>Route Description</h3>
      <textarea name="description" value={routeData.description} onChange={handleChange} />
      <button type="submit">Calculate Route</button>
      <button type="button" onClick={onClose}>Cancel</button>
    </form>
  );
};

export default NewRouteForm;