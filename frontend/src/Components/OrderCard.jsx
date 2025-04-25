import React from 'react';

function OrderCard({ order, onDismiss, isCompleted, onSelect }) {
  const { id, customer_name, item_count, total_cost, eta, platform, status, completed_at } = order;

  const handleDoubleClick = async () => {
    await fetch(`http://127.0.0.1:8000/api/orders/${id}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      },
      body: JSON.stringify({ status: 'complete' }),
    });
    if (typeof onDismiss === 'function') {
      onDismiss(id);
    }
  };

  const handleRecall = async (e) => {
    e.stopPropagation(); // Prevent double-click from triggering
    await fetch(`http://127.0.0.1:8000/api/orders/${id}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      },
      body: JSON.stringify({ status: 'pending' }),
    });
    if (typeof onDismiss === 'function') {
      onDismiss(id);
    }
  };

  const platformStyles = {
    DoorDash: { backgroundColor: '#ffcccc' },  // Stronger soft red
    UberEats: { backgroundColor: '#ccffcc' },  // Stronger soft green
    GrubHub: { backgroundColor: '#ffe0b3' }   // Stronger soft orange
  };

  return (
    <div
      className="order-card"
      style={platformStyles[platform]}
      onClick={() => onSelect?.(id)} // Triggers popup selection
      onDoubleClick={!isCompleted ? handleDoubleClick : null}
    >      <h3>{platform} for {customer_name}</h3>
      <p>{item_count} items - ${Number(total_cost || 0).toFixed(2)}</p>
      <p style={{ fontWeight: 'bold', color: eta === 'Arriving' ? 'red' : 'black' }}>
        ETA: {eta > 0 ? `${eta} min` : 'Arrived'}
      </p>
      {status === "complete" && completed_at && (
        <>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>
            Completed at: {new Date(completed_at).toLocaleTimeString()}
          </p>
          <button
            className="recall-button"
            onClick={handleRecall}
            style={{
              backgroundColor: '#4a90e2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '5px 10px',
              cursor: 'pointer',
              marginTop: '8px'
            }}
          >
            Recall Order
          </button>
        </>
      )}
    </div>
  );
}

export default OrderCard;