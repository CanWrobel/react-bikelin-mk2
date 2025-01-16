import React, { useEffect, useState } from 'react';
import keycloak from '../../services/auth-service';
import { useUser } from '../../contexts/UserContext';
import { useNavigate } from 'react-router-dom';



const BurgerMenu: React.FC<{ toggleMenu: () => void }> = ({ toggleMenu }) => {
  const { username, token, setUsername, setToken } = useUser();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthentication = async () => {
      const authenticated = await keycloak.init({ onLoad: 'check-sso' });
      setIsAuthenticated(authenticated);
      if (authenticated) {
        setUsername(keycloak.tokenParsed.name);
        setToken(keycloak.token); // Setzt den Token, sobald der Benutzer authentifiziert ist
        console.log("Keycloak Token Parsed:", keycloak.tokenParsed, "Full Keycloak Object:", keycloak);
      } else {
        setUsername(null);
        setToken(null); // Löscht den Token, wenn der Benutzer nicht authentifiziert ist
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
      setToken(keycloak.token); // Aktualisiert den Token bei erfolgreicher Authentifizierung
    };
  
    return () => {
      keycloak.onAuthLogout = undefined;
      keycloak.onAuthSuccess = undefined;
    };
  }, [setUsername, setToken]); // Fügen Sie setToken zu den Abhängigkeiten hinzu
  
  

  const handleLoginLogout = () => {
    if (isAuthenticated) {
      keycloak.logout();
    } else {
      keycloak.login();
    }
  };

  const [showForm, setShowForm] = useState(false);
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
        setShowForm(false);
      } else {
        console.error('Failed to upload incident:', await response.text());
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className={`burger-menu ${showForm ? 'form-active' : ''}`}>
      <button onClick={() => alert(token)} >Show Token</button>
      <br />
      <br />      
      <button onClick={() => console.log(token)}>Log Token</button>
      <br />
      <br />

      <button onClick={toggleMenu}>Schließen</button>
      <br />
      {!showForm && (
        <>

          <button onClick={handleLoginLogout}>
            {isAuthenticated ? 'Log Out' : 'Log In'}
          </button>
        </>
      )}
{isAuthenticated && (
  <>
    <button 
      className="incident-toggle" 
      onClick={() => setShowForm(!showForm)}
    >
      {showForm ? 'Hide Form' : 'Neuer Incident'}
    </button>
    <button 
      className="manage-incidents" 
      onClick={() => console.log('Navigate to Incidents Management')}
    >
      Incidents Verwalten
    </button>

    <button 
  className="manage-incidents" 
  onClick={() => navigate('/incidents')}
>
  Incidents Verwalten
</button>
<button 
  className="manage-incidents" 
  onClick={() => navigate('/')}
>
  Home
</button>
  </>
)}



      {showForm && (
        <form onSubmit={handleFormSubmit} className="incident-form">
          <label>
            Title:
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Description:
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Danger Level:
            <select
              name="dangerLevel"
              value={formData.dangerLevel}
              onChange={handleInputChange}
              required
            >
              <option value="unknown">Unknown</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>
          <label>
            Category:
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
            >
              <option value="good">Good</option>
              <option value="bad">Bad</option>
            </select>
          </label>
          <label>
            Date:
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Time:
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Time Category:
            <select
              name="timeCategory"
              value={formData.timeCategory}
              onChange={handleInputChange}
              required
            >
              <option value="temporary">Temporary</option>
              <option value="semipermanent">Semi-Permanent</option>
              <option value="permanent">Permanent</option>
            </select>
          </label>
          <label>
            Street:
            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            ZIP:
            <input
              type="text"
              name="zip"
              value={formData.zip}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            City:
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Image (optional):
            <input type="file" onChange={handleImageChange} />
          </label>
          <button type="submit">Submit</button>
        </form>
      )}
    </div>
  );
};

export default BurgerMenu;
