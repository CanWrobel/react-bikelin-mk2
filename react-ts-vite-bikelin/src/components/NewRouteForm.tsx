import React, { useState, useRef, useEffect } from 'react';
import { useLoadScript, StandaloneSearchBox } from '@react-google-maps/api';

interface NewRouteFormProps {
  onClose: () => void;
  onPickLocation: (type: 'start' | 'end', coordinates: string) => void;
}

const NewRouteForm: React.FC<NewRouteFormProps> = ({ onClose, onPickLocation }) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyCrKbXEddxNxGUIo9ihGgQi2Xj_pDribYs",
    libraries: ['places']
  });

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

  const startSearchBoxRef = useRef<google.maps.places.SearchBox>(null);
  const endSearchBoxRef = useRef<google.maps.places.SearchBox>(null);

  useEffect(() => {
    if (startSearchBoxRef.current) {
      startSearchBoxRef.current.addListener('places_changed', () => handlePlacesChanged(startSearchBoxRef, 'start'));
    }
    if (endSearchBoxRef.current) {
      endSearchBoxRef.current.addListener('places_changed', () => handlePlacesChanged(endSearchBoxRef, 'end'));
    }

    // Cleanup listener when component unmounts or ref changes
    return () => {
      if (startSearchBoxRef.current) {
        google.maps.event.clearInstanceListeners(startSearchBoxRef.current);
      }
      if (endSearchBoxRef.current) {
        google.maps.event.clearInstanceListeners(endSearchBoxRef.current);
      }
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRouteData({ ...routeData, [e.target.name]: e.target.value });
  };

  const handlePlacesChanged = (ref, type) => {
    const places = ref.current?.getPlaces();
    if (places && places.length > 0) {
      const place = places[0];
      const components = place.address_components;
      const postalCodeObj = components.find(c => c.types.includes('postal_code'));
      const postalCode = postalCodeObj ? postalCodeObj.long_name : '';
  
      if (type === 'start') {
        setRouteData(prev => ({
          ...prev,
          startAddress: place.formatted_address,
          startPostalCode: postalCode
        }));
      } else {
        setRouteData(prev => ({
          ...prev,
          endAddress: place.formatted_address,
          endPostalCode: postalCode
        }));
      }
    }
  };
  

  if (!isLoaded) return <div>Loading...</div>;

  return (
<form>
  <h3>Start Point Details</h3>
  <StandaloneSearchBox ref={startSearchBoxRef} onLoad={() => startSearchBoxRef.current}>
    <input
      type="text"
      name="startAddress"
      placeholder="Address"
      value={routeData.startAddress}
      onChange={handleChange}
    />
  </StandaloneSearchBox>

  <input
    type="text"
    name="startPostalCode"
    placeholder="Postal Code"
    value={routeData.startPostalCode}
    onChange={handleChange}
  />
  <input
    type="button"
    value="Select on Map"
    onClick={() => onPickLocation('start', routeData.startPoint)}
  />
  <input
    type="text"
    name="startPoint"
    placeholder="Coordinates"
    value={routeData.startPoint}
    readOnly
  />

  <h3>End Point Details</h3>
  <StandaloneSearchBox ref={endSearchBoxRef} onLoad={() => endSearchBoxRef.current}>
    <input
      type="text"
      name="endAddress"
      placeholder="Address"
      value={routeData.endAddress}
      onChange={handleChange}
    />
  </StandaloneSearchBox>

  <input
    type="text"
    name="endPostalCode"
    placeholder="Postal Code"
    value={routeData.endPostalCode}
    onChange={handleChange}
  />
  <input
    type="button"
    value="Select on Map"
    onClick={() => onPickLocation('end', routeData.endPoint)}
  />
  <input
    type="text"
    name="endPoint"
    placeholder="Coordinates"
    value={routeData.endPoint}
    readOnly
  />

  <h3>Route Description</h3>
  <textarea
    name="description"
    style={{ width: '100%', boxSizing: 'border-box' }}
    value={routeData.description}
    onChange={handleChange}
    wrap="soft"
  />
  <button type="submit">Calculate Route</button>
  <button type="button" onClick={onClose}>Cancel</button>
</form>

  );
};

export default NewRouteForm;
