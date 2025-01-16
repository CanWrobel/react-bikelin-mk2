import React from 'react';
import './App.css';
import MainScreen from './components/MainScreen'; 
import IncidentsScreen from './components/IncidentsScreen'; // Komponente, die Sie für /incidents verwenden möchten
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
          </Routes>
        </UserProvider>
      </div>
    </Router>
  );
}

export default App;
