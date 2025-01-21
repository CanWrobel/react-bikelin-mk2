import React from 'react';
import './App.css';
import MainScreen from './components/MainScreen'; 
import DetailedWeatherComponent from './components/weather/DetailedWeatherComponent';
import { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import { RouteProvider } from './contexts/RouteContext';


const App = () => {
  useEffect(() => {
    document.title = "Bikelin-Navigator 2.0";
  }, []);

  return (
    <Router>
      <UserProvider>
        <RouteProvider> {/* Hinzufügen des RouteProvider um die Komponenten */}
          <div className="container">
            <Routes>
              <Route path="/" element={<MainScreen />} />
              <Route path="/incidents" element={<MainScreen />} />
              <Route path="/routes" element={<MainScreen />} />
              <Route path="/weather" element={<MainScreen />} />
              <Route path="/dweather" element={<DetailedWeatherComponent />} />
            </Routes>
          </div>
        </RouteProvider>
      </UserProvider>
    </Router>
  );
}

export default App;
