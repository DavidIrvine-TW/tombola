'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import type { Bean } from '@/types';
import './BeanOfTheDay.css';

interface BeanOfTheDayProps {
  onViewDetails: (bean: Bean) => void;
}

export function BeanOfTheDay({ onViewDetails }: BeanOfTheDayProps) {
  const [botd, setBotd] = useState<Bean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/botd')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setBotd(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="botd-skeleton">
        <div className="botd-skeleton-title" />
        <div className="botd-skeleton-body" />
      </div>
    );
  }

  if (!botd) return null;

  return (
    <div className="botd-wrapper">
      <div className="botd-layout">
        <div className="botd-image-wrapper">
          <Image src={botd.image} alt={botd.name} width={600} height={400} className="botd-image" />
        </div>

        <div className="botd-content">
          <span className="botd-label">
            Bean of the Day
          </span>

          <h2 className="botd-name">
            {botd.name}
          </h2>

          <p className="botd-country">
            from <span className="botd-country-name">{botd.country}</span>
          </p>

          <p className="botd-description">{botd.description}</p>

          <div className="botd-footer">
            <span className="botd-price">{botd.cost}</span>
            <button
              onClick={() => onViewDetails(botd)}
              className="botd-view-btn"
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
