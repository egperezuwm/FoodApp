// src/components/Dashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem("access_token")}`;
        const response = await axios.get('http://127.0.0.1:8000/api/dashboard/');
        setDashboardData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  if (!dashboardData) return <div>Loading...</div>;

  return (
    <div style={{ margin: '2rem' }}>
      <h2>Dashboard</h2>
      <p>Welcome, <strong>{dashboardData.user}</strong>!</p>
      <ul>
        <li>Orders Today: {dashboardData.orders_today}</li>
        <li>Total Revenue: ${dashboardData.total_revenue}</li>
        <li>Pending Orders: {dashboardData.pending_orders}</li>
      </ul>
    </div>
  );
};

export default Dashboard;
