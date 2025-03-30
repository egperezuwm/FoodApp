import React, { useState } from 'react';
import Login from './Components/Login';
import Dashboard from './Components/Dashboard';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="AppContainer">
      {isLoggedIn ? (
        <Dashboard />
      ) : (
        <Login onLoginSuccess={() => setIsLoggedIn(true)} />
      )}
    </div>
  );
}

export default App;