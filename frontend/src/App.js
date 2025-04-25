import React, { useState, useEffect } from 'react';
import Login from './Components/Login';
import Dashboard from './Components/Dashboard';
import Analytics from './Components/Analytics';
import axios from 'axios';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null); // Store username or userID
  const [currentView, setCurrentView] = useState('dashboard');

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
  
  // State to track if auth check is complete
  const [authCheckComplete, setAuthCheckComplete] = useState(false);
  
  // restores login from localStorage on page refresh
  useEffect(() => {
    console.log("Checking authentication...");
    
    // Clear any previous auth settings
    setIsLoggedIn(false);
    setUserInfo(null);
    
    const token = localStorage.getItem("access_token");
    const username = localStorage.getItem("username");
    
    if (token && username) {
      console.log("Found token and username in localStorage");
      // Test the token validity with a ping request
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      
      // Optional: You could validate the token here with a lightweight API call
      // For now, just set the login state
      setUserInfo({ username });
      setIsLoggedIn(true);
    } else {
      console.log("No valid auth credentials found");
      // Ensure any potentially invalid tokens are removed
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("username");
    }
    
    // Mark auth check as complete
    setAuthCheckComplete(true);
    console.log("Auth check completed");
  }, []);

  // Navigation functions
  const showDashboard = () => {
    console.log('Switching to Dashboard view');
    setCurrentView('dashboard');
  };
  
  const showAnalytics = () => {
    console.log('Switching to Analytics view');
    setCurrentView('analytics');
  };

  // Render the appropriate view
  const renderContent = () => {
    console.log('Rendering content. authCheckComplete:', authCheckComplete, 'isLoggedIn:', isLoggedIn, 'currentView:', currentView);
    
    // Show loading indicator while checking authentication
    if (!authCheckComplete) {
      console.log('Auth check in progress, showing loading...');
      return <div className="app-loading">Initializing...</div>;
    }
    
    if (!isLoggedIn) {
      console.log('Showing Login component');
      return <Login onLoginSuccess={handleLoginSuccess} />;
    }

    switch (currentView) {
      case 'analytics':
        console.log('Showing Analytics component');
        return <Analytics onLogout={handleLogout} showDashboard={showDashboard} />;
      case 'dashboard':
      default:
        console.log('Showing Dashboard component');
        return <Dashboard user={userInfo} onLogout={handleLogout} showAnalytics={showAnalytics} />;
    }
  };

  return (
    <div className="AppContainer">
      {renderContent()}
    </div>
  );
}

export default App;