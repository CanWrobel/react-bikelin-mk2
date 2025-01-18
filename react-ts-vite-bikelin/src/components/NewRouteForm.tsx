import React, { useState } from 'react';
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

  const handlePlaceSelection = (places: google.maps.places.PlaceResult[] | undefined, type: 'start' | 'end') => {
    if (places && places.length > 0) {
      const place = places[0];
      const location = place.geometry?.location;
      
      if (location) {
        const lat = location.lat();
        const lng = location.lng();
        const postalCode = place.address_components?.find(
          component => component.types.includes('postal_code')
        )?.long_name || '';

        // Koordinaten an Parent weitergeben
        onPickLocation(type, `${lat},${lng}`);

        // Form-Daten aktualisieren
        setRouteData(prev => ({
          ...prev,
          [`${type}Point`]: `${lat},${lng}`,
          [`${type}Address`]: place.formatted_address || '',
          [`${type}PostalCode`]: postalCode
        }));
      }
    }
  };

  const onStartLoad = (ref: google.maps.places.SearchBox) => setStartSearchBox(ref);
  const onEndLoad = (ref: google.maps.places.SearchBox) => setEndSearchBox(ref);

  const handleStartPlacesChanged = () => {
    if (startSearchBox) {
      handlePlaceSelection(startSearchBox.getPlaces(), 'start');
    }
  };

  const handleEndPlacesChanged = () => {
    if (endSearchBox) {
      handlePlaceSelection(endSearchBox.getPlaces(), 'end');
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