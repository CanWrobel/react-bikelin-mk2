import React, { useState, useEffect } from 'react';
import { useLoadScript, StandaloneSearchBox } from '@react-google-maps/api';
import axios from 'axios';
import { useUser } from '../contexts/UserContext';
import { toggleSaveRoute } from './SaveRouteLogic'
import { RouteData } from '../types/RouteData';
import { useRoute } from '../contexts/RouteContext';


interface NewRouteFormProps {
  onClose: () => void;
  onPickLocation: (type: 'start' | 'end', coordinates: string) => void;
  selectedLocation?: { type: 'start' | 'end', lat: number, lng: number };  

}

const NewRouteForm: React.FC<NewRouteFormProps> = ({ onClose, onPickLocation, selectedLocation,          }) => {
  const { username, token } = useUser();

  const { 
    routeInfo, 
    setStartTime, 
    setStartTimeUnix,
    setArrivalTime: setDuration, 
    setStartLocation, 
    setEndLocation, 
    setStartAddress, 
    setEndAddress,
    setCalculateEnabled,
  } = useRoute();




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
    description: '',
    saveRoute: true,

    departureTime: new Date(new Date().setHours(new Date().getHours() + 2)).toISOString().slice(0, 16)

  });

  const [startSearchBox, setStartSearchBox] = useState<google.maps.places.SearchBox | null>(null);
  const [endSearchBox, setEndSearchBox] = useState<google.maps.places.SearchBox | null>(null);
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
   
    const nowHuman = new Date(new Date().setHours(new Date().getHours() + 2)).toISOString().slice(0, 16)

    setStartTime(nowHuman);
    const nowUnix = Math.floor(Date.now() / 1000);
    setStartTimeUnix(nowUnix);
    setRouteData(prev => ({ ...prev, departureTime: nowHuman }));
  }, []);
  React.useEffect(() => {
    if (selectedLocation) {
      console.log('🟢 selectedLocation received in NewRouteForm:', selectedLocation);

      const { type, lat, lng } = selectedLocation;
      
      const coordinates = `${lat},${lng}`;
      setRouteData(prev => ({
        ...prev,
        [`${type}Point`]: coordinates
      }));

      fetchAddress(lng, lat, type);
    }
  }, [selectedLocation]);

  const fetchAddress = async (lon: number, lat: number, type: 'start' | 'end') => {
    try {
      const response = await axios.get(
        `http://141.45.146.183:8080/routing/getLocationName/${lon}/${lat}`,
        {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      console.log('Address response:', response.data);
      
      setRouteData(prev => ({
        ...prev,
        [`${type}Address`]: response.data
      }));
      
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  };

const handlePlaceSelection = (places: google.maps.places.PlaceResult[] | undefined, type: 'start' | 'end') => {
  console.log('🟡 Place selected:');

  try {
    if (!places || places.length === 0) {
      console.error(`[${type}] No places found.`);
      return;
    }

    const place = places[0];

    if (!place.geometry || !place.geometry.location) {
      console.error(`[${type}] Selected place has no geometry or location.`);
      return;
    }

    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    
    if (isNaN(lat) || isNaN(lng)) {
      console.error(`[${type}] Invalid coordinates: lat=${lat}, lng=${lng}`);
      return;
    }

    const coordinates = `${lat.toFixed(6)},${lng.toFixed(6)}`;

    let postalCode = 'Unknown';
    try {
      postalCode = place.address_components?.find(
        component => component.types.includes('postal_code')
      )?.long_name || 'Unknown';
    } catch (err) {
      console.warn(`[${type}] Error extracting postal code:`, err);
    }

    const formattedAddress = place.formatted_address || '';

    console.log(`[${type}] Selected place:`, formattedAddress);
    console.log(`[${type}] Coordinates: ${coordinates}`);
    console.log(`[${type}] Postal code: ${postalCode}`);

    setTimeout(() => {
      onPickLocation(type, coordinates);

      setRouteData(prev => ({
        ...prev,
        [`${type}Point`]: coordinates,
        [`${type}Address`]: formattedAddress,
        [`${type}PostalCode`]: postalCode
      }));
    }, 0);
  } catch (error) {
    console.error(`[${type}] Error during place selection handling:`, error);
  }
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
   
    setStartTime(routeData.departureTime);
    setStartLocation({
      lat: parseFloat(routeData.startPoint.split(',')[0]),
      lng: parseFloat(routeData.startPoint.split(',')[1])
    });
    setEndLocation({
      lat: parseFloat(routeData.endPoint.split(',')[0]),
      lng: parseFloat(routeData.endPoint.split(',')[1])
    });
    setStartAddress(routeData.startAddress);
    setEndAddress(routeData.endAddress);
    setCalculateEnabled(true)
    // if (routeData.saveRoute) {
    //   try {
    //     await axios.post(
    //       'http://141.45.146.183:8080/route-manager/calculate-routes',
    //       {
    //         startString: routeData.startAddress,
    //         endString: routeData.endAddress,
    //         routeDescription: routeData.description,
    //         start: {
    //           lon: parseFloat(routeData.startPoint.split(',')[1]),
    //           lat: parseFloat(routeData.startPoint.split(',')[0])
    //         },
    //         end: {
    //           lon: parseFloat(routeData.endPoint.split(',')[1]), 
    //           lat: parseFloat(routeData.endPoint.split(',')[0])
    //         },
    //         departureTime: routeData.departureTime,
    //         saveRoute: routeData.saveRoute
    //       },
    //       {
    //         headers: {
    //           'Accept': 'application/json, text/plain, */*',
    //           'Authorization': `Bearer ${token}`,
    //           'Content-Type': 'application/json'
    //         }
    //       }
    //     );
    //     onClose();
    //   } catch (error) {
    //     console.error('Error saving route:', error);
    //   }
    // }
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
        if (e.target.name === 'departureTime') {
          setStartTime(e.target.value);
        }
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
<form onSubmit={handleSubmit}>
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
      <div>
 <label htmlFor="departureTime">Departure Time</label>
 <input
   id="departureTime"
   type="datetime-local"
   name="departureTime"
   value={routeData.departureTime}
   onChange={handleChange}
   style={{ width: '200px', marginTop: '5px' }}
   data-date-format="DD.MM.YYYY HH:mm"
 />
</div>
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
      <button  type="submit">Calculate Route</button>

      <h3>Route Description</h3>
      <textarea
        name="description"
        style={{ width: '100%', boxSizing: 'border-box' }}
        value={routeData.description}
        onChange={handleChange}
        wrap="soft"
      />

      {/* <button type="button" style={{ backgroundColor: routeData.saveRoute ? 'green' : 'gray', color: 'white' }} onClick={() => toggleSaveRoute(routeData, setRouteData)}>
        {routeData.saveRoute ? 'Route speichern' : ' Route speichern'}
      </button> */}

<button
  type="button"
  style={{ backgroundColor: 'green', color: 'white' }}
  onClick={async () => {
    try {
      await axios.post(`${API_BASE}/routes`, {
        startString: routeData.startAddress,
        endString: routeData.endAddress,
        routeDescription: routeData.description,
        start: {
          lon: parseFloat(routeData.startPoint.split(',')[1]),
          lat: parseFloat(routeData.startPoint.split(',')[0])
        },
        end: {
          lon: parseFloat(routeData.endPoint.split(',')[1]),
          lat: parseFloat(routeData.endPoint.split(',')[0])
        },
        departureTime: routeData.departureTime,
        saveRoute: true
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      alert('Route gespeichert!');
    } catch (err) {
      console.error('Fehler beim Speichern der Route:', err);
      alert('Fehler beim Speichern');
    }
  }}
>
  Route speichern
</button>

      <button type="button" onClick={onClose}>Cancel</button>
    </form>
  );
};

export default NewRouteForm;