import React, { useState } from 'react';
import MapComponent from './map/MapComponent';

const NewRouteForm = ({ onClose }) => {
  const [routeData, setRouteData] = useState({
    startAddress: '',
    startHouseNumber: '',
    startPostalCode: '',
    startCoords: '',
    endAddress: '',
    endHouseNumber: '',
    endPostalCode: '',
    endCoords: '',
    description: ''
  });
  
  const [pickingMode, setPickingMode] = useState('');

  const handleLocationSelect = (location) => {
    const coordString = `${location.lat}, ${location.lng}`;
    setRouteData(prev => ({
      ...prev,
      [`${pickingMode}Coords`]: coordString
    }));
    setPickingMode('');
  };

  const handlePickOnMap = (type) => {
    setPickingMode(type);
  };

  return (
    <div className="w-full">
      {pickingMode ? (
        <div className="h-96">
          <MapComponent 
            isPickerMode={true} 
            onLocationSelect={handleLocationSelect} 
          />
          <button 
            className="mt-2 p-2 bg-red-500 text-white" 
            onClick={() => setPickingMode('')}
          >
            Cancel Selection
          </button>
        </div>
      ) : (
        <form className="space-y-4">
          <div>
            <h3 className="font-bold">Start Point</h3>
            <input 
              type="button" 
              value="Select on Map" 
              onClick={() => handlePickOnMap('start')}
              className="mt-2 p-2 bg-blue-500 text-white"
            />
            <input 
              type="text" 
              value={routeData.startCoords} 
              readOnly 
              className="mt-2 p-2 border"
              placeholder="Coordinates"
            />
          </div>

          <div>
            <h3 className="font-bold">End Point</h3>
            <input 
              type="button" 
              value="Select on Map" 
              onClick={() => handlePickOnMap('end')}
              className="mt-2 p-2 bg-blue-500 text-white"
            />
            <input 
              type="text" 
              value={routeData.endCoords} 
              readOnly 
              className="mt-2 p-2 border"
              placeholder="Coordinates"
            />
          </div>
        </form>
      )}
    </div>
  );
};

export default NewRouteForm;