import React from 'react';
import './App.css';
import MainScreen from './components/MainScreen'; 
import DetailedWeatherComponent from './components/weather/DetailedWeatherComponent';
import { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';

const App = () => {
  useEffect(() => {
    document.title = "Bikelin-Navigator 2.0";
  }, []);

  return (
    <Router>
      <div className="container">
        <UserProvider>
          <Routes>
            <Route path="/" element={<MainScreen />} />
            <Route path="/incidents" element={<MainScreen />} />
            <Route path="/routes" element={<MainScreen />} />
            <Route path="/weather" element={<MainScreen />} />
            <Route path="/weather" element={<MainScreen />} />
            <Route path="/dweather" element={<DetailedWeatherComponent />} />
          </Routes>
        </UserProvider>
      </div>
    </Router>
  );
}

export default App;
