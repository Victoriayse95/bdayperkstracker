"use client";

import { useState, useEffect } from 'react';

interface SearchBarProps {
  onSearch: (term: string) => void;
  placeholder?: string;
}

const SearchBar = ({ onSearch, placeholder = "Search perks..." }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Debounce search term to avoid too many search calls
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, onSearch]);

  return (
    <div className="relative flex-1 max-w-md">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <svg 
          className="w-5 h-5 text-gray-500" 
          fill="currentColor" 
          viewBox="0 0 20 20" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            fillRule="evenodd" 
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" 
            clipRule="evenodd"
          />
        </svg>
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        placeholder={placeholder}
        aria-label="Search"
      />
      {searchTerm && (
        <button
          className="absolute inset-y-0 right-0 flex items-center pr-3"
          onClick={() => setSearchTerm('')}
          aria-label="Clear search"
        >
          <svg 
            className="w-5 h-5 text-gray-500 hover:text-gray-700" 
            fill="currentColor" 
            viewBox="0 0 20 20" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              fillRule="evenodd" 
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default SearchBar; 