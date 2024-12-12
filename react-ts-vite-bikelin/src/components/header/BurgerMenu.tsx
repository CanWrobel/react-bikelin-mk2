import React from 'react';
import { keycloak, initKeycloak } from '../../services/auth-service';

const BurgerMenu: React.FC<{ toggleMenu: () => void }> = ({ toggleMenu }) => {
  return (
    <div>
      <button onClick={toggleMenu}>Close</button>
      <a href="/">Home</a> {/* Jeder Link auf einer neuen Zeile */}
      <a href="/about">About Us</a>
      <a href="/contact">Contact Us</a>
    </div>
  );
}

export default BurgerMenu;
