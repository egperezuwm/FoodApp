import React, { useEffect, useState } from 'react';

function OrderCard({ order }) {
  const { customer_name, item_count, total_cost, eta: initialEta, platform } = order;
  const [eta, setEta] = useState(initialEta);

  useEffect(() => {
    if (eta > 0) {
      const timer = setInterval(() => {
        setEta(prev => prev - 1);
      }, 60000); // subtract 1 every 60,000 miliseconds
      return () => clearInterval(timer); // clean up
    }
  }, [eta]);

  return (
    <div className="order-card">
      <h3>{platform} for {customer_name}</h3>
      <p>{item_count} items - ${Number(total_cost || 0).toFixed(2)}</p>
      <p style={{ fontWeight: 'bold', color: eta === 'Arriving' ? 'red' : 'black' }}>
          ETA: {eta > 0 ? `${eta} min` : 'Arrived'}
      </p>
    </div>
  );
}

export default OrderCard;