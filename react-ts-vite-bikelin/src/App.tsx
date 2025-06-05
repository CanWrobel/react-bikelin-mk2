// @ts-nocheck

import React from 'react';
import './App.css';
import MainScreen from './components/MainScreen'; 
import DetailedWeatherComponent from './components/weather/DetailedWeatherComponent';
import { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import { RouteProvider } from './contexts/RouteContext';
import { LoadScript } from '@react-google-maps/api';


const App = () => {
  console.log('App Component wird initialisiert');

  useEffect(() => {
    console.log('App useEffect wird ausgeführt');
    document.title = "Bikelin-Navigator 2.0";
  }, []);

  console.log('App rendert...');
  
  return (
    <LoadScript
    googleMapsApiKey={import.meta.env.VITE_GOOGLE_PLACES_API_KEY}
    libraries={['places']}
    >
      <Router>
        <UserProvider>
          <RouteProvider>
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
    </LoadScript>
  );
}

export default App;