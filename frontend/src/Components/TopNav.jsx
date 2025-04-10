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

    const handleGenerateOrder = async () => {
      console.log("clicked");
      const token = localStorage.getItem('access_token');
      console.log("Access Token:", token);  // 👈 See what you're sending
      try {
        const response = await fetch('http://localhost:8000/api/generate-order/', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json',
          },
        });
    
        const data = await response.json();
        console.log("✅ Order created:", data);
      } catch (error) {
        console.error("❌ Generate order failed:", error);
      }
    };

    return (
      <nav className="top-nav">
        <ul>
          {/*<li>Orders</li>       {/*press this to show most recent completed orders.*/}
          {/*<li>All Orders</li>   {/*press this to do a search of order history by day or service.*/}
          {/*<li>Analytics</li>    {/*press this to see all data within a time period.*/}
          {/*<li>MyProfile</li>    {/* admin only, press this to access admin functions.*/}
          <li><button className="nav-btn" onClick={handleGenerateOrder}>Generate Order</button></li>
          <li><button className="nav-btn">DoorDash</button></li>
          <li style={{marginLeft: 'auto'}}><button className="nav-btn" onClick={handleLogout}>Logout</button></li>
        </ul>
      </nav>
    );
  }

  export default TopNav;
