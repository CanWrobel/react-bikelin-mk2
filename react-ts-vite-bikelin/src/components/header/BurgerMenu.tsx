import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // useLocation hinzugefügt
import keycloak from '../../services/auth-service';
import { useUser } from '../../contexts/UserContext';
import NewRouteForm from '../NewRouteForm';
import AddIncident from '../AddIncident';

const BurgerMenu: React.FC<{ toggleMenu: () => void }> = ({ toggleMenu }) => {
  const { username, token, setUsername, setToken } = useUser();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Aktuelle Route prüfen
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dangerLevel: 'unknown',
    category: 'good',
    date: '',
    time: '',
    timeCategory: 'temporary',
    street: '',
    zip: '',
    city: '',
  });
  const [image, setImage] = useState<File | null>(null);

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

    return () => {
      keycloak.onAuthLogout = undefined;
      keycloak.onAuthSuccess = undefined;
    };
  }, [setUsername, setToken]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImage(e.target.files ? e.target.files[0] : null);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append(
      'incident',
      JSON.stringify({ ...formData, username })
    );
    if (image) {
      data.append('image', image);
    }

    try {
      const response = await fetch('http://141.45.146.183:8080/bikelin/api/incident/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
        },
        body: data,
      });

      if (response.ok) {
        console.log('Incident successfully uploaded!');
        setFormData({
          title: '',
          description: '',
          dangerLevel: 'unknown',
          category: 'good',
          date: '',
          time: '',
          timeCategory: 'temporary',
          street: '',
          zip: '',
          city: '',
        });
        setImage(null);
        setActiveMenu(null);
      } else {
        console.error('Failed to upload incident:', await response.text());
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleLoginLogout = () => {
    if (isAuthenticated) {
      keycloak.logout();
    } else {
      keycloak.login();
    }
  };
  const handleNavigateHome = () => {
    navigate('/');
    setTimeout(() => window.location.reload(), 0); // Erzwingt ein vollständiges Neuladen der Seite
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

      {/* Nur Buttons anzeigen, wenn der Nutzer eingeloggt ist und sich auf "/" befindet */}
      {isAuthenticated && activeMenu === null && location.pathname === '/' && (
        <>
          <button onClick={() => setActiveMenu('incident')}>Neuer Incident</button>
          <button onClick={() => setActiveMenu('route')}>Neue Route</button>
          <button onClick={() => navigate('/incidents')}>Incidents Verwalten</button>
        </>
      )}

{activeMenu === 'incident' && (
  <div>

  <AddIncident onClose={() => setActiveMenu(null)} />
</div>
)}

      {activeMenu === 'route' && <NewRouteForm onClose={() => setActiveMenu(null)} />}
    </div>
  );
};

export default BurgerMenu;
