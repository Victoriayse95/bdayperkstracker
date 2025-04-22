"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/solid';

// TypeScript interfaces
interface Redemption {
  id: number;
  business: string;
  perk: string;
  expiryDate: string;
  redeemed: boolean;
  redemptionDate: string | null;
  requirements: string;
  notes: string;
  value: string;
}

export default function RedemptionTrackingPage() {
  const [redemptions, setRedemptions] = useState<Redemption[]>([
    {
      id: 1,
      business: "Starbucks",
      perk: "Free birthday drink",
      expiryDate: "2023-05-15",
      redeemed: false,
      redemptionDate: null,
      requirements: "Starbucks Rewards membership required",
      notes: "Mobile app required for redemption",
      value: "$5-7"
    },
    {
      id: 2,
      business: "Sephora",
      perk: "Free beauty gift",
      expiryDate: "2023-05-15",
      redeemed: true,
      redemptionDate: "2023-05-10",
      requirements: "Beauty Insider membership required",
      notes: "Chose the skincare set option",
      value: "$10"
    },
    {
      id: 3,
      business: "Baskin-Robbins",
      perk: "Free ice cream scoop",
      expiryDate: "2023-04-30",
      redeemed: false,
      redemptionDate: null,
      requirements: "Birthday club membership required",
      notes: "Valid for a single scoop only",
      value: "$3"
    }
  ]);

  // For the redemption form
  const [formData, setFormData] = useState<Redemption>({
    id: 0,
    business: "",
    perk: "",
    expiryDate: "",
    redeemed: false,
    redemptionDate: null,
    requirements: "",
    notes: "",
    value: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    // Special handling for the redemption checkbox
    if (name === 'redeemed') {
      setFormData({
        ...formData,
        redeemed: checked || false,
        redemptionDate: checked ? new Date().toISOString().split('T')[0] : null
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Add new redemption with a unique ID
    setRedemptions([
      ...redemptions,
      {
        ...formData,
        id: Date.now()
      }
    ]);
    
    // Reset the form
    setFormData({
      id: 0,
      business: "",
      perk: "",
      expiryDate: "",
      redeemed: false,
      redemptionDate: null,
      requirements: "",
      notes: "",
      value: ""
    });
  };

  // Mark an existing redemption as redeemed
  const handleMarkRedeemed = (id: number) => {
    setRedemptions(redemptions.map(item => 
      item.id === id 
        ? { ...item, redeemed: true, redemptionDate: new Date().toISOString().split('T')[0] } 
        : item
    ));
  };
  
  // Calculate days until expiry
  const getDaysUntilExpiry = (dateString: string): number => {
    const today = new Date();
    const expiryDate = new Date(dateString);
    const timeDiff = expiryDate.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Redemption Tracking</h1>
        <p className="text-lg text-gray-600">Keep track of redemption dates and requirements</p>
      </div>
      
      {/* Add New Redemption Item Form */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Redemption Item</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="business" className="block text-sm font-medium text-gray-700 mb-1">
                Business Name
              </label>
              <input
                type="text"
                id="business"
                name="business"
                value={formData.business}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label htmlFor="perk" className="block text-sm font-medium text-gray-700 mb-1">
                Perk Description
              </label>
              <input
                type="text"
                id="perk"
                name="perk"
                value={formData.perk}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Date
              </label>
              <input
                type="date"
                id="expiryDate"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-1">
                Estimated Value
              </label>
              <input
                type="text"
                id="value"
                name="value"
                value={formData.value}
                onChange={handleInputChange}
                placeholder="e.g. $5, $10-15"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-1">
                Requirements
              </label>
              <input
                type="text"
                id="requirements"
                name="requirements"
                value={formData.requirements}
                onChange={handleInputChange}
                placeholder="e.g. Membership required"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="redeemed"
                name="redeemed"
                checked={formData.redeemed}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="redeemed" className="ml-2 block text-sm text-gray-700">
                Already Redeemed
              </label>
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              ></textarea>
            </div>
          </div>
          
          <div className="mt-6">
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-lg shadow-md hover:from-green-600 hover:to-emerald-700 transition-all duration-200"
            >
              Add Redemption Item
            </button>
          </div>
        </form>
      </div>
      
      {/* Redemption Tracking List */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Redemption Items</h2>
          <div className="flex space-x-4">
            <button className="text-sm text-indigo-600 hover:text-indigo-800">All</button>
            <button className="text-sm text-gray-500 hover:text-gray-700">To Redeem</button>
            <button className="text-sm text-gray-500 hover:text-gray-700">Redeemed</button>
          </div>
        </div>
        
        {redemptions.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {redemptions.map((item) => {
              const daysUntilExpiry = getDaysUntilExpiry(item.expiryDate);
              const isExpired = daysUntilExpiry < 0;
              const isExpiringSoon = daysUntilExpiry >= 0 && daysUntilExpiry <= 7;
              
              return (
                <div key={item.id} className="p-6 flex flex-col md:flex-row">
                  <div className="flex-1">
                    <div className="flex items-start">
                      <div className={`mt-1 mr-4 flex-shrink-0 w-3 h-3 rounded-full ${
                        item.redeemed 
                          ? 'bg-green-500' 
                          : isExpired 
                            ? 'bg-gray-400' 
                            : isExpiringSoon 
                              ? 'bg-yellow-500' 
                              : 'bg-blue-500'
                      }`}></div>
                      
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{item.business}</h3>
                        <p className="mt-1 text-sm text-gray-500">{item.perk}</p>
                        
                        <div className="mt-2 flex flex-wrap gap-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {item.value ? `Value: ${item.value}` : 'No value specified'}
                          </span>
                          
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item.redeemed 
                              ? 'bg-green-100 text-green-800' 
                              : isExpired 
                                ? 'bg-gray-100 text-gray-800' 
                                : isExpiringSoon 
                                  ? 'bg-yellow-100 text-yellow-800' 
                                  : 'bg-blue-100 text-blue-800'
                          }`}>
                            {item.redeemed 
                              ? `Redeemed on ${new Date(item.redemptionDate!).toLocaleDateString()}` 
                              : isExpired 
                                ? 'Expired' 
                                : `Expires ${daysUntilExpiry === 0 ? 'today' : `in ${daysUntilExpiry} days`}`}
                          </span>
                        </div>
                        
                        {item.requirements && (
                          <p className="mt-2 text-xs text-gray-500">
                            <span className="font-medium">Requirements:</span> {item.requirements}
                          </p>
                        )}
                        
                        {item.notes && (
                          <p className="mt-1 text-xs text-gray-500">
                            <span className="font-medium">Notes:</span> {item.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 md:mt-0 md:ml-6 flex items-center">
                    {!item.redeemed && !isExpired && (
                      <button 
                        onClick={() => handleMarkRedeemed(item.id)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        Mark as Redeemed
                      </button>
                    )}
                    
                    <button className="ml-3 text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                      Edit
                    </button>
                    
                    <button className="ml-3 text-red-600 hover:text-red-900 text-sm font-medium">
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">
            You haven't added any redemption items yet. Use the form above to add your first item!
          </div>
        )}
      </div>
    </div>
  );
} 