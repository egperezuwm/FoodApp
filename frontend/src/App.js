import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Login from './Components/Login';
import Dashboard from './Components/Dashboard';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null); // Store username or userID

  // handle logins for unique users:
  const handleLoginSuccess = (user) => {
    setUserInfo(user);
    setIsLoggedIn(true);
  };

  return (
    <Router> {/* Wrap everything in Router */}
      <div className="AppContainer">
        {isLoggedIn ? (
          <Dashboard user={userInfo} />
        ) : (
          <Login onLoginSuccess={handleLoginSuccess} />
        )}
      </div>
    </Router>
  );
}

export default App;