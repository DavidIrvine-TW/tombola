'use client';

import { useState, useEffect, useCallback } from 'react';
import { BeanOfTheDay } from '@/components/BeanOfTheDay';
import { SearchFilter } from '@/components/SearchFilter';
import { BeanList } from '@/components/BeanList';
import { BeanDetail } from '@/components/BeanDetail';
import { OrderForm } from '@/components/OrderForm';
import type { Bean, FilterState } from '@/types';
import './page.css';

type ModalState =
  | { type: 'none' }
  | { type: 'detail'; bean: Bean }
  | { type: 'order'; bean: Bean }
  | { type: 'success' };

export default function Home() {
  const [beans, setBeans] = useState<Bean[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    country: '',
    colour: '',
  });
  const [modal, setModal] = useState<ModalState>({ type: 'none' });

  const fetchBeans = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filters.search) params.set('search', filters.search);
      if (filters.country) params.set('country', filters.country);
      if (filters.colour) params.set('colour', filters.colour);
      const query = params.toString();

      const res = await fetch(`/api/beans${query ? `?${query}` : ''}`);
      if (!res.ok) throw new Error('Failed to fetch beans');
      setBeans(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch beans');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const timeout = setTimeout(fetchBeans, 300);
    return () => clearTimeout(timeout);
  }, [fetchBeans]);

  const handleViewDetails = (bean: Bean) => setModal({ type: 'detail', bean });
  const handleOrder = (bean: Bean) => setModal({ type: 'order', bean });
  const closeModal = () => setModal({ type: 'none' });

  return (
    <>
      <BeanOfTheDay onViewDetails={handleViewDetails} />

      <section id="beans">
        <h2 className="browse-heading">
          Browse Our Collection
        </h2>

        <SearchFilter
          filters={filters}
          onFilterChange={(f) => setFilters((prev) => ({ ...prev, ...f }))}
          onClear={() => setFilters({ search: '', country: '', colour: '' })}
        />

        <BeanList beans={beans} loading={loading} error={error} onBeanClick={handleViewDetails} />
      </section>

      {modal.type === 'detail' && (
        <BeanDetail bean={modal.bean} onClose={closeModal} onOrder={handleOrder} />
      )}

      {modal.type === 'order' && (
        <OrderForm
          bean={modal.bean}
          onClose={closeModal}
          onSuccess={() => setModal({ type: 'success' })}
        />
      )}

      {modal.type === 'success' && (
        <div className="success-overlay">
          <div className="success-dialog">
            <div className="success-icon-wrapper">
              <svg className="success-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="success-title">Order Placed!</h2>
            <p className="success-message">
              Thank you for your order. We will send a confirmation email shortly.
            </p>
            <button onClick={closeModal} className="success-btn">
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </>
  );
}
