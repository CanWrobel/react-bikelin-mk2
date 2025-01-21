import React from 'react';
import './App.css';
import MainScreen from './components/MainScreen'; 
import DetailedWeatherComponent from './components/weather/DetailedWeatherComponent';
import { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import { RouteProvider } from './contexts/RouteContext';


const App = () => {
  console.log('App Component wird initialisiert');

  useEffect(() => {
    console.log('App useEffect wird ausgeführt');
    document.title = "Bikelin-Navigator 2.0";
  }, []);

  console.log('App rendert...');
  
  return (
    <Router>
      {console.log('Router wird gerendert')}
      <UserProvider>
        {console.log('UserProvider wird gerendert')}
        <RouteProvider>
          {console.log('RouteProvider wird gerendert')}
          <div className="container">
            {console.log('Container div wird gerendert')}
            <Routes>
              {console.log('Routes werden initialisiert')}
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