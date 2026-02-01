'use client';

import { BeanCard } from './BeanCard';
import type { Bean } from '@/types';
import './BeanList.css';

interface BeanListProps {
  beans: Bean[];
  loading: boolean;
  error: string | null;
  onBeanClick: (bean: Bean) => void;
}

export function BeanList({ beans, loading, error, onBeanClick }: BeanListProps) {

  if (loading) {
    return (
      <div className="bean-grid">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bean-skeleton">
            <div className="bean-skeleton-image" />
            <div className="bean-skeleton-body">
              <div className="bean-skeleton-title" />
              <div className="bean-skeleton-meta" />
              <div className="bean-skeleton-desc" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bean-list-empty">
        <h3 className="bean-list-empty-title">Error loading beans</h3>
        <p className="bean-list-empty-text">{error}</p>
      </div>
    );
  }

  if (beans.length === 0) {
    return (
      <div className="bean-list-empty">
        <h3 className="bean-list-empty-title">No beans found</h3>
        <p className="bean-list-empty-text">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="bean-grid">
      {beans.map((bean) => (
        <BeanCard key={bean.id} bean={bean} onClick={onBeanClick} />
      ))}
    </div>
  );
}
