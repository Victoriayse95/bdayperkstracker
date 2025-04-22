"use client";

import { useState } from 'react';

// Define type for redemption objects
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
      requirements: "Must be a rewards member",
      notes: "Valid for any handcrafted beverage",
      value: "$6.50"
    },
    {
      id: 2,
      business: "Sephora",
      perk: "Birthday beauty gift",
      expiryDate: "2023-05-15",
      redeemed: true,
      redemptionDate: "2023-04-23",
      requirements: "Beauty Insider membership required",
      notes: "Received mini mascara and lipstick set",
      value: "$25.00"
    }
  ]);

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

  // Calculate days until expiry
  const getDaysUntilExpiry = (dateString: string): number => {
    const today = new Date();
    const expiryDate = new Date(dateString);
    const timeDiff = expiryDate.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  // Handler for form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    if (type === 'checkbox' && name === 'redeemed') {
      setFormData({
        ...formData,
        redeemed: checked as boolean,
        redemptionDate: checked ? new Date().toISOString().split('T')[0] : null
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Handler for form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    setRedemptions([
      ...redemptions,
      {
        ...formData,
        id: Date.now()
      }
    ]);
    
    // Reset form
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

  // Mark redemption as redeemed
  const handleMarkRedeemed = (id: number) => {
    setRedemptions(
      redemptions.map(item => 
        item.id === id 
          ? { ...item, redeemed: true, redemptionDate: new Date().toISOString().split('T')[0] } 
          : item
      )
    );
  };

  // Get status color based on redemption status and days until expiry
  const getStatusColor = (redemption: Redemption): string => {
    if (redemption.redeemed) {
      return "bg-green-100 text-green-800"; // Redeemed
    }
    
    const daysLeft = getDaysUntilExpiry(redemption.expiryDate);
    
    if (daysLeft <= 0) {
      return "bg-red-100 text-red-800"; // Expired
    } else if (daysLeft <= 7) {
      return "bg-yellow-100 text-yellow-800"; // Expiring soon
    } else {
      return "bg-blue-100 text-blue-800"; // Valid
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Redemption Tracking</h1>
        <p className="text-lg text-gray-600">Track your birthday perk redemptions</p>
      </div>
      
      {/* Add New Redemption Form */}
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
                placeholder="e.g. $10.00"
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
                placeholder="Any specific requirements to redeem"
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
                placeholder="Any additional notes about this perk"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              ></textarea>
            </div>
          </div>
          
          <div className="mt-6">
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-lg shadow-md hover:from-indigo-600 hover:to-purple-700 transition-all duration-200"
            >
              Add Redemption
            </button>
          </div>
        </form>
      </div>
      
      {/* Redemption List */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <h2 className="text-xl font-semibold p-6 border-b border-gray-200">Your Redemption Items</h2>
        
        {redemptions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Perk</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {redemptions.map((redemption) => {
                  const daysLeft = getDaysUntilExpiry(redemption.expiryDate);
                  const statusClass = getStatusColor(redemption);
                  
                  return (
                    <tr key={redemption.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{redemption.business}</div>
                        {redemption.requirements && (
                          <div className="text-xs text-gray-500 mt-1">{redemption.requirements}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{redemption.perk}</div>
                        {redemption.notes && (
                          <div className="text-xs text-gray-500 mt-1">{redemption.notes}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClass}`}>
                          {redemption.redeemed 
                            ? `Redeemed on ${new Date(redemption.redemptionDate as string).toLocaleDateString()}`
                            : daysLeft > 0 
                              ? `${daysLeft} days left` 
                              : 'Expired'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {redemption.value}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {!redemption.redeemed && daysLeft > 0 && (
                          <button 
                            onClick={() => handleMarkRedeemed(redemption.id)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            Mark Redeemed
                          </button>
                        )}
                        <button className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                        <button className="text-red-600 hover:text-red-900">Delete</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">
            You haven&apos;t added any redemption items yet. Use the form above to start tracking your birthday perks!
          </div>
        )}
      </div>
    </div>
  );
} 