"use client";

import { useState } from 'react';

export type PerkCategory = 'food' | 'beauty' | 'retail' | 'entertainment' | 'other';

interface CategoryFilterProps {
  selectedCategories: PerkCategory[];
  onCategoryChange: (categories: PerkCategory[]) => void;
}

const CategoryFilter = ({ selectedCategories, onCategoryChange }: CategoryFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const categories: PerkCategory[] = ['food', 'beauty', 'retail', 'entertainment', 'other'];
  
  const toggleCategory = (category: PerkCategory) => {
    const newSelectedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    
    onCategoryChange(newSelectedCategories);
  };
  
  const selectAllCategories = () => {
    onCategoryChange([...categories]);
  };
  
  const clearAllCategories = () => {
    onCategoryChange([]);
  };
  
  const getCategoryLabel = (category: PerkCategory): string => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <div className="relative">
      <button
        type="button"
        className="inline-flex justify-between items-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        Categories ({selectedCategories.length})
        <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1 border-b">
            <button
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={selectAllCategories}
            >
              Select All
            </button>
            <button
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={clearAllCategories}
            >
              Clear All
            </button>
          </div>
          <div className="py-1">
            {categories.map((category) => (
              <div key={category} className="flex items-center px-4 py-2 hover:bg-gray-100">
                <input
                  id={`category-${category}`}
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  checked={selectedCategories.includes(category)}
                  onChange={() => toggleCategory(category)}
                />
                <label
                  htmlFor={`category-${category}`}
                  className="ml-3 block text-sm text-gray-700 cursor-pointer"
                >
                  {getCategoryLabel(category)}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryFilter; 