import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import IncidentsList from './IncidentsList';
import MapComponent from './map/MapComponent';
import BurgerMenu from './header/BurgerMenu';
import { useUser } from '../contexts/UserContext'; // Importiere die Hook

const MainScreen: React.FC = () => {
  const [menuActive, setMenuActive] = useState(false);
  const { username, token } = useUser(); // Benutze die Hook, um den Benutzernamen und das Token zu erhalten
  const location = useLocation(); // Hole den aktuellen Pfad

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

  return (
    <div className="container">
      <div className="header">
        <button onClick={toggleMenu}>☰</button>
        <h3>Bikelin-Navigator 2.0 {username ? `Hallo, ${username}` : ''}</h3> 
      </div>
      <div className="main-area">
      <div className={`burgerMenu ${menuActive ? 'active' : ''}`}>
              <BurgerMenu toggleMenu={toggleMenu} />
            </div>
        {location.pathname === '/' && (
          <>

            <div className={`mapContainer ${menuActive ? 'menuActive' : ''}`}>
              <MapComponent key={location.key} />
            </div>
          </>
        )}
        {location.pathname === '/incidents' && (
            <div className={`mapContainer ${menuActive ? 'menuActive' : ''}`}>
            Incidents Inhalt
            <IncidentsList token={token} />
            <p>Ende</p>
            </div> // Hier könnten Sie eine spezifische Komponente für Incidents platzieren
        )}
      </div>
    </div>
  );
}

export default MainScreen;
