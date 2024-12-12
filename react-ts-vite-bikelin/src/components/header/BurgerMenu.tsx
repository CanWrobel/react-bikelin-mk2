import React, { useState, useEffect } from 'react';
import keycloak from '../../services/auth-service';

interface BurgerMenuProps {
  toggleMenu: () => void;
}

const BurgerMenu: React.FC<BurgerMenuProps> = ({ toggleMenu }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await keycloak.init({ onLoad: 'check-sso' });
      setIsAuthenticated(authenticated);
    };
    checkAuth();

    keycloak.onAuthLogout = () => {
      setIsAuthenticated(false);
    };
    keycloak.onAuthSuccess = () => {
      setIsAuthenticated(true);
    };

    return () => {
      keycloak.onAuthLogout = undefined;
      keycloak.onAuthSuccess = undefined;
    };
  }, []);

  const handleLoginLogout = () => {
    if (isAuthenticated) {
      keycloak.logout();
    } else {
      keycloak.login();
    }
  };

  return (
    <div>
      <button onClick={toggleMenu}>Close</button>
      <a href="/">Home</a>
      <a href="/about">About Us</a>
      <a href="/contact">Contact Us</a>
      <button onClick={handleLoginLogout}>
        {isAuthenticated ? 'Log Out' : 'Log In'}
      </button>
    </div>
  );
};

export default BurgerMenu;
