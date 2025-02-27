import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TopNav from './TopNav';
import OrderList from './OrderList';
import MapSection from './MapSection';
import '../dashboard.css';

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);

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
  }, []);

  if (!dashboardData) return <div>Loading...</div>;

  // Extracting data
  const { user, total_revenue, pending_orders, orders, drivers, customers } = dashboardData;

  return (
    <div className="dashboard-container">
      <TopNav />
      <div className="dashboard-stats">
        <h2>Dashboard</h2>
        <p>Welcome, {user}!</p>
        <p>Total Revenue: ${total_revenue}</p>
        <p>Pending Orders: {pending_orders}</p>
      </div>

      <div className="dashboard-main">
        {/* Order List */}
        <OrderList orders={orders} />

        {/* Map */}
        <MapSection drivers={drivers} customers={customers} />
      </div>
    </div>
  );
}

export default Dashboard;