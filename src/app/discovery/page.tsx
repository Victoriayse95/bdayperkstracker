"use client";

import { useState } from 'react';
import Image from 'next/image';

// Define type for business perks
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
      category: "Coffee & Tea",
      description: "Free handcrafted beverage of your choice on your birthday",
      value: "$5-7",
      requirements: "Must be a Starbucks Rewards member for at least 7 days",
      location: "Multiple locations",
      distance: 0.5,
      rating: 4.5,
      imageUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/Starbucks_Corporation_Logo_2011.svg/1200px-Starbucks_Corporation_Logo_2011.svg.png",
      website: "https://www.starbucks.com/rewards",
      favorite: false
    },
    {
      id: 2,
      business: "Sephora",
      category: "Beauty",
      description: "Free beauty gift during your birthday month",
      value: "$20",
      requirements: "Must be a Beauty Insider member",
      location: "Main Street Mall",
      distance: 1.2,
      rating: 4.7,
      imageUrl: "https://logos-world.net/wp-content/uploads/2020/11/Sephora-Logo.png",
      website: "https://www.sephora.com/beauty/birthday-gift",
      favorite: true
    },
    {
      id: 3,
      business: "Baskin-Robbins",
      category: "Ice Cream",
      description: "Free scoop of ice cream on your birthday",
      value: "$3-4",
      requirements: "Sign up for Birthday Club",
      location: "Downtown",
      distance: 2.0,
      rating: 4.3,
      imageUrl: "https://logos-world.net/wp-content/uploads/2021/08/Baskin-Robbins-Symbol.png",
      website: "https://www.baskinrobbins.com/en/birthday-club",
      favorite: false
    },
    {
      id: 4,
      business: "Ulta Beauty",
      category: "Beauty",
      description: "$10 off your purchase during your birthday month",
      value: "$10",
      requirements: "Must be an Ultamate Rewards member",
      location: "Westfield Mall",
      distance: 3.5,
      rating: 4.6,
      imageUrl: "https://logos-world.net/wp-content/uploads/2021/11/Ulta-Beauty-Symbol.png",
      website: "https://www.ulta.com/ulta-rewards",
      favorite: false
    },
    {
      id: 5,
      business: "Denny's",
      category: "Restaurant",
      description: "Free Grand Slam breakfast on your birthday",
      value: "$8-10",
      requirements: "Show valid ID",
      location: "Highway Plaza",
      distance: 5.1,
      rating: 3.9,
      imageUrl: "https://logos-world.net/wp-content/uploads/2021/08/Dennys-Symbol.png",
      website: "https://www.dennys.com",
      favorite: false
    },
    {
      id: 6,
      business: "Macy's",
      category: "Department Store",
      description: "Special birthday discount of 15% off",
      value: "Varies",
      requirements: "Star Rewards member",
      location: "City Center",
      distance: 4.2,
      rating: 4.0,
      imageUrl: "https://logos-world.net/wp-content/uploads/2020/11/Macys-Logo-700x394.png",
      website: "https://www.macys.com/rewards",
      favorite: false
    }
  ]);

  // State for filters
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("distance");
  const [maxDistance, setMaxDistance] = useState<number>(10);

  // All available categories from businesses
  const categories = [...new Set(businesses.map(business => business.category))];

  // Filter and sort businesses based on user input
  const filteredBusinesses = businesses
    .filter(business => {
      // Apply search filter
      const matchesSearch = searchTerm === "" || 
        business.business.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Apply category filter
      const matchesCategory = selectedCategory === "" || business.category === selectedCategory;
      
      // Apply distance filter
      const matchesDistance = business.distance <= maxDistance;
      
      return matchesSearch && matchesCategory && matchesDistance;
    })
    .sort((a, b) => {
      // Apply sorting
      if (sortBy === "distance") {
        return a.distance - b.distance;
      } else if (sortBy === "rating") {
        return b.rating - a.rating;
      } else if (sortBy === "value") {
        // Simple sorting for value (not perfect due to string comparison)
        return b.value.localeCompare(a.value);
      }
      return 0;
    });

  // Toggle favorite status
  const toggleFavorite = (id: number) => {
    setBusinesses(
      businesses.map(business => 
        business.id === id 
          ? { ...business, favorite: !business.favorite } 
          : business
      )
    );
  };

  // Save perk to personal tracker
  const savePerk = (business: BusinessPerk) => {
    // This would typically save to a database or local storage
    alert(`Added ${business.business}'s perk to your tracker!`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover Birthday Perks</h1>
        <p className="text-lg text-gray-600">Find new perks from businesses near you</p>
      </div>
      
      {/* Filters Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
              <option value="">All Categories</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>{category}</option>
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
          
          <div>
            <label htmlFor="maxDistance" className="block text-sm font-medium text-gray-700 mb-1">
              Max Distance: {maxDistance} miles
            </label>
            <input
              type="range"
              id="maxDistance"
              min="1"
              max="20"
              value={maxDistance}
              onChange={(e) => setMaxDistance(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>
      
      {/* Business Grid */}
      {filteredBusinesses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBusinesses.map((business) => (
            <div key={business.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="relative h-48 w-full">
                <Image
                  src={business.imageUrl}
                  alt={`${business.business} logo`}
                  className="object-contain"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <button 
                  onClick={() => toggleFavorite(business.id)}
                  className="absolute top-2 right-2 p-2 rounded-full bg-white shadow-md"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill={business.favorite ? "currentColor" : "none"}
                    stroke="currentColor" 
                    strokeWidth="2" 
                    className={`${business.favorite ? 'text-red-500' : 'text-gray-400'}`}
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </button>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{business.business}</h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {business.category}
                  </span>
                </div>
                
                <p className="text-gray-700 mb-4">{business.description}</p>
                
                <div className="flex items-center mb-4">
                  <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  <span className="ml-1 text-gray-600">{business.rating}</span>
                  <span className="mx-2 text-gray-300">•</span>
                  <span className="text-gray-600">{business.distance} miles away</span>
                </div>
                
                <div className="flex flex-col space-y-2 mb-4">
                  <div className="flex items-start">
                    <span className="text-xs font-medium text-gray-500 w-24">Value:</span>
                    <span className="text-xs text-gray-700">{business.value}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-xs font-medium text-gray-500 w-24">Requirements:</span>
                    <span className="text-xs text-gray-700">{business.requirements}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-xs font-medium text-gray-500 w-24">Location:</span>
                    <span className="text-xs text-gray-700">{business.location}</span>
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <button 
                    onClick={() => savePerk(business)}
                    className="flex-1 py-2 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-200"
                  >
                    Save to Tracker
                  </button>
                  <a 
                    href={business.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-all duration-200 text-center"
                  >
                    Visit Website
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <p className="text-lg text-gray-500">No businesses match your search criteria. Try adjusting your filters.</p>
        </div>
      )}
    </div>
  );
} 