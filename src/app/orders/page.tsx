'use client';

import { useEffect, useState } from 'react';
import './page.css';

interface Order {
  id: number;
  beanName: string;
  customerName: string;
  email: string;
  quantity: number;
  totalCost: string;
  createdAt: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    fetch('/api/orders')
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="orders-loading">
        <h2 className="orders-heading">Orders</h2>
        <div className="skeleton-list">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton-row" />
          ))}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="orders-empty">
        <h2 className="orders-empty-heading">Orders</h2>
        <p className="orders-empty-text">No orders placed yet.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="orders-header">
        <h2 className="orders-heading">Orders</h2>
        <button
          onClick={() => setShowConfirm(true)}
          className="clear-all-btn"
        >
          Clear all
        </button>
      </div>

      {showConfirm && (
        <div className="confirm-overlay">
          <div className="confirm-dialog">
            <h3 className="confirm-title">Clear all orders?</h3>
            <p className="confirm-message">This will permanently remove all orders. This action cannot be undone.</p>
            <div className="confirm-actions">
              <button
                onClick={() => setShowConfirm(false)}
                className="confirm-cancel-btn"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await fetch('/api/orders', { method: 'DELETE' });
                  setOrders([]);
                  setShowConfirm(false);
                }}
                className="confirm-delete-btn"
              >
                Clear all
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table for md+ screens */}
      <div className="orders-table-wrapper">
        <table className="orders-table">
          <thead className="orders-table-head">
            <tr>
              <th className="orders-th">Order #</th>
              <th className="orders-th">Bean</th>
              <th className="orders-th">Customer</th>
              <th className="orders-th">Email</th>
              <th className="orders-th-right">Qty</th>
              <th className="orders-th-right">Total</th>
              <th className="orders-th">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="orders-tr">
                <td className="orders-td-id">{order.id}</td>
                <td className="orders-td">{order.beanName}</td>
                <td className="orders-td">{order.customerName}</td>
                <td className="orders-td-email">{order.email}</td>
                <td className="orders-td-right">{order.quantity}</td>
                <td className="orders-td-total">{order.totalCost}</td>
                <td className="orders-td-date">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards for small screens */}
      <div className="orders-cards">
        {orders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-card-header">
              <span className="order-card-id">Order #{order.id}</span>
              <span className="order-card-total">{order.totalCost}</span>
            </div>
            <p className="order-card-bean">{order.beanName} &times; {order.quantity}</p>
            <p className="order-card-name">{order.customerName}</p>
            <p className="order-card-email">{order.email}</p>
            <p className="order-card-date">{new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
