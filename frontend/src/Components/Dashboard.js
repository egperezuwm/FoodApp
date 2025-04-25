import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import TopNav from './TopNav';
import OrderList from './OrderList';
import MapSection from './MapSection';
import './styles/Dashboard.css';


function Dashboard({ onLogout, showAnalytics }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [dismissedOrders, setDismissedOrders] = useState([]);
  const [showCompleted, setShowCompleted] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [newOrderAlert, setNewOrderAlert] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const seenOrderIdsRef = useRef(new Set());
  const [selectedOrderId, setSelectedOrderId] = useState(null);   // for selected orders

  useEffect(() => {
    console.log("Dashboard mounted, fetching data...");
    // Ensure authorization header is set
    axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem("access_token")}`;
  }, []); // set auth header once on mount

  const fetchDashboardData = async () => {
    try {
      const [pendingRes, completedRes] = await Promise.all([
        axios.get(`http://127.0.0.1:8000/api/dashboard/?status=pending`),
        axios.get(`http://127.0.0.1:8000/api/dashboard/?status=complete`)
      ]);
  
      const allOrders = [...pendingRes.data.orders, ...completedRes.data.orders];
  
      if (!showCompleted) {
        const currentPendingIds = pendingRes.data.orders.map(order => order.id);
        const trulyNewOrders = currentPendingIds.filter(id => !seenOrderIdsRef.current.has(id));
        if (trulyNewOrders.length > 0) {
          setNewOrderAlert(true);
          setTimeout(() => setNewOrderAlert(false), 3000);
          trulyNewOrders.forEach(id => seenOrderIdsRef.current.add(id));
        }
      }
  
      setDashboardData({
        ...pendingRes.data,
        orders: allOrders,
        pending_orders: pendingRes.data.orders.length,
        completed_orders: completedRes.data.orders.length,
      });
  
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };
  
  // Set up polling on mount
  useEffect(() => {
    fetchDashboardData(); // initial fetch
    const interval = setInterval(fetchDashboardData, 5000);
    return () => clearInterval(interval);
  }, []); // ← only run once on mount

  // Re-fetch when toggling view
  useEffect(() => {
    // Reset dismissed orders when switching views or when the order list changes
    setDismissedOrders([]); // should prevent completed orders from being dismissed.
    fetchDashboardData(); // force update when toggling view
  }, [showCompleted]);

  if (!dashboardData) {
    console.log('Dashboard data is not loaded yet');
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#f5f5f5'
      }}>
        <TopNav onLogout={handleLogout} showAnalyticsLink={true} onAnalyticsClick={showAnalytics} />
        <div style={{ marginTop: '100px' }}>
          <h2>Loading dashboard data...</h2>
          <p style={{ marginTop: '10px', color: '#666' }}>
            Connecting to the server...
          </p>
        </div>
      </div>
    );
  }

  // Extracting data
  const { restaurant, pending_orders, completed_orders, orders, customers } = dashboardData;

  const handleLogout = () => {
    // Navigate to login page
    onLogout();
  };

  const handleDismissOrder = (id) => {
    if (showCompleted) return; // ✅ Skip dismissing if we're in "Completed Orders" view
  
    const dismissedOrder = orders.find(order => order.id === id);
    if (dismissedOrder) {
      // Temporarily dismiss the order but it will reappear on next refresh
      setDismissedOrders(prev => [...prev, dismissedOrder]);
  
      // Show message
      setSuccessMessage("Order Completed ✔️");
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 2000);
    }
  };
  const visibleOrders = orders
  .filter(order => (showCompleted ? order.status === 'complete' : order.status === 'pending'))
  .filter(order => !dismissedOrders.some(d => d.id === order.id));

  return (
    <div className="dashboard-container">
      <TopNav onLogout={handleLogout} showAnalyticsLink={true} onAnalyticsClick={showAnalytics} />
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
          onSelect={id => setSelectedOrderId(id)} // "single-click" on Order-Card
          />

        {/* Map */}
        <MapSection orders={orders}
          customers={customers}
          restaurantPosition={[restaurant.location_lat, restaurant.location_lng]}
          restaurant={restaurant}
          selectedOrderId={selectedOrderId} />
      </div>
    </div>
  );
}

export default Dashboard;
