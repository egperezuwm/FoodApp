import React from 'react';

function OrderCard({ order }) {
  const { customer_name, item_count, total_cost, eta, platform } = order;

  return (
    <div className="order-card">
      <h3>{platform} for {customer_name}</h3>
      <p>{item_count} items - ${Number(total_cost || 0).toFixed(2)}</p>
      <p style={{ fontWeight: 'bold', color: eta === 'Arriving' ? 'red' : 'black' }}>
        ETA: {eta} MINUTES
      </p>
    </div>
  );
}

export default OrderCard;