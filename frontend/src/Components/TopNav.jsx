import React from 'react';

function TopNav({ onLogout, showAnalyticsLink = true, onAnalyticsClick, onDashboardClick }) {
    const handleLogout = () => {
      // Clear localStorage
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('restaurant_name');
      
      // Call the logout function passed as prop
      if (onLogout) {
        onLogout();
      } else {
        // Fallback if onLogout isn't provided
        window.location.href = '/';
      }
    };

    const handleGenerateOrder = () => {
      fetch('http://localhost:8000/api/generate-order/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
      });
    };

    return (
      <nav className="top-nav">
        <ul>
          {showAnalyticsLink ? (
            <li>
              <button 
                className="nav-btn"
                onClick={onAnalyticsClick}
                style={{ marginRight: '10px' }}
              >
                Analytics
              </button>
            </li>
          ) : (
            <li>
              <button 
                className="nav-btn"
                onClick={onDashboardClick}
                style={{ marginRight: '10px' }}
              >
                Dashboard
              </button>
            </li>
          )}
          <li><button className="nav-btn" onClick={handleGenerateOrder}>Generate Order</button></li>
          <li style={{marginLeft: 'auto'}}><button className="nav-btn" onClick={handleLogout}>Logout</button></li>
        </ul>
      </nav>
    );
  }

  export default TopNav;