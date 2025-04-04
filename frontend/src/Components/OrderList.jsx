import React from 'react';
import OrderCard from './OrderCard';

function OrderList({ orders, onDismiss }) {
  return (
    <div className="order-list">
      <h3>Current Orders</h3>
      {orders.length > 0 ? (
        orders.map(order => <OrderCard key={order.id} order={order} onDismiss={onDismiss}/>)
      ) : (
        <p>No active orders</p>
      )}
    </div>
  );
}

export default OrderList;