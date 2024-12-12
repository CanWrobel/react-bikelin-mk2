import React from 'react';
import './App.css';
import MainScreen from './components/MainScreen'; 
import  { useEffect } from 'react';


const App: React.FC = () => {
  useEffect(() => {
    document.title = "Bikelin-Navigator 2.0"; // Setzt den Titel der Seite
  }, []); // [] sorgt dafür, dass der Effekt nur einmal beim Laden der Komponente ausgeführt wird

  return (
    <div className="container">
      <MainScreen /> 
    </div>
  );
}

export default App;
