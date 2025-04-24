import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TopNav from './TopNav';
import OrderList from './OrderList';
import MapSection from './MapSection';
import './styles/Dashboard.css';


function Dashboard({ onLogout }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [dismissedOrders, setDismissedOrders] = useState([]);
  const [showCompleted, setShowCompleted] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [prevOrderIds, setPrevOrderIds] = useState([]);
  const [newOrderAlert, setNewOrderAlert] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem("access_token")}`;

    const fetchDashboardData = async () => {
      try {
        const status = showCompleted ? 'complete' : 'pending';
        const response = await axios.get(`http://127.0.0.1:8000/api/dashboard/?status=${status}`);

        const currentOrderIds = response.data.orders.map(order => order.id);
        const newOrders = currentOrderIds.filter(id => !prevOrderIds.includes(id));

        if (newOrders.length > 0 && !showCompleted) {
          setNewOrderAlert(true);
          setTimeout(() => setNewOrderAlert(false), 3000); // Hide after 3 seconds
        }
        
        // Reset dismissed orders when switching views or when the order list changes
        setDismissedOrders([]);
        
        setPrevOrderIds(currentOrderIds);
        setDashboardData(response.data);
        setLastUpdated(new Date().toLocaleTimeString());
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 5000); // repeat every 5s
    return () => clearInterval(interval); // cleanup on unmount
  }, [showCompleted]);

  if (!dashboardData) return <div>Loading...</div>;

  // Extracting data
  const { restaurant, pending_orders, completed_orders, orders, customers } = dashboardData;

  const handleLogout = () => {
    // Navigate to login page
    onLogout();
  };

  const handleDismissOrder = (id) => {
    const dismissedOrder = orders.find(order => order.id === id);
    if (dismissedOrder) {
      // Temporarily dismiss the order but it will reappear on next refresh
      setDismissedOrders(prev => [...prev, dismissedOrder]);

      // Show different messages based on the current view
      if (showCompleted) {
        setSuccessMessage("Order Recalled ↩️");
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 2000);
      } else {
        setSuccessMessage("Order Completed ✔️");
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 2000);
      }
    }
  };
  const visibleOrders = orders.filter(order => !dismissedOrders.some(d => d.id === order.id));

  return (
    <div className="dashboard-container">
      <TopNav onLogout={handleLogout} />
      <div className="dashboard-stats-bar">
        <h2>{restaurant.name} Dashboard</h2>
        <div className="stats-group">
          <p>Pending Orders: {pending_orders} Completed Orders: {completed_orders}</p>
        </div>
        <button
          className="toggle-orders-btn"
          onClick={() => setShowCompleted(!showCompleted)}
        >
          {showCompleted ? "View Current Orders" : "View Completed Orders"}
        </button>
        {lastUpdated && (
          <div className="dashboard-refresh-info">
            Last updated: {lastUpdated}
          </div>
        )}
      </div>

      
      {newOrderAlert && (<div className="floating-neworder-msg">🛎️ New Order Received!</div>)}
      {showSuccessMessage && (<div className="floating-success-msg">{successMessage}</div>)}

      <div className="dashboard-main">
        {/* Order List */}
        <OrderList
          orders={visibleOrders}
          onDismiss={handleDismissOrder}
          isCompleted={showCompleted}
        />

        {/* Map */}
        <MapSection orders={orders} customers={customers}
          restaurantPosition={[restaurant.location_lat, restaurant.location_lng]}
          restaurant={restaurant}/>
      </div>
    </div>
  );
}

export default Dashboard;
