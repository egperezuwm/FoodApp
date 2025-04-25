// This is a simplified test file to isolate the analytics component
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './App.css';

// Simple dummy components for testing
const DummyDashboard = ({ onSwitchView }) => (
  <div style={{ padding: 20 }}>
    <h1>Dashboard</h1>
    <button onClick={onSwitchView}>Go to Analytics</button>
  </div>
);

const DummyAnalytics = ({ onSwitchView }) => (
  <div style={{ padding: 20 }}>
    <h1>Analytics</h1>
    <div style={{ marginBottom: 20 }}>
      <h2>Order Statistics</h2>
      <p>Total Orders: 124</p>
      <p>Completed Orders: 98</p>
      <p>Average Bill Amount: $105.42</p>
    </div>
    <button onClick={onSwitchView}>Go to Dashboard</button>
  </div>
);

// Simplified test App
function TestApp() {
  const [showAnalytics, setShowAnalytics] = useState(false);
  
  console.log('TestApp rendering, showAnalytics:', showAnalytics);
  
  return (
    <div className="App">
      {showAnalytics ? (
        <DummyAnalytics onSwitchView={() => setShowAnalytics(false)} />
      ) : (
        <DummyDashboard onSwitchView={() => setShowAnalytics(true)} />
      )}
    </div>
  );
}

// Render the test app
const rootElement = document.getElementById('root');
ReactDOM.render(<TestApp />, rootElement);

console.log('Test app script loaded and executed');