import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TopNav from './TopNav';
import OrderList from './OrderList';
import MapSection from './MapSection';
//import { useNavigate } from 'react-router-dom';
import './styles/dashboard.css';


function Dashboard({onLogout}) {
  const [dashboardData, setDashboardData] = useState(null);
  //const navigate = useNavigate();
  const [dismissedOrders, setDismissedOrders] = useState([]);

  useEffect(() => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem("access_token")}`;

    const fetchDashboardData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/dashboard/');
        setDashboardData(response.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 5000); // repeat every 5s
    return () => clearInterval(interval); // cleanup on unmount
  }, []);

  if (!dashboardData) return <div>Loading...</div>;

  // Extracting data
  const { user, pending_orders, orders, drivers, customers } = dashboardData;

  const handleLogout = () => {
    // Navigate to login page
    onLogout();
    //navigate('/');
  };
  
  const handleDismissOrder = (id) => {
    const dismissedOrder = orders.find(order => order.id === id);
    if (dismissedOrder) {
      setDismissedOrders(prev => [...prev, dismissedOrder]);
    }
  };
  const visibleOrders = orders.filter(order => !dismissedOrders.some(d => d.id === order.id));
  
  return (
    <div className="dashboard-container">
      <TopNav onLogout={handleLogout} />
      <div className="dashboard-stats">
        <h2>{user}'s Dashboard</h2>
        <p>Pending Orders: {pending_orders}</p>
      </div>

      <div className="dashboard-main">
        {/* Order List */}
        <OrderList orders={visibleOrders} onDismiss={handleDismissOrder} />

        {/* Map */}
        <MapSection drivers={drivers} customers={customers} />
      </div>
    </div>
  );
}

export default Dashboard;