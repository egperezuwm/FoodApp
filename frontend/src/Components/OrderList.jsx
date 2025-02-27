import React from 'react';
import OrderCard from './OrderCard';

function OrderList({ orders }) {
  return (
    <div className="order-list">
      <h3>Current Orders</h3>
      {orders.length > 0 ? (
        orders.map(order => <OrderCard key={order.id} order={order} />)
      ) : (
        <p>No active orders</p>
      )}
    </div>
  );
}

export default OrderList;