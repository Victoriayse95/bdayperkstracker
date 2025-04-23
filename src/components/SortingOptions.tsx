"use client";

import { useState } from 'react';

export type SortOption = 'expiry-asc' | 'expiry-desc' | 'business-asc' | 'business-desc' | 'month-asc' | 'month-desc';

interface SortingOptionsProps {
  onSortChange: (sortOption: SortOption) => void;
  currentSort: SortOption;
}

const SortingOptions = ({ onSortChange, currentSort }: SortingOptionsProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const sortOptions = [
    { value: 'expiry-asc', label: 'Expiry Date (Earliest First)' },
    { value: 'expiry-desc', label: 'Expiry Date (Latest First)' },
    { value: 'month-asc', label: 'Month (Jan to Dec)' },
    { value: 'month-desc', label: 'Month (Dec to Jan)' },
    { value: 'business-asc', label: 'Business Name (A-Z)' },
    { value: 'business-desc', label: 'Business Name (Z-A)' },
  ];

  const getSortLabel = (value: SortOption) => {
    return sortOptions.find(option => option.value === value)?.label || 'Sort By';
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        aria-haspopup="true"
      >
        <span>Sort: {getSortLabel(currentSort)}</span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 20 20" 
          fill="currentColor" 
          className={`w-5 h-5 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
        >
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg z-10"
          role="menu"
        >
          <div className="py-1">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  currentSort === option.value 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => {
                  onSortChange(option.value as SortOption);
                  setIsOpen(false);
                }}
                role="menuitem"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SortingOptions; 