import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TopNav from './TopNav';
import './styles/Analytics.css';

function Analytics({ onLogout, showDashboard }) {
  // Use dummy data to avoid API loading issues during testing
  const [analyticsData, setAnalyticsData] = useState({
    total_orders: 124,
    completed_orders: 98,
    completion_rate: 79.0,
    avg_bill_amount: 105.42,
    platform_distribution: [
      { platform: 'DoorDash', count: 50, percentage: 40.3 },
      { platform: 'UberEats', count: 42, percentage: 33.9 },
      { platform: 'GrubHub', count: 32, percentage: 25.8 }
    ],
    orders_by_hour: [
      { hour: 11, count: 12 },
      { hour: 12, count: 20 },
      { hour: 13, count: 18 },
      { hour: 14, count: 10 },
      { hour: 15, count: 8 },
      { hour: 16, count: 5 },
      { hour: 17, count: 10 },
      { hour: 18, count: 15 },
      { hour: 19, count: 16 },
      { hour: 20, count: 10 }
    ],
    avg_items_per_order: 3.2,
    total_revenue: 13072.36,
    revenue_by_platform: [
      { platform: 'DoorDash', revenue: 5283.45 },
      { platform: 'UberEats', revenue: 4523.78 },
      { platform: 'GrubHub', revenue: 3265.13 }
    ]
  });
  
  const [loading, setLoading] = useState(false); // Set to false to skip loading state
  const [error, setError] = useState(null);

  // Disable real API calls for now to focus on UI functionality
  /*
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem("access_token")}`;
        const response = await axios.get('http://127.0.0.1:8000/api/analytics/');
        setAnalyticsData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
        setError("Failed to load analytics data. Please try again later.");
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);
  */

  if (loading) return <div className="loading">Loading analytics...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!analyticsData) return <div className="no-data">No analytics data available</div>;

  const formatCurrency = (value) => {
    if (value === null || value === undefined) return '$0.00';
    return `$${parseFloat(value).toFixed(2)}`;
  };

  const formatPercent = (value) => {
    if (value === null || value === undefined) return '0%';
    return `${parseFloat(value).toFixed(1)}%`;
  };

  return (
    <div className="analytics-container">
      <TopNav onLogout={onLogout} showAnalyticsLink={false} onDashboardClick={showDashboard} />
      
      <div className="analytics-header">
        <h1>Order Analytics</h1>
        <p>Insights and metrics for your restaurant's delivery service</p>
      </div>

      <div className="analytics-grid">
        {/* Overview Cards */}
        <div className="analytics-card">
          <h3>Orders Overview</h3>
          <div className="stat-item">
            <span className="stat-label">Total Orders</span>
            <span className="stat-value">{analyticsData.total_orders}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Completed Orders</span>
            <span className="stat-value">{analyticsData.completed_orders}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Completion Rate</span>
            <span className="stat-value">{formatPercent(analyticsData.completion_rate)}</span>
          </div>
        </div>

        <div className="analytics-card">
          <h3>Revenue</h3>
          <div className="stat-item">
            <span className="stat-label">Total Revenue</span>
            <span className="stat-value">{formatCurrency(analyticsData.total_revenue)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Average Bill</span>
            <span className="stat-value">{formatCurrency(analyticsData.avg_bill_amount)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Avg Items Per Order</span>
            <span className="stat-value">{analyticsData.avg_items_per_order ? analyticsData.avg_items_per_order.toFixed(1) : '0'}</span>
          </div>
        </div>

        {/* Platform Distribution */}
        <div className="analytics-card platform-distribution">
          <h3>Platform Distribution</h3>
          {analyticsData.platform_distribution.map((platform) => (
            <div key={platform.platform} className="platform-stat">
              <div className="platform-info">
                <img 
                  src={`/assets/${platform.platform.toLowerCase()}.png`} 
                  alt={platform.platform}
                  className="platform-icon"
                />
                <span>{platform.platform}</span>
              </div>
              <div className="platform-bar-container">
                <div 
                  className="platform-bar" 
                  style={{ 
                    width: `${platform.percentage}%`,
                    backgroundColor: 
                      platform.platform === 'DoorDash' ? '#ff7b7b' : 
                      platform.platform === 'UberEats' ? '#7bff7b' : 
                      '#ffb27b'
                  }}
                ></div>
                <span className="platform-percent">{formatPercent(platform.percentage)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Revenue by Platform */}
        <div className="analytics-card revenue-by-platform">
          <h3>Revenue by Platform</h3>
          {analyticsData.revenue_by_platform.map((platform) => (
            <div key={platform.platform} className="platform-revenue">
              <div className="platform-info">
                <img 
                  src={`/assets/${platform.platform.toLowerCase()}.png`} 
                  alt={platform.platform}
                  className="platform-icon"
                />
                <span>{platform.platform}</span>
              </div>
              <span className="revenue-value">{formatCurrency(platform.revenue)}</span>
            </div>
          ))}
        </div>

        {/* Orders by Hour */}
        <div className="analytics-card orders-by-hour">
          <h3>Orders by Hour</h3>
          <div className="hour-chart">
            {analyticsData.orders_by_hour.map((hourData) => {
              const maxCount = Math.max(...analyticsData.orders_by_hour.map(h => h.count));
              const barHeight = maxCount > 0 ? (hourData.count / maxCount) * 100 : 0;
              
              return (
                <div key={hourData.hour} className="hour-bar-container">
                  <div 
                    className="hour-bar" 
                    style={{ height: `${barHeight}%` }}
                  ></div>
                  <span className="hour-label">{hourData.hour}</span>
                </div>
              );
            })}
          </div>
          <div className="hour-legend">
            <span>Hour of Day (24h)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;