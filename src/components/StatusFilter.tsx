"use client";

import { useState } from 'react';

export type PerkStatus = 'To Redeem' | 'Redeemed';

interface StatusFilterProps {
  selectedStatuses: PerkStatus[];
  onStatusChange: (statuses: PerkStatus[]) => void;
}

const StatusFilter = ({ selectedStatuses, onStatusChange }: StatusFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const statuses: PerkStatus[] = ['To Redeem', 'Redeemed'];

  const toggleStatus = (status: PerkStatus) => {
    if (selectedStatuses.includes(status)) {
      onStatusChange(selectedStatuses.filter(s => s !== status));
    } else {
      onStatusChange([...selectedStatuses, status]);
    }
  };

  const clearAll = () => {
    onStatusChange([]);
  };

  const selectAll = () => {
    onStatusChange([...statuses]);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        aria-haspopup="true"
      >
        <span>
          {selectedStatuses.length === 0
            ? 'All Statuses'
            : selectedStatuses.length === statuses.length
            ? 'All Statuses'
            : `${selectedStatuses.length} Selected`}
        </span>
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
          className="absolute left-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-10"
          role="menu"
        >
          <div className="p-2 border-b border-gray-200 flex justify-between">
            <button
              className="text-xs text-indigo-600 hover:text-indigo-800"
              onClick={selectAll}
            >
              Select All
            </button>
            <button
              className="text-xs text-indigo-600 hover:text-indigo-800"
              onClick={clearAll}
            >
              Clear All
            </button>
          </div>
          <div className="py-1">
            {statuses.map((status) => (
              <div key={status} className="flex items-center px-3 py-2 hover:bg-gray-50">
                <input
                  type="checkbox"
                  id={`status-${status}`}
                  checked={selectedStatuses.includes(status)}
                  onChange={() => toggleStatus(status)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label
                  htmlFor={`status-${status}`}
                  className="ml-2 block text-sm text-gray-700 cursor-pointer"
                >
                  {status}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusFilter; 