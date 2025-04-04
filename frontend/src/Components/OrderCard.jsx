import React from 'react';

function OrderCard({ order, onDismiss }) {
  const { id, customer_name, item_count, total_cost, eta, platform, status, completed_at } = order;

  const handleDoubleClick = () => {
    if (typeof onDismiss === 'function') {
      onDismiss(id);
    }
  };

  return (
    <div className="order-card" onDoubleClick={handleDoubleClick}>
      <h3>{platform} for {customer_name}</h3>
      <p>{item_count} items - ${Number(total_cost || 0).toFixed(2)}</p>
      <p style={{ fontWeight: 'bold', color: eta === 'Arriving' ? 'red' : 'black' }}>
          ETA: {eta > 0 ? `${eta} min` : 'Arrived'}
      </p>
      {status === "Complete" && completed_at && (
        <p style={{ fontSize: '0.9rem', color: '#666' }}>
          Completed at: {new Date(completed_at).toLocaleTimeString()}
        </p>
      )}
    </div>
  );
}

export default OrderCard;