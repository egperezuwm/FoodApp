import React from 'react';

function OrderCard({ order }) {
  const { customerName, itemCount, total_cost, eta, platform } = order;

  return (
    <div className="order-card">
      <h3>{platform} for {customerName}</h3>
      <p>{itemCount} items - ${total_cost.toFixed(2)}</p>
      <p style={{ fontWeight: 'bold', color: eta === 'Arriving' ? 'red' : 'black' }}>
        ETA: {eta}
      </p>
    </div>
  );
}

export default OrderCard;