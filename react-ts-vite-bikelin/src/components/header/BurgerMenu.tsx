// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import keycloak from '../../services/auth-service';
import { useUser } from '../../contexts/UserContext';
import NewRouteForm from '../NewRouteForm';
import AddIncident from '../AddIncident';

interface BurgerMenuProps {
  toggleMenu: () => void;
  pickerCancel?: () => void; // <–– optional mit `?`
  onPickLocation: (type: 'start' | 'end', coordinates: string) => void;
  selectedMapLocation: {
    type: 'start' | 'end';
    lat: number;
    lng: number;
  } | null;
}

const BurgerMenu: React.FC<BurgerMenuProps> = ({ 
  toggleMenu, 
  onPickLocation,
  pickerCancel,
  selectedMapLocation 
}) => {
  const { username, token, setUsername, setToken } = useUser();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  useEffect(() => {
    const checkAuthentication = async () => {
      const authenticated = await keycloak.init({ onLoad: 'check-sso' });
      setIsAuthenticated(authenticated);
      if (authenticated) {
        setUsername(keycloak.tokenParsed.name);
        setToken(keycloak.token);
      } else {
        setUsername(null);
        setToken(null);
      }
    };

    checkAuthentication();

    keycloak.onAuthLogout = () => {
      setIsAuthenticated(false);
      setUsername(null);
      setToken(null);       
    };

    keycloak.onAuthSuccess = () => {
      setIsAuthenticated(true);
      setUsername(keycloak.tokenParsed.name);
      setToken(keycloak.token);
    };
    
    console.log("Full Keycloak object:", keycloak);


    return () => {
      keycloak.onAuthLogout = undefined;
      keycloak.onAuthSuccess = undefined;
    };
  }, [setUsername, setToken]);

  const handleLoginLogout = () => {
    if (isAuthenticated) {
      keycloak.logout();
    } else {
      keycloak.login();
    }
  };

  const handleNavigateHome = () => {
    pickerCancel;
    navigate('/');
    // setTimeout(() => window.location.reload(), 0);
  };

  const handleRoutePickLocation = (type: 'start' | 'end', coordinates: string) => {
    if (onPickLocation) {
      onPickLocation(type, coordinates);
    }
  };

  return (
    <div className="burger-menu">
      {activeMenu === null && (
        <>
          <button onClick={toggleMenu}>Menü Schließen</button>
          <button onClick={handleNavigateHome}>Home</button>
          <button onClick={handleLoginLogout}>
            {isAuthenticated ? 'Log Out' : 'Log In'}
          </button>
        </>
      )}

      {/* {isAuthenticated && activeMenu === null && location.pathname === '/' && (
        <>
          <button onClick={() => setActiveMenu('incident')}>Neuer Incident</button>
          <button onClick={() => navigate('/incidents')}>Incidents Verwalten</button>
          <button onClick={() => setActiveMenu('route')}>Neue Route</button>
          <button onClick={() => navigate('/routes')}>Routen Verwalten</button>


        </>
      )} */}
      {activeMenu === null && location.pathname === '/' && (
  <>
    {isAuthenticated && (
      <>
        <button onClick={() => setActiveMenu('incident')}>Neuer Incident</button>
        <button onClick={() => navigate('/incidents')}>Incidents Verwalten</button>
        <button onClick={() => navigate('/routes')}>Routen Verwalten</button>
      </>
    )}
    <button onClick={() => setActiveMenu('route')}>Neue Route</button>
  </>
)}


      {activeMenu === 'incident' && (
        <div>
          <AddIncident onClose={() => setActiveMenu(null)} />
        </div>
      )}

      {activeMenu === 'route' && 
        <NewRouteForm 
          pickerCancel={pickerCancel}
          onClose={() => setActiveMenu(null)} 
          onPickLocation={handleRoutePickLocation}
          selectedLocation={selectedMapLocation} 
          onStartTimeChange={() => {}}  
        />
      }
    </div>
  );
};

export default BurgerMenu;