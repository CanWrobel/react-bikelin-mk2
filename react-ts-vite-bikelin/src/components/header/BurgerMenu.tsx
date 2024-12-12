import React from 'react';
import { initKeycloak } from '../../services/auth-service';
import keycloak from '../../services/auth-service';

interface BurgerMenuProps {
  toggleMenu: () => void; // Typdefinition für toggleMenu
}

const BurgerMenu: React.FC<BurgerMenuProps> = ({ toggleMenu }) => {
  const handleLogin = () => {
    initKeycloak().then(authenticated => {
      if (authenticated) {
        console.log('Authenticated');
        // Hier kannst du zum Beispiel eine Weiterleitung durchführen oder den Anwendungsstatus aktualisieren
      } else {
        console.log('Not authenticated');
        keycloak.login(); // Leitet den Nutzer zur Keycloak-Login-Seite
      }
    }).catch(error => {
      console.error('Keycloak login error:', error);
    });
  };

  return (
    <div>
      <button onClick={toggleMenu}>Close</button>
      <a href="/">Home</a>
      <a href="/about">About Us</a>
      <a href="/contact">Contact Us</a>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default BurgerMenu;