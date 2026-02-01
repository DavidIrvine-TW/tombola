'use client';

import Image from 'next/image';
import type { Bean } from '@/types';
import './BeanCard.css';

interface BeanCardProps {
  bean: Bean;
  onClick: (bean: Bean) => void;
}

const colourBadgeColors: Record<string, string> = {
  'dark roast': 'bg-stone-800 text-white',
  'medium roast': 'bg-stone-600 text-white',
  'light roast': 'bg-stone-400 text-white',
  golden: 'bg-amber-100 text-amber-800',
  green: 'bg-emerald-100 text-emerald-800',
};

export function BeanCard({ bean, onClick }: BeanCardProps) {
  const badgeColor = colourBadgeColors[bean.colour] || 'bg-stone-200 text-stone-700';

  return (
    <div className="bean-card group" onClick={() => onClick(bean)}>
      <div className="bean-card-image-wrapper">
        <Image
          src={bean.image}
          alt={bean.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="bean-card-image"
        />
      </div>

      <div className="bean-card-body">
        <div className="bean-card-header">
          <h3 className="bean-card-name">{bean.name}</h3>
          <span className="bean-card-price">{bean.cost}</span>
        </div>

        <div className="bean-card-meta">
          <span className={`bean-card-badge ${badgeColor}`}>
            {bean.colour}
          </span>
          <span className="bean-card-country">{bean.country}</span>
        </div>

        <p className="bean-card-description">{bean.description}</p>
      </div>
    </div>
  );
}
