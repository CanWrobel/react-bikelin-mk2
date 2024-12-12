import React, { useState } from 'react';
import MapComponent from './map/MapComponent';
import BurgerMenu from './header/BurgerMenu';

const MainScreen: React.FC = () => {
  const [menuActive, setMenuActive] = useState(false);

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

  return (
    <div className="container">
      <div className="header">
        <button onClick={toggleMenu}>☰</button>
        <h3>Bikelin-Navigator 2.0</h3> {/* Titel neben dem Burger-Button */}
      </div>
      <div className="main-area">
        <div className={`burgerMenu ${menuActive ? 'active' : ''}`}>
          <BurgerMenu toggleMenu={toggleMenu} />
        </div>
        <div className={`mapContainer ${menuActive ? 'menuActive' : ''}`}>
          <MapComponent />
        </div>
      </div>
    </div>
  );
}

export default MainScreen;
