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

  const [startSearchBox, setStartSearchBox] = useState<google.maps.places.SearchBox | null>(null);
  const [endSearchBox, setEndSearchBox] = useState<google.maps.places.SearchBox | null>(null);

  const onStartLoad = (ref: google.maps.places.SearchBox) => {
    console.log('Start SearchBox loaded:', ref);
    setStartSearchBox(ref);
  };

  const onEndLoad = (ref: google.maps.places.SearchBox) => {
    console.log('End SearchBox loaded:', ref);
    setEndSearchBox(ref);
  };

  const handleStartPlacesChanged = () => {
    console.log('Start places changed');
    if (startSearchBox) {
      const places = startSearchBox.getPlaces();
      console.log('Start places:', places);
      handlePlaceSelection(places, 'start');
    }
  };

  const handleEndPlacesChanged = () => {
    console.log('End places changed');
    if (endSearchBox) {
      const places = endSearchBox.getPlaces();
      console.log('End places:', places);
      handlePlaceSelection(places, 'end');
    }
  };

  const handlePlaceSelection = (places: google.maps.places.PlaceResult[] | undefined, type: 'start' | 'end') => {
    if (places && places.length > 0) {
      const place = places[0];
      console.log(`Selected ${type} place:`, place);

      const postalCode = place.address_components?.find(
        component => component.types.includes('postal_code')
      )?.long_name || '';

      console.log(`Found postal code for ${type}:`, postalCode);

      if (type === 'start') {
        setRouteData({
          ...routeData,
          startAddress: place.formatted_address || '',
          startPostalCode: postalCode,
          startPoint: place.geometry?.location ? 
            `${place.geometry.location.lat()},${place.geometry.location.lng()}` : ''
        });
      } else {
        setRouteData({
          ...routeData,
          endAddress: place.formatted_address || '',
          endPostalCode: postalCode,
          endPoint: place.geometry?.location ? 
            `${place.geometry.location.lat()},${place.geometry.location.lng()}` : ''
        });
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRouteData({ ...routeData, [e.target.name]: e.target.value });
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <form>
      <h3>Start Point Details</h3>
      <StandaloneSearchBox
        onLoad={onStartLoad}
        onPlacesChanged={handleStartPlacesChanged}
      >
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
      <StandaloneSearchBox
        onLoad={onEndLoad}
        onPlacesChanged={handleEndPlacesChanged}
      >
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