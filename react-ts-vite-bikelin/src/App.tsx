import React from 'react';
import './App.css';
import MainScreen from './components/MainScreen'; 
import { useEffect } from 'react';
import { UserProvider } from './contexts/UserContext';

const App = () => {
  useEffect(() => {
    document.title = "Bikelin-Navigator 2.0";
  }, []);

  return (
    <div className="container">
      <UserProvider>
        <MainScreen />
      </UserProvider>
    </div>
  );
}

export default App;
