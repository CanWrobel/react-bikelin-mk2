import React, { useState } from 'react';
import { Route, useLocation } from 'react-router-dom';
import IncidentsList from './IncidentsList';
import MapComponent from './map/MapComponent';
import MapPicker from './map/MapPicker';
import BurgerMenu from './header/BurgerMenu';
import { useUser } from '../contexts/UserContext';
import RouteList from './RoutesList';

const MainScreen: React.FC = () => {
  const [menuActive, setMenuActive] = useState(false);
  const [isPickerMode, setIsPickerMode] = useState(false);
  const { username, token } = useUser();
  const location = useLocation();

  // States für die Koordinaten-Verwaltung
  const [pickingType, setPickingType] = useState<'start' | 'end'>('start');
  const [selectedCoordinates, setSelectedCoordinates] = useState<string>('');
  const [selectedMapLocation, setSelectedMapLocation] = useState<{
    type: 'start' | 'end';
    lat: number;
    lng: number;
  } | null>(null);

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

  const handleLocationSelect = (location: { lat: number, lng: number }) => {
    // Speichere die ausgewählte Position mit dem aktuellen Typ
    console.log(`Selected: ${location.lat}, ${location.lng}`);
    setSelectedMapLocation({
      type: pickingType,
      ...location
    });
  };

  const handlePickerCancel = () => {
    setIsPickerMode(false);
    setSelectedCoordinates('');
    setSelectedMapLocation(null);
  };

  const handleRouteCalculate = () => {
    setIsPickerMode(false);
    setSelectedCoordinates('');
    setSelectedMapLocation(null);
  };

  // Handler für die Koordinaten von der RouteForm
  const handlePickLocation = (type: 'start' | 'end', coordinates: string) => {
    setIsPickerMode(true);
    setPickingType(type);
    setSelectedCoordinates(coordinates);
    setSelectedMapLocation(null);
  };

  const handleFormSubmit = () => {
    // Wird aufgerufen, wenn das Formular abgeschickt wird
    setIsPickerMode(false);
    setSelectedCoordinates('');
    setSelectedMapLocation(null);
    // Hier können weitere Aktionen nach dem Formular-Submit ausgeführt werden
  };

  return (
    <div className="container">
      <div className="header">
        <button onClick={toggleMenu}>☰</button>
        <h3>Bikelin-Navigator 2.0 {username ? `Hallo, ${username}` : ''}</h3>
      </div>
      <div className="main-area">
        <div className={`burgerMenu ${menuActive ? 'active' : ''}`}>
          <BurgerMenu 
            toggleMenu={toggleMenu}
            onPickLocation={handlePickLocation}
            selectedMapLocation={selectedMapLocation}
          />
        </div>
        {location.pathname === '/' && (
          <div className={`mapContainer ${menuActive ? 'menuActive' : ''}`}>
            {isPickerMode ? (
              <MapPicker
                onSelect={handleLocationSelect}
                onCancel={handlePickerCancel}
                pickingType={pickingType}
                coordinates={selectedCoordinates}
              />
            ) : (
              <MapComponent key={location.key} />
            )}
          </div>
        )}
        {location.pathname === '/incidents' && (
          <div className={`mapContainer ${menuActive ? 'menuActive' : ''}`}>
            <IncidentsList token={token} />
          </div>
        )}
                {location.pathname === '/routes' && (
          <div className={`mapContainer ${menuActive ? 'menuActive' : ''}`}>
            <RouteList token={token} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MainScreen;