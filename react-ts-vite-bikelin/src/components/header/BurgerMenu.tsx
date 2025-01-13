import React, { useEffect, useState } from 'react';
import keycloak from '../../services/auth-service';
import { useUser } from '../../contexts/UserContext';

const BurgerMenu: React.FC<{ toggleMenu: () => void }> = ({ toggleMenu }) => {
  const { username, setUsername } = useUser();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      const authenticated = await keycloak.init({ onLoad: 'check-sso' });
      setIsAuthenticated(authenticated);
      if (authenticated) {
        setUsername(keycloak.tokenParsed.name);
      } else {
        setUsername(null);
      }
    };

    checkAuthentication();

    keycloak.onAuthLogout = () => {
      setIsAuthenticated(false);
      setUsername(null);
    };
    keycloak.onAuthSuccess = () => {
      console.log("Auth Success. Token Parsed:", keycloak.tokenParsed); 
      setIsAuthenticated(true);
      setUsername(keycloak.tokenParsed.name);
    };

    return () => {
      keycloak.onAuthLogout = undefined;
      keycloak.onAuthSuccess = undefined;
    };
  }, [setUsername]);

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
      {username && <p>Hello, {username}</p>}
      <button onClick={handleLoginLogout}>
        {isAuthenticated ? 'Log Out' : 'Log In'}
      </button>
    </div>
  );
};

export default BurgerMenu;
