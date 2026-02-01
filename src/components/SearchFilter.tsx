'use client';

import { useState, useEffect } from 'react';
import type { FilterState } from '@/types';
import './SearchFilter.css';

interface SearchFilterProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  onClear: () => void;
}

export function SearchFilter({ filters, onFilterChange, onClear }: SearchFilterProps) {
  const [countries, setCountries] = useState<string[]>([]);
  const [colours, setColours] = useState<string[]>([]);

  useEffect(() => {
    Promise.all([
      fetch('/api/beans/countries').then((r) => r.json()),
      fetch('/api/beans/colours').then((r) => r.json()),
    ])
      .then(([c, co]) => {
        setCountries(c);
        setColours(co);
      })
      .catch(() => {});
  }, []);

  const hasActiveFilters = filters.search || filters.country || filters.colour;

  return (
    <div className="filter-wrapper">
      <div className="filter-row">
        <div className="filter-search-wrapper">
          <label htmlFor="search" className="filter-label">
            Search
          </label>
          <div className="filter-search-input-wrapper">
            <input
              id="search"
              type="text"
              placeholder="Search beans..."
              value={filters.search}
              onChange={(e) => onFilterChange({ search: e.target.value })}
              className="filter-search-input"
            />
            <svg
              className="filter-search-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="filter-select-wrapper">
          <label htmlFor="country" className="filter-label">
            Country
          </label>
          <select
            id="country"
            value={filters.country}
            onChange={(e) => onFilterChange({ country: e.target.value })}
            className="filter-select"
          >
            <option value="">All Countries</option>
            {countries.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="filter-select-wrapper">
          <label htmlFor="colour" className="filter-label">
            Roast Type
          </label>
          <select
            id="colour"
            value={filters.colour}
            onChange={(e) => onFilterChange({ colour: e.target.value })}
            className="filter-select"
          >
            <option value="">All Roasts</option>
            {colours.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="filter-clear-wrapper">
          <button
            onClick={onClear}
            disabled={!hasActiveFilters}
            className="filter-clear-btn"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
}
