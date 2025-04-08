import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Login from './Components/Login';
import Dashboard from './Components/Dashboard';
import axios from 'axios';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null); // Store username or userID

  // handle logins for unique users:
  const handleLoginSuccess = ({username}) => {
    localStorage.setItem("username", username);
    setUserInfo({ username });
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setUserInfo(null);
    setIsLoggedIn(false);
    localStorage.removeItem("access_token");
    localStorage.removeItem("username");
  };
  
  // restores login from localStorage on page refresh
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const username = localStorage.getItem("username");
    if (token && username) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <Router> {/* Wrap everything in Router */}
      <div className="AppContainer">
        {isLoggedIn && userInfo ? (
          <Dashboard user={userInfo} onLogout={handleLogout} />
        ) : (
          <Login onLoginSuccess={handleLoginSuccess} />
        )}
      </div>
    </Router>
  );
}

export default App;