"use client";

import Link from 'next/link';
import { useState } from 'react';

export default function NewPerkPage() {
  const [formData, setFormData] = useState({
    businessName: '',
    contactNumber: '',
    category: '',
    expiryDate: '',
    value: '',
    notes: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would submit to a backend API
    console.log('Form submitted:', formData);
    alert('Perk added successfully!');
    // Reset form or redirect
    setFormData({
      businessName: '',
      contactNumber: '',
      category: '',
      expiryDate: '',
      value: '',
      notes: ''
    });
  };

  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="my-6">
        <h1 className="text-3xl font-bold text-gray-900">Add New Perk</h1>
        <p className="mt-2 text-gray-600">
          Fill in the details to create a new birthday perk.
        </p>
      </div>

      <div className="bg-white shadow sm:rounded-lg p-6 max-w-3xl mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <h2 className="text-xl font-medium text-gray-900 mb-4">Business Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
                  Business Name
                </label>
                <input
                  type="text"
                  name="businessName"
                  id="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 rounded-md w-full"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Number
                </label>
                <input
                  type="text"
                  name="contactNumber"
                  id="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 rounded-md w-full"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                name="category"
                id="category"
                value={formData.category}
                onChange={handleChange}
                className="px-3 py-2 border border-gray-300 rounded-md w-full"
                required
              >
                <option value="">Select a category</option>
                <option value="Food & Dessert">Food & Dessert</option>
                <option value="Coffee & Drinks">Coffee & Drinks</option>
                <option value="Beauty">Beauty</option>
                <option value="Restaurants">Restaurants</option>
                <option value="Retail">Retail</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-medium text-gray-900 mb-4">Perk Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date
                </label>
                <input
                  type="date"
                  name="expiryDate"
                  id="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 rounded-md w-full"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-1">
                  Value
                </label>
                <input
                  type="text"
                  name="value"
                  id="value"
                  value={formData.value}
                  onChange={handleChange}
                  placeholder="$0.00"
                  className="px-3 py-2 border border-gray-300 rounded-md w-full"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                name="notes"
                id="notes"
                rows={4}
                value={formData.notes}
                onChange={handleChange}
                className="px-3 py-2 border border-gray-300 rounded-md w-full"
                placeholder="Enter details about the perk, requirements, etc."
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <Link
              href="/perks"
              className="px-4 py-2 border border-gray-300 text-sm rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Save Perk
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 