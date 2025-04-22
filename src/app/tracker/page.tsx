"use client";

import { useState } from 'react';

// Define interface for perk object
interface Perk {
  id: number;
  business: string;
  perk: string;
  expiryDate: string;
  reminder: boolean;
  notes: string;
  status: string;
}

export default function PersonalTrackerPage() {
  const [perks, setPerks] = useState<Perk[]>([
    {
      id: 1,
      business: "Starbucks",
      perk: "Free drink of your choice",
      expiryDate: "2023-04-26",
      reminder: true,
      notes: "Must be a Starbucks Rewards member. Show app.",
      status: "To Redeem"
    },
    {
      id: 2,
      business: "Sephora",
      perk: "Free beauty gift",
      expiryDate: "2023-04-30",
      reminder: true,
      notes: "Beauty Insider membership required. Valid in-store or online.",
      status: "Expiring Soon"
    }
  ]);

  const [formData, setFormData] = useState<Perk>({
    id: 0,
    business: "",
    perk: "",
    expiryDate: "",
    reminder: false,
    notes: "",
    status: "To Redeem"
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Add the new perk with a unique ID
    setPerks([
      ...perks,
      {
        ...formData,
        id: Date.now() // Use timestamp as a simple unique ID
      }
    ]);
    
    // Reset the form
    setFormData({
      id: 0,
      business: "",
      perk: "",
      expiryDate: "",
      reminder: false,
      notes: "",
      status: "To Redeem"
    });
  };

  const getStatusColor = (status: string): string => {
    switch(status) {
      case 'To Redeem':
        return 'bg-blue-100 text-blue-800';
      case 'Expiring Soon':
        return 'bg-yellow-100 text-yellow-800';
      case 'Redeemed':
        return 'bg-green-100 text-green-800';
      case 'Expired':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Personal Tracker</h1>
        <p className="text-lg text-gray-600">Add and track birthday perks from your favorite businesses</p>
      </div>
      
      {/* Add New Perk Form */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Perk</h2>
        
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
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="To Redeem">To Redeem</option>
                <option value="Expiring Soon">Expiring Soon</option>
                <option value="Redeemed">Redeemed</option>
                <option value="Expired">Expired</option>
              </select>
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
            
            <div className="md:col-span-2 flex items-center">
              <input
                type="checkbox"
                id="reminder"
                name="reminder"
                checked={formData.reminder}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="reminder" className="ml-2 block text-sm text-gray-700">
                Set reminder before expiry
              </label>
            </div>
          </div>
          
          <div className="mt-6">
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-lg shadow-md hover:from-blue-600 hover:to-indigo-700 transition-all duration-200"
            >
              Add Perk
            </button>
          </div>
        </form>
      </div>
      
      {/* My Perks List */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <h2 className="text-xl font-semibold p-6 border-b border-gray-200">My Tracked Perks</h2>
        
        {perks.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Business
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Perk
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expiry Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {perks.map((perk) => (
                  <tr key={perk.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {perk.business}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {perk.perk}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(perk.expiryDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(perk.status)}`}>
                        {perk.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {perk.notes}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                      <button className="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">
            You haven&apos;t added any perks yet. Use the form above to add your first perk!
          </div>
        )}
      </div>
    </div>
  );
} 