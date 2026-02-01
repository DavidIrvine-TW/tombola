'use client';

import { useState, FormEvent } from 'react';
import type { Bean } from '@/types';
import './OrderForm.css';

interface OrderFormProps {
  bean: Bean;
  onClose: () => void;
  onSuccess: () => void;
}

export function OrderForm({ bean, onClose, onSuccess }: OrderFormProps) {
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const priceMatch = bean.cost.match(/[\d.]+/);
  const unitPrice = priceMatch ? parseFloat(priceMatch[0]) : 0;
  const totalPrice = (unitPrice * quantity).toFixed(2);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ beanId: bean.id, customerName, email, quantity }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create order');
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="order-overlay">
      <div className="order-dialog">

        <div className="order-header">
          <div className="order-header-inner">
            <h2 className="order-title">
              Place Order
            </h2>
            <button
              onClick={onClose}
              className="order-close-btn"
              aria-label="Close"
            >
              <svg className="order-close-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="order-form">

          <div className="order-bean-summary">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={bean.image} alt={bean.name} className="order-bean-image" />
            <div>
              <h3 className="order-bean-name">{bean.name}</h3>
              <p className="order-bean-price">{bean.cost} per unit</p>
            </div>
          </div>

          {error && (
            <div className="order-error">
              {error}
            </div>
          )}

          <div className="order-fields">
            <div>
              <label htmlFor="customerName" className="order-label">
                Your Name
              </label>
              <input
                id="customerName"
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="order-input"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="email" className="order-label">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="order-input"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label htmlFor="quantity" className="order-label">
                Quantity
              </label>
              <input
                id="quantity"
                type="number"
                min="1"
                max="100"
                required
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="order-input"
              />
            </div>
          </div>

          <div className="order-total-wrapper">
            <div className="order-total-inner">
              <span className="order-total-label">Total:</span>
              <span className="order-total-amount">&pound;{totalPrice}</span>
            </div>
          </div>

          <div className="order-actions">
            <button
              type="submit"
              disabled={loading}
              className="order-submit-btn"
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
            <button type="button" onClick={onClose} className="order-cancel-btn">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
