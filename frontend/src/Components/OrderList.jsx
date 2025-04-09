import React from 'react';
import OrderCard from './OrderCard';

function OrderList({ orders, onDismiss, isCompleted }) {
  return (
    <div className="order-list">
      <h3>{isCompleted ? "Completed Orders" : "Current Orders"}</h3>
      {orders.length > 0 ? (
        orders.map(order => <OrderCard key={order.id} order={order} onDismiss={isCompleted ? null : onDismiss}/>)
      ) : (
        <p>{isCompleted ? "No completed orders" : "No active orders"}</p>
      )}
    </div>
  );
}

export default OrderList;