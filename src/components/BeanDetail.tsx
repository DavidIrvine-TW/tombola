'use client';

import Image from 'next/image';
import type { Bean } from '@/types';
import './BeanDetail.css';

interface BeanDetailProps {
  bean: Bean;
  onClose: () => void;
  onOrder: (bean: Bean) => void;
}

const colourBadgeColors: Record<string, string> = {
  'dark roast': 'bg-stone-800 text-white',
  'medium roast': 'bg-stone-600 text-white',
  'light roast': 'bg-stone-400 text-white',
  golden: 'bg-amber-100 text-amber-800',
  green: 'bg-emerald-100 text-emerald-800',
};

export function BeanDetail({ bean, onClose, onOrder }: BeanDetailProps) {
  const badgeColor = colourBadgeColors[bean.colour] || 'bg-stone-200 text-stone-700';

  return (
    <div className="detail-overlay">
      <div className="detail-dialog">

        <div className="relative">
          <Image src={bean.image} alt={bean.name} width={672} height={256} unoptimized className="detail-image" />

          <button
            onClick={onClose}
            className="detail-close-btn"
            aria-label="Close"
          >
            <svg className="detail-close-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {bean.isBOTD === 1 && (
            <div className="detail-botd-badge">
              Bean of the Day
            </div>
          )}
        </div>

        <div className="detail-body">
          <div className="detail-header">
            <h2 className="detail-name">
              {bean.name}
            </h2>
            <span className="detail-price">{bean.cost}</span>
          </div>

          <div className="detail-meta">
            <span className={`detail-badge ${badgeColor}`}>
              {bean.colour}
            </span>
            <span className="detail-country">
              <svg className="detail-country-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {bean.country}
            </span>
          </div>

          <div className="detail-description-section">
            <h3 className="detail-description-label">Description</h3>
            <p className="detail-description-text">{bean.description}</p>
          </div>

          <div className="detail-actions" id="order">
            <button onClick={() => onOrder(bean)} className="detail-order-btn">
              Order Now
            </button>
            <button onClick={onClose} className="detail-close-btn-action">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
