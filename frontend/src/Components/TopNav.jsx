import React from 'react';

function TopNav() {
    return (
      <nav className="top-nav">
        <ul>
          <li>Orders</li>       {/*press this to show most recent completed orders.*/}
          <li>All Orders</li>   {/*press this to do a search of order history by day or service.*/}
          <li>Analytics</li>    {/*press this to see all data within a time period.*/}
          <li>MyProfile</li>    {/* admin only, press this to access admin functions.*/}
        </ul>
      </nav>
    );
  }

  export default TopNav;
