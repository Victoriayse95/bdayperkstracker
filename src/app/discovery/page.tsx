"use client";

import { useState } from 'react';
import Link from 'next/link';

// TypeScript interface for businesses with perks
interface BusinessPerk {
  id: number;
  business: string;
  category: string;
  description: string;
  value: string;
  requirements: string;
  location: string;
  distance: number;
  rating: number;
  imageUrl: string;
  website: string;
  favorite: boolean;
}

export default function DiscoveryPage() {
  // Sample businesses with perks
  const [businesses, setBusinesses] = useState<BusinessPerk[]>([
    {
      id: 1,
      business: "Starbucks",
      category: "Coffee & Beverages",
      description: "Free drink of your choice during your birthday month",
      value: "$5+",
      requirements: "Starbucks Rewards membership",
      location: "Multiple locations",
      distance: 0.5,
      rating: 4.3,
      imageUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/Starbucks_Corporation_Logo_2011.svg/1200px-Starbucks_Corporation_Logo_2011.svg.png",
      website: "https://www.starbucks.com/rewards",
      favorite: false
    },
    {
      id: 2,
      business: "Sephora",
      category: "Beauty",
      description: "Free beauty gift during your birthday month",
      value: "$10+",
      requirements: "Beauty Insider membership",
      location: "Local mall",
      distance: 3.2,
      rating: 4.5,
      imageUrl: "https://logos-world.net/wp-content/uploads/2020/11/Sephora-Logo.png",
      website: "https://www.sephora.com/beauty-insider",
      favorite: true
    },
    {
      id: 3,
      business: "Baskin-Robbins",
      category: "Food & Dessert",
      description: "Free ice cream scoop during your birthday month",
      value: "$3",
      requirements: "Birthday club membership",
      location: "123 Main St",
      distance: 1.8,
      rating: 4.1,
      imageUrl: "https://logos-world.net/wp-content/uploads/2020/11/Baskin-Robbins-Logo.png",
      website: "https://www.baskinrobbins.com/en/birthday-club",
      favorite: false
    },
    {
      id: 4,
      business: "Ulta Beauty",
      category: "Beauty",
      description: "Free beauty gift with any purchase during your birthday month",
      value: "$15",
      requirements: "Ultamate Rewards membership",
      location: "456 Market St",
      distance: 4.5,
      rating: 4.4,
      imageUrl: "https://logos-world.net/wp-content/uploads/2021/11/Ulta-Beauty-Logo.png",
      website: "https://www.ulta.com/ultamate-rewards",
      favorite: false
    },
    {
      id: 5,
      business: "Denny's",
      category: "Restaurants",
      description: "Free Grand Slam breakfast on your birthday",
      value: "$8",
      requirements: "Valid ID",
      location: "789 Broadway",
      distance: 2.3,
      rating: 3.8,
      imageUrl: "https://logos-world.net/wp-content/uploads/2021/09/Dennys-Logo.png",
      website: "https://www.dennys.com",
      favorite: false
    },
    {
      id: 6,
      business: "Cheesecake Factory",
      category: "Restaurants",
      description: "Free slice of cheesecake during your birthday month",
      value: "$9",
      requirements: "Purchase of entree required",
      location: "300 Center Dr",
      distance: 5.6,
      rating: 4.2,
      imageUrl: "https://logos-world.net/wp-content/uploads/2021/09/The-Cheesecake-Factory-Logo.png",
      website: "https://www.thecheesecakefactory.com",
      favorite: false
    }
  ]);
  
  // State for filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('distance');
  const [maxDistance, setMaxDistance] = useState(10);
  
  // Get all unique categories
  const categories = ['All', ...new Set(businesses.map(b => b.category))];
  
  // Filter and sort businesses
  const filteredBusinesses = businesses
    .filter(business => {
      // Apply search filter
      const matchesSearch = searchTerm === '' || 
        business.business.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Apply category filter
      const matchesCategory = selectedCategory === '' || selectedCategory === 'All' || 
        business.category === selectedCategory;
      
      // Apply distance filter
      const matchesDistance = business.distance <= maxDistance;
      
      return matchesSearch && matchesCategory && matchesDistance;
    })
    .sort((a, b) => {
      // Apply sorting
      if (sortBy === 'distance') {
        return a.distance - b.distance;
      } else if (sortBy === 'rating') {
        return b.rating - a.rating;
      } else if (sortBy === 'value') {
        return parseFloat(b.value.replace(/[^0-9.]/g, '')) - parseFloat(a.value.replace(/[^0-9.]/g, ''));
      }
      return 0;
    });
  
  // Toggle favorite status
  const toggleFavorite = (id: number) => {
    setBusinesses(businesses.map(business => 
      business.id === id ? { ...business, favorite: !business.favorite } : business
    ));
  };
  
  // Save perk to personal tracker
  const saveToPerkTracker = (business: BusinessPerk) => {
    alert(`Added ${business.business} to your Personal Tracker!`);
    // In a real app, this would integrate with the personal tracker feature
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Discovery</h1>
        <p className="text-lg text-gray-600">Discover new perks from businesses near you</p>
      </div>
      
      {/* Filters and Search */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search businesses or perks"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="distance">Distance</option>
              <option value="rating">Rating</option>
              <option value="value">Value</option>
            </select>
          </div>
        </div>
        
        <div className="mt-4">
          <label htmlFor="distance" className="block text-sm font-medium text-gray-700 mb-1">
            Maximum Distance: {maxDistance} miles
          </label>
          <input
            type="range"
            id="distance"
            min="1"
            max="25"
            value={maxDistance}
            onChange={(e) => setMaxDistance(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
      
      {/* Businesses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBusinesses.length > 0 ? (
          filteredBusinesses.map(business => (
            <div key={business.id} className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col">
              {/* Business Image */}
              <div className="relative h-40 bg-gray-100">
                <img 
                  src={business.imageUrl} 
                  alt={business.business} 
                  className="w-full h-full object-contain p-4"
                />
                <button 
                  onClick={() => toggleFavorite(business.id)}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-white shadow-md"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill={business.favorite ? "currentColor" : "none"}
                    stroke={business.favorite ? "none" : "currentColor"}
                    className={`w-5 h-5 ${business.favorite ? 'text-red-500' : 'text-gray-400'}`}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                </button>
              </div>
              
              {/* Business Info */}
              <div className="p-5 flex-grow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{business.business}</h3>
                    <p className="text-sm text-gray-500">{business.category}</p>
                  </div>
                  <div className="flex items-center bg-gray-100 rounded-lg px-2 py-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="ml-1 text-sm font-medium">{business.rating}</span>
                  </div>
                </div>
                
                <div className="mt-3">
                  <p className="text-sm text-gray-700">{business.description}</p>
                </div>
                
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Value: {business.value}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {business.distance} mi away
                  </span>
                </div>
                
                <div className="mt-3 text-xs text-gray-500">
                  <p><span className="font-medium">Requirements:</span> {business.requirements}</p>
                  <p><span className="font-medium">Location:</span> {business.location}</p>
                </div>
              </div>
              
              {/* Actions */}
              <div className="p-5 pt-0 border-t border-gray-100 mt-auto">
                <div className="flex space-x-3">
                  <button 
                    onClick={() => saveToPerkTracker(business)}
                    className="flex-1 px-3 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-sm font-medium rounded-lg shadow-sm hover:from-purple-600 hover:to-indigo-700 transition-all duration-200"
                  >
                    Save to Tracker
                  </button>
                  <a 
                    href={business.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-3 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Website
                  </a>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="md:col-span-2 lg:col-span-3 py-8 text-center text-gray-500">
            No businesses found matching your criteria. Try adjusting your filters.
          </div>
        )}
      </div>
    </div>
  );
} 