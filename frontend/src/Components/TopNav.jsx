import React from 'react';

function TopNav({ onLogout }) {
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

    return (
      <nav className="top-nav">
        <ul>
          <li>Orders</li>       {/*press this to show most recent completed orders.*/}
          <li>All Orders</li>   {/*press this to do a search of order history by day or service.*/}
          <li>Analytics</li>    {/*press this to see all data within a time period.*/}
          <li>MyProfile</li>    {/* admin only, press this to access admin functions.*/}
          <li className="logout-btn" onClick={handleLogout}>Logout</li>
        </ul>
      </nav>
    );
  }

  export default TopNav;
